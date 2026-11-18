import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SubscriptionStatus } from '../generated/prisma/client.js';
import type { CreateSubscriptionDto } from './dto/create-subscription.dto.js';
import type { UpdateSubscriptionDto } from './dto/update-subscription.dto.js';

const include = {
  usuario: { select: { id: true, nome: true, email: true } },
  plano: {
    select: {
      id: true,
      nome: true,
      descricao: true,
      preco: true,
      duracaoMeses: true,
    },
  },
};

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  private hoje(): Date {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  private addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setUTCMonth(d.getUTCMonth() + months);
    return d;
  }

  // Sincroniza no banco as assinaturas que venceram
  private async syncExpiredSubscriptions() {
    await this.prisma.subscription.updateMany({
      where: {
        status: SubscriptionStatus.ATIVA,
        dataFim: { lt: this.hoje() },
      },
      data: {
        status: SubscriptionStatus.EXPIRADA,
      },
    });
  }

  // Garante que mesmo em criação/edição com data passada o retorno já venha EXPIRADA
  private present<
    T extends { status: SubscriptionStatus; dataFim: Date | null },
  >(s: T): T {
    if (
      s.status === SubscriptionStatus.ATIVA &&
      s.dataFim &&
      s.dataFim < this.hoje()
    ) {
      return { ...s, status: SubscriptionStatus.EXPIRADA };
    }
    return s;
  }

  private checkDates(inicio: Date, fim: Date | null) {
    if (fim && fim < inicio) {
      throw new BadRequestException(
        'A data de fim não pode ser anterior à data de início',
      );
    }
  }

  async create(dto: CreateSubscriptionDto) {
    await this.syncExpiredSubscriptions();

    const user = await this.prisma.user.findUnique({
      where: { id: dto.usuarioId },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const plan = await this.prisma.plan.findUnique({
      where: { id: dto.planoId },
    });
    if (!plan || !plan.ativo) {
      throw new BadRequestException('Plano não encontrado ou inativo');
    }

    // Um cadastro ativo/pendente por usuário (canceladas e expiradas não bloqueiam)
    const existente = await this.prisma.subscription.findFirst({
      where: {
        usuarioId: dto.usuarioId,
        status: {
          in: [SubscriptionStatus.ATIVA, SubscriptionStatus.PENDENTE],
        },
      },
    });
    if (existente) {
      throw new ConflictException('Este usuário já possui uma inscrição');
    }

    const dataInicio = dto.dataInicio ?? this.hoje();
    const dataFim =
      dto.dataFim ?? this.addMonths(dataInicio, plan.duracaoMeses);
    this.checkDates(dataInicio, dataFim);

    const created = await this.prisma.subscription.create({
      data: {
        usuarioId: dto.usuarioId,
        planoId: dto.planoId,
        dataInicio,
        dataFim,
        status: dto.status,
      },
      include,
    });
    return this.present(created);
  }

  async findAll(filtros: { usuarioId?: number; status?: SubscriptionStatus }) {
    await this.syncExpiredSubscriptions();

    return this.prisma.subscription.findMany({
      where: {
        usuarioId: filtros.usuarioId,
        // Mantém a regra original: se não filtrar status, esconde as CANCELADAS.
        // Se passar ?status=CANCELADA (ou ATIVA / EXPIRADA), traz exatamente o status pedido!
        status: filtros.status ?? { not: SubscriptionStatus.CANCELADA },
      },
      include,
      orderBy: { criadoEm: 'desc' },
    });
  }

  private async find(id: number) {
    await this.syncExpiredSubscriptions();

    const sub = await this.prisma.subscription.findUnique({
      where: { id },
      include,
    });
    if (!sub) throw new NotFoundException('Inscrição não encontrada');
    return sub;
  }

  async findOne(id: number) {
    return this.present(await this.find(id));
  }

  async update(id: number, dto: UpdateSubscriptionDto) {
    const atual = await this.find(id);

    if (dto.planoId) {
      const plan = await this.prisma.plan.findUnique({
        where: { id: dto.planoId },
      });
      if (!plan || !plan.ativo) {
        throw new BadRequestException('Plano não encontrado ou inativo');
      }
    }

    this.checkDates(
      dto.dataInicio ?? atual.dataInicio,
      dto.dataFim ?? atual.dataFim,
    );

    const updated = await this.prisma.subscription.update({
      where: { id },
      data: {
        planoId: dto.planoId,
        dataInicio: dto.dataInicio,
        dataFim: dto.dataFim,
        status: dto.status,
      },
      include,
    });
    return this.present(updated);
  }

  // Cancelamento lógico: não apaga, só marca como cancelada
  async remove(id: number) {
    await this.find(id);
    return this.prisma.subscription.update({
      where: { id },
      data: { status: SubscriptionStatus.CANCELADA },
      include,
    });
  }
}
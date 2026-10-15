import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateProfessionalDto } from './dto/create-professional.dto.js';
import type { UpdateProfessionalDto } from './dto/update-professional.dto.js';

// Traz nome e e-mail do usuário, e NUNCA a senha
const include = {
  usuario: { select: { id: true, nome: true, email: true } },
};

@Injectable()
export class ProfessionalsService {
  constructor(private readonly prisma: PrismaService) {}

  private toId(id: string): bigint {
    try {
      return BigInt(id);
    } catch {
      throw new BadRequestException('ID inválido');
    }
  }

  async create(dto: CreateProfessionalDto) {
    const usuarioId = BigInt(dto.usuarioId);

    const user = await this.prisma.user.findUnique({ where: { id: usuarioId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const exists = await this.prisma.professional.findUnique({
      where: { usuarioId },
    });
    if (exists) throw new ConflictException('Este usuário já é profissional');

    return this.prisma.professional.create({
      data: {
        usuarioId,
        especializacao: dto.especializacao,
        biografia: dto.biografia,
        urlFoto: dto.urlFoto,
      },
      include,
    });
  }

  findAll() {
    return this.prisma.professional.findMany({
      where: { ativo: true },
      include,
    });
  }

  async findOne(id: string) {
    const prof = await this.prisma.professional.findUnique({
      where: { id: this.toId(id) },
      include,
    });
    if (!prof) throw new NotFoundException('Profissional não encontrado');
    return prof;
  }

  async update(id: string, dto: UpdateProfessionalDto) {
    await this.findOne(id);
    return this.prisma.professional.update({
      where: { id: this.toId(id) },
      data: dto,
      include,
    });
  }

  // Desativação lógica (RN004)
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.professional.update({
      where: { id: this.toId(id) },
      data: { ativo: false },
      include,
    });
  }
}
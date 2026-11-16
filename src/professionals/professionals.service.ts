import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateProfessionalDto } from './dto/create-professional.dto.js';
import type { UpdateProfessionalDto } from './dto/update-professional.dto.js';

// Traz nome e e-mail do usuário, nunca a senha.
const include = {
  usuario: {
    select: {
      id: true,
      nome: true,
      email: true,
    },
  },
};

@Injectable()
export class ProfessionalsService {
  constructor(private readonly prisma: PrismaService) {}

  private validateId(id: number): number {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new BadRequestException('ID inválido');
    }

    return id;
  }

  async create(dto: CreateProfessionalDto) {
    const usuarioId = Number(dto.usuarioId);

    if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
      throw new BadRequestException('ID de usuário inválido');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: usuarioId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const exists = await this.prisma.professional.findUnique({
      where: { usuarioId },
    });

    if (exists) {
      throw new ConflictException('Este usuário já é profissional');
    }

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

  async findOne(id: number) {
    const professionalId = this.validateId(id);

    const professional = await this.prisma.professional.findUnique({
      where: { id: professionalId },
      include,
    });

    if (!professional) {
      throw new NotFoundException('Profissional não encontrado');
    }

    return professional;
  }

  async update(id: number, dto: UpdateProfessionalDto) {
    const professionalId = this.validateId(id);

    await this.findOne(professionalId);

    return this.prisma.professional.update({
      where: { id: professionalId },
      data: dto,
      include,
    });
  }

  // Desativação lógica (RN004).
  async remove(id: number) {
    const professionalId = this.validateId(id);

    await this.findOne(professionalId);

    return this.prisma.professional.update({
      where: { id: professionalId },
      data: { ativo: false },
      include,
    });
  }
}

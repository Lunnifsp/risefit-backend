import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreatePlanDto } from './dto/create-plan.dto.js';
import type { UpdatePlanDto } from './dto/update-plan.dto.js';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  private toId(id: string): bigint {
    try {
      return BigInt(id);
    } catch {
      throw new BadRequestException('ID inválido');
    }
  }

  create(dto: CreatePlanDto) {
    return this.prisma.plan.create({ data: dto });
  }

  findAll() {
    return this.prisma.plan.findMany({ where: { ativo: true } });
  }

  async findOne(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id: this.toId(id) },
    });
    if (!plan) throw new NotFoundException('Plano não encontrado');
    return plan;
  }

  async update(id: string, dto: UpdatePlanDto) {
    await this.findOne(id);
    return this.prisma.plan.update({
      where: { id: this.toId(id) },
      data: dto,
    });
  }

  // Desativação lógica (RN004): não apaga, só marca como inativo
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.plan.update({
      where: { id: this.toId(id) },
      data: { ativo: false },
    });
  }
}
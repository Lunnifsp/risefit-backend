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

  private validateId(id: number): number {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new BadRequestException('ID inválido');
    }

    return id;
  }

  create(dto: CreatePlanDto) {
    return this.prisma.plan.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.plan.findMany({
      where: { ativo: true },
    });
  }

  async findOne(id: number) {
    const planId = this.validateId(id);

    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    return plan;
  }

  async update(id: number, dto: UpdatePlanDto) {
    const planId = this.validateId(id);

    await this.findOne(planId);

    return this.prisma.plan.update({
      where: { id: planId },
      data: dto,
    });
  }

  // Desativação lógica (RN004): não apaga, só marca como inativo.
  async remove(id: number) {
    const planId = this.validateId(id);

    await this.findOne(planId);

    return this.prisma.plan.update({
      where: { id: planId },
      data: { ativo: false },
    });
  }
}

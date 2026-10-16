import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateExerciseDto } from './dto/create-exercise.dto.js';
import type { UpdateExerciseDto } from './dto/update-exercise.dto.js';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  private toId(id: string): bigint {
    try {
      return BigInt(id);
    } catch {
      throw new BadRequestException('ID inválido');
    }
  }

  create(dto: CreateExerciseDto) {
    return this.prisma.exercise.create({ data: dto });
  }

  // Filtros opcionais: /exercises?grupoMuscular=Peito&nivel=INICIANTE
  findAll(grupoMuscular?: string, nivel?: string) {
    return this.prisma.exercise.findMany({
      where: {
        ativo: true,
        ...(grupoMuscular && { grupoMuscular }),
        ...(nivel && { nivel: nivel as any }),
      },
    });
  }

  async findOne(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: this.toId(id) },
    });
    if (!exercise) throw new NotFoundException('Exercício não encontrado');
    return exercise;
  }

  async update(id: string, dto: UpdateExerciseDto) {
    await this.findOne(id);
    return this.prisma.exercise.update({
      where: { id: this.toId(id) },
      data: dto,
    });
  }

  // Desativação lógica (RN004)
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.exercise.update({
      where: { id: this.toId(id) },
      data: { ativo: false },
    });
  }
}
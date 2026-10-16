import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service.js';
import { createExerciseSchema } from './dto/create-exercise.dto.js';
import type { CreateExerciseDto } from './dto/create-exercise.dto.js';
import { updateExerciseSchema } from './dto/update-exercise.dto.js';
import type { UpdateExerciseDto } from './dto/update-exercise.dto.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createExerciseSchema)) dto: CreateExerciseDto,
  ) {
    return this.exercisesService.create(dto);
  }

  @Get()
  findAll(
    @Query('grupoMuscular') grupoMuscular?: string,
    @Query('nivel') nivel?: string,
  ) {
    return this.exercisesService.findAll(grupoMuscular, nivel);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateExerciseSchema)) dto: UpdateExerciseDto,
  ) {
    return this.exercisesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(id);
  }
}
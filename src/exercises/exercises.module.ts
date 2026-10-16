import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service.js';
import { ExercisesController } from './exercises.controller.js';

@Module({
  controllers: [ExercisesController],
  providers: [ExercisesService],
})
export class ExercisesModule {}

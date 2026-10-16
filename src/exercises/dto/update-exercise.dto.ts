import { z } from 'zod';
import { createExerciseSchema } from './create-exercise.dto.js';

export const updateExerciseSchema = createExerciseSchema
  .partial()
  .extend({ ativo: z.boolean().optional() });

export type UpdateExerciseDto = z.infer<typeof updateExerciseSchema>;
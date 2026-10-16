import { z } from 'zod';

export const createExerciseSchema = z.object({
  nome: z.string().min(1).max(150),
  grupoMuscular: z.string().min(1).max(100),
  descricao: z.string().optional(),
  passoAPasso: z.string().min(1),
  errosComuns: z.string().optional(),
  nivel: z.enum(['INICIANTE', 'INTERMEDIARIO', 'AVANCADO']).optional(),
  urlVideo: z.string().url().max(255).optional(),
});

export type CreateExerciseDto = z.infer<typeof createExerciseSchema>;
import { z } from 'zod';

export const createPlanSchema = z.object({
  nome: z.string().min(1).max(100),
  descricao: z.string().optional(),
  preco: z.number().positive().max(999999.99),
  duracaoMeses: z.number().int().positive(),
});

export type CreatePlanDto = z.infer<typeof createPlanSchema>;
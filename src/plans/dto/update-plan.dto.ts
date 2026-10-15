import { z } from 'zod';
import { createPlanSchema } from './create-plan.dto.js';

export const updatePlanSchema = createPlanSchema
  .partial()
  .extend({ ativo: z.boolean().optional() });

export type UpdatePlanDto = z.infer<typeof updatePlanSchema>;
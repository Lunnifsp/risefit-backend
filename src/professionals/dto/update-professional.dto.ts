import { z } from 'zod';
import { createProfessionalSchema } from './create-professional.dto.js';

export const updateProfessionalSchema = createProfessionalSchema
  .omit({ usuarioId: true })
  .partial()
  .extend({ ativo: z.boolean().optional() });

export type UpdateProfessionalDto = z.infer<typeof updateProfessionalSchema>;
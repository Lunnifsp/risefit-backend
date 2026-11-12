import { z } from 'zod';

export const createProfessionalSchema = z.object({
  usuarioId: z.coerce.number().int().positive(),
  especializacao: z.string().min(1).max(145),
  biografia: z.string().optional(),
  urlFoto: z.string().url().max(255).optional(),
});

export type CreateProfessionalDto = z.infer<typeof createProfessionalSchema>;

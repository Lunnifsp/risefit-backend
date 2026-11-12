import { z } from 'zod';
import { SubscriptionStatus } from '../../generated/prisma/client.js';

export const createSubscriptionSchema = z.object({
  usuarioId: z.number().int().positive(),
  planoId: z.number().int().positive(),
  dataInicio: z.coerce.date().optional(), // padrão: hoje
  dataFim: z.coerce.date().optional(), // padrão: início + duração do plano
  status: z.enum(SubscriptionStatus).optional(), // padrão do banco: PENDENTE
});

export type CreateSubscriptionDto = z.infer<typeof createSubscriptionSchema>;

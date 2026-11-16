import { z } from 'zod';
import { SubscriptionStatus } from '../../generated/prisma/client.js';

export const updateSubscriptionSchema = z.object({
  planoId: z.number().int().positive().optional(),
  dataInicio: z.coerce.date().optional(),
  dataFim: z.coerce.date().optional(),
  status: z.enum(SubscriptionStatus).optional(),
});

export type UpdateSubscriptionDto = z.infer<typeof updateSubscriptionSchema>;

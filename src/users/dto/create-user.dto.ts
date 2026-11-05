
import { z } from 'zod';

export const createUserSchema = z.object({
  nome: z.string().min(1).max(100),
  email: z.string().email().max(150),
  senha: z.string().min(8).max(255),
  dataNascimento: z.iso.date(),
  telefone: z.string().min(1).max(20),
  cargo: z.enum(['ALUNO', 'PROFISSIONAL', 'ADMIN']).optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

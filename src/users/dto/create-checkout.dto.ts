import { z } from 'zod';

export const createUserSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório').max(100),
    email: z.string().email('E-mail inválido').max(150),
    senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres').max(255),
    dataNascimento: z.string().date('Data de nascimento inválida (AAAA-MM-DD)'),
    telefone: z.string().min(1, 'Telefone é obrigatório').max(20),
    cpf: z.string().min(11, 'CPF inválido').max(14),
    sexo: z.string().min(1, 'Sexo é obrigatório'),
    cargo: z.enum(['ALUNO', 'PROFISSIONAL', 'ADMIN']).optional().default('ALUNO'),
});

export const createEnderecoSchema = z.object({
    cep: z.string().min(8, 'CEP inválido').max(9),
    estado: z.string().length(2, 'Estado deve ter 2 letras'),
    cidade: z.string().min(1, 'Cidade é obrigatória'),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    rua: z.string().min(1, 'Rua é obrigatória'),
    numero: z.string().min(1, 'Número é obrigatório'),
    complemento: z.string().optional(),
});

export const createPagamentoSchema = z.object({
    token: z.string().min(1, 'Token de pagamento é obrigatório'),
    bandeira: z.string().min(1, 'Bandeira é obrigatória'),
    ultimosDigitos: z.string().length(4, 'Últimos dígitos devem conter 4 caracteres'),
});

export const createCheckoutSchema = z.object({
    usuario: createUserSchema,
    endereco: createEnderecoSchema,
    formaPagamento: z.enum(['credito', 'debito']),
    pagamento: createPagamentoSchema,
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type CreateCheckoutDto = z.infer<typeof createCheckoutSchema>;
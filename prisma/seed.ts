import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient, Cargo } from '../src/generated/prisma/client.js';

if (!process.env.DATABASE_URL) {
  throw new Error('A variável de ambiente DATABASE_URL não foi definida.');
}

const url = new URL(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...\n');

  // ==========================================
  // 1. Seed de Planos da Academia
  // ==========================================
  console.log('📋 Povoando Planos...');

  const plansToSeed = [
    {
      id: 1,
      nome: 'Plano Mensal - Basic',
      descricao: 'Acesso total à musculação e área cardio com pagamento mensal e sem taxa de fidelidade.',
      preco: 119.9,
      duracaoMeses: 1,
      ativo: true,
    },
    {
      id: 2,
      nome: 'Plano Trimestral - Fit',
      descricao: 'Acesso completo à academia + 1 avaliação física com bioimpedância e plano de 3 meses.',
      preco: 299.9,
      duracaoMeses: 3,
      ativo: true,
    },
    {
      id: 3,
      nome: 'Plano Anual - VIP',
      descricao: 'Acesso ilimitado, todas as aulas coletivas, acompanhamento nutricional mensal e taxa zero de matrícula.',
      preco: 999.0,
      duracaoMeses: 12,
      ativo: true,
    },
  ];

  for (const plan of plansToSeed) {
    const existingPlan = await prisma.plan.findFirst({
      where: {
        OR: [{ id: plan.id }, { nome: plan.nome }],
      },
    });

    const targetId = existingPlan ? existingPlan.id : plan.id;

    const seededPlan = await prisma.plan.upsert({
      where: { id: targetId },
      update: {
        nome: plan.nome,
        descricao: plan.descricao,
        preco: plan.preco,
        duracaoMeses: plan.duracaoMeses,
        ativo: plan.ativo,
      },
      create: {
        id: plan.id,
        nome: plan.nome,
        descricao: plan.descricao,
        preco: plan.preco,
        duracaoMeses: plan.duracaoMeses,
        ativo: plan.ativo,
      },
    });

    console.log(
      `✅ Plano configurado: ${seededPlan.nome} [${seededPlan.duracaoMeses} mês(es) - R$ ${Number(seededPlan.preco).toFixed(2)}]`,
    );
  }

  // ==========================================
  // 2. Seed de Usuários
  // ==========================================
  console.log('\n👤 Povoando Usuários...');

  const defaultPassword = 'SenhaForte@123';
  const hashedPassword = await bcrypt.hash(defaultPassword, SALT_ROUNDS);

  const usersToSeed = [
    {
      nome: 'Administrador RiseFit',
      email: 'admin@risefit.com',
      senha: hashedPassword,
      dataNascimento: new Date('1990-01-15'),
      telefone: '11999998888',
      cargo: Cargo.ADMIN,
    },
    {
      nome: 'Carlos Aluno',
      email: 'carlos.aluno@risefit.com',
      senha: hashedPassword,
      dataNascimento: new Date('1998-06-22'),
      telefone: '11988887777',
      cargo: Cargo.ALUNO,
    },
    {
      nome: 'Mariana Personal',
      email: 'mariana.personal@risefit.com',
      senha: hashedPassword,
      dataNascimento: new Date('1993-11-04'),
      telefone: '11977776666',
      cargo: Cargo.PROFISSIONAL,
    },
  ];

  let professionalUserId: number | null = null;

  for (const user of usersToSeed) {
    const seededUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        nome: user.nome,
        senha: user.senha,
        dataNascimento: user.dataNascimento,
        telefone: user.telefone,
        cargo: user.cargo,
      },
      create: user,
    });

    if (seededUser.cargo === Cargo.PROFISSIONAL) {
      professionalUserId = seededUser.id;
    }

    console.log(`✅ Usuário configurado: ${seededUser.email} [${seededUser.cargo}]`);
  }

  // ==========================================
  // 3. Seed de Profissionais
  // ==========================================
  console.log('\n🏋️ Povoando Profissionais...');

  if (!professionalUserId) {
    const professionalUser = await prisma.user.findUnique({
      where: { email: 'mariana.personal@risefit.com' },
    });
    professionalUserId = professionalUser?.id ?? null;
  }

  if (professionalUserId) {
    const seededProfessional = await prisma.professional.upsert({
      where: { usuarioId: professionalUserId },
      update: {
        especializacao: 'Personal Trainer & Treinamento Funcional (CREF 045123-G/SP)',
        biografia:
          'Bacharel em Educação Física, especialista em biomecânica, hipertrofia e reabilitação postural com mais de 8 anos de experiência.',
        urlFoto:
          'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=400',
        ativo: true,
      },
      create: {
        usuarioId: professionalUserId,
        especializacao: 'Personal Trainer & Treinamento Funcional (CREF 045123-G/SP)',
        biografia:
          'Bacharel em Educação Física, especialista em biomecânica, hipertrofia e reabilitação postural com mais de 8 anos de experiência.',
        urlFoto:
          'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=400',
        ativo: true,
      },
    });

    console.log(
      `✅ Profissional configurado: ID ${seededProfessional.id} (Usuário ID: ${seededProfessional.usuarioId}) - ${seededProfessional.especializacao}`,
    );
  } else {
    console.warn('⚠️ Usuário com perfil de PROFISSIONAL não encontrado para vínculo.');
  }

  console.log('\n✨ Seed finalizado com sucesso!');
}

main()
  .catch((error) => {
    console.error('❌ Erro durante a execução do seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

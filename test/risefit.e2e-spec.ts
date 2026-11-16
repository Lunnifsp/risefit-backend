/**
 * RiseFit Backend — Full E2E Test Suite
 *
 * This file tests ALL endpoints in the application in a single ordered suite
 * so foreign-key dependencies are respected (User → Professional, User → Order, etc.).
 *
 * Runner: Vitest + Supertest
 * Config:  vitest.config.e2e.ts
 * Command: npm run test:e2e
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getApp, getPrisma, closeApp } from './setup-e2e.js';

let app: INestApplication;
let server: any;

// Shared IDs populated during test runs (respects FK insertion order)
const ids = {
  user: 0,
  userForProfessional: 0,
  userForSubscription: 0,
  userForOrder: 0,
  professional: 0,
  plan: 0,
  planForSubscription: 0,
  product: 0,
  product2: 0,
  subscription: 0,
  order: 0,
  exercise: 0 as number | bigint,
};

beforeAll(async () => {
  app = await getApp();
  server = app.getHttpServer();
}, 30_000);

afterAll(async () => {
  // Cleanup created records in reverse FK order
  const prisma = getPrisma();

  try {
    // Orders (cascade: orderProducts, payments)
    if (ids.order) {
      await prisma.orderProduct.deleteMany({ where: { pedidoId: ids.order } });
      await prisma.payment.deleteMany({ where: { pedidoId: ids.order } });
      await prisma.order.deleteMany({ where: { id: ids.order } });
    }

    // Subscriptions
    if (ids.subscription) {
      await prisma.subscription.deleteMany({ where: { id: ids.subscription } });
    }

    // Professionals
    if (ids.professional) {
      await prisma.professional.deleteMany({ where: { id: ids.professional } });
    }

    // Exercises
    if (ids.exercise) {
      await prisma.exercise.deleteMany({ where: { id: ids.exercise } });
    }

    // Products
    if (ids.product) {
      await prisma.product.deleteMany({ where: { id: ids.product } });
    }
    if (ids.product2) {
      await prisma.product.deleteMany({ where: { id: ids.product2 } });
    }

    // Plans
    if (ids.plan) {
      await prisma.plan.deleteMany({ where: { id: ids.plan } });
    }
    if (ids.planForSubscription) {
      await prisma.plan.deleteMany({ where: { id: ids.planForSubscription } });
    }

    // Users (last — everything else depends on them)
    const userIds = [
      ids.user,
      ids.userForProfessional,
      ids.userForSubscription,
      ids.userForOrder,
    ].filter(Boolean);
    if (userIds.length) {
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
  } catch {
    // Ignore cleanup errors — test DB may be ephemeral
  }

  await closeApp();
}, 15_000);

// ============================================================================
// 1. AppController
// ============================================================================
describe('AppController /', () => {
  it('GET / → 200 "Hello World!"', async () => {
    const res = await request(server).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello World!');
  });
});

// ============================================================================
// 2. UsersController /users
// ============================================================================
describe('UsersController /users', () => {
  const uniqueSuffix = Date.now();

  // ---------- Success flows ----------
  it('POST /users → 201 creates a user', async () => {
    const res = await request(server)
      .post('/users')
      .send({
        nome: 'Test User',
        email: `testuser-${uniqueSuffix}@e2e.test`,
        senha: 'Str0ngP@ss',
        dataNascimento: '2000-01-15',
        telefone: '11999990000',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Test User');
    expect(res.body.email).toBe(`testuser-${uniqueSuffix}@e2e.test`);
    // Password must NOT be returned
    expect(res.body).not.toHaveProperty('senha');
    ids.user = res.body.id;
  });

  it('POST /users → creates user for Professional tests', async () => {
    const res = await request(server)
      .post('/users')
      .send({
        nome: 'Prof User',
        email: `profuser-${uniqueSuffix}@e2e.test`,
        senha: 'Str0ngP@ss',
        dataNascimento: '1990-05-20',
        telefone: '11999990001',
        cargo: 'PROFISSIONAL',
      });
    expect(res.status).toBe(201);
    ids.userForProfessional = res.body.id;
  });

  it('POST /users → creates user for Subscription tests', async () => {
    const res = await request(server)
      .post('/users')
      .send({
        nome: 'Sub User',
        email: `subuser-${uniqueSuffix}@e2e.test`,
        senha: 'Str0ngP@ss',
        dataNascimento: '1995-03-10',
        telefone: '11999990002',
      });
    expect(res.status).toBe(201);
    ids.userForSubscription = res.body.id;
  });

  it('POST /users → creates user for Order tests', async () => {
    const res = await request(server)
      .post('/users')
      .send({
        nome: 'Order User',
        email: `orderuser-${uniqueSuffix}@e2e.test`,
        senha: 'Str0ngP@ss',
        dataNascimento: '1993-08-25',
        telefone: '11999990003',
      });
    expect(res.status).toBe(201);
    ids.userForOrder = res.body.id;
  });

  it('GET /users → 200 returns array', async () => {
    const res = await request(server).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    // No password anywhere
    for (const u of res.body) {
      expect(u).not.toHaveProperty('senha');
    }
  });

  it('GET /users/:id → 200 returns the created user', async () => {
    const res = await request(server).get(`/users/${ids.user}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(ids.user);
    expect(res.body.nome).toBe('Test User');
    expect(res.body).not.toHaveProperty('senha');
  });

  it('PATCH /users/:id → 200 updates the user', async () => {
    const res = await request(server)
      .patch(`/users/${ids.user}`)
      .send({ nome: 'Updated User' });

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('Updated User');
  });

  // ---------- Error / validation flows ----------
  it('POST /users → 400 with missing required fields', async () => {
    const res = await request(server).post('/users').send({});
    expect(res.status).toBe(400);
  });

  it('POST /users → 400 with invalid email', async () => {
    const res = await request(server)
      .post('/users')
      .send({
        nome: 'Bad Email',
        email: 'not-an-email',
        senha: 'Str0ngP@ss',
        dataNascimento: '2000-01-01',
        telefone: '11999990000',
      });
    expect(res.status).toBe(400);
  });

  it('POST /users → 409 duplicate email', async () => {
    const res = await request(server)
      .post('/users')
      .send({
        nome: 'Dup User',
        email: `testuser-${uniqueSuffix}@e2e.test`,
        senha: 'Str0ngP@ss',
        dataNascimento: '2000-01-01',
        telefone: '11999990000',
      });
    expect(res.status).toBe(409);
  });

  it('GET /users/999999 → 404 user not found', async () => {
    const res = await request(server).get('/users/999999');
    expect(res.status).toBe(404);
  });

  it('GET /users/abc → 400 invalid param', async () => {
    const res = await request(server).get('/users/abc');
    expect(res.status).toBe(400);
  });
});

// ============================================================================
// 3. PlansController /plans
// ============================================================================
describe('PlansController /plans', () => {
  it('POST /plans → 201 creates a plan', async () => {
    const res = await request(server)
      .post('/plans')
      .send({
        nome: 'E2E Plan',
        descricao: 'Plan created during E2E test',
        preco: 149.9,
        duracaoMeses: 3,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('E2E Plan');
    ids.plan = res.body.id;
  });

  it('POST /plans → creates plan for Subscription tests', async () => {
    const res = await request(server)
      .post('/plans')
      .send({
        nome: 'Sub Plan',
        preco: 99.9,
        duracaoMeses: 1,
      });
    expect(res.status).toBe(201);
    ids.planForSubscription = res.body.id;
  });

  it('GET /plans → 200 returns active plans', async () => {
    const res = await request(server).get('/plans');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /plans/:id → 200 returns the created plan', async () => {
    const res = await request(server).get(`/plans/${ids.plan}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(ids.plan);
    expect(res.body.nome).toBe('E2E Plan');
  });

  it('PATCH /plans/:id → 200 updates the plan', async () => {
    const res = await request(server)
      .patch(`/plans/${ids.plan}`)
      .send({ preco: 199.9 });

    expect(res.status).toBe(200);
    expect(Number(res.body.preco)).toBeCloseTo(199.9);
  });

  it('POST /plans → 400 missing required fields', async () => {
    const res = await request(server).post('/plans').send({});
    expect(res.status).toBe(400);
  });

  it('GET /plans/999999 → 404 plan not found', async () => {
    const res = await request(server).get('/plans/999999');
    expect(res.status).toBe(404);
  });

  // DELETE (soft-delete / deactivation)
  it('DELETE /plans/:id → 200 soft-deletes (deactivates) the plan', async () => {
    const res = await request(server).delete(`/plans/${ids.plan}`);
    expect(res.status).toBe(200);
    expect(res.body.ativo).toBe(false);
  });
});

// ============================================================================
// 4. ProductsController /products
// ============================================================================
describe('ProductsController /products', () => {
  it('POST /products → 201 creates a product', async () => {
    const res = await request(server)
      .post('/products')
      .send({
        nome: 'E2E Whey Protein',
        descricao: 'Test supplement',
        preco: 89.9,
        estoque: 50,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('E2E Whey Protein');
    ids.product = res.body.id;
  });

  it('POST /products → creates second product for Order tests', async () => {
    const res = await request(server)
      .post('/products')
      .send({
        nome: 'E2E Creatine',
        preco: 49.9,
        estoque: 100,
      });
    expect(res.status).toBe(201);
    ids.product2 = res.body.id;
  });

  it('GET /products → 200 returns array', async () => {
    const res = await request(server).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /products/:id → 200 returns the product', async () => {
    const res = await request(server).get(`/products/${ids.product}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(ids.product);
  });

  it('PATCH /products/:id → 200 updates the product', async () => {
    const res = await request(server)
      .patch(`/products/${ids.product}`)
      .send({ preco: 99.9 });

    expect(res.status).toBe(200);
    expect(Number(res.body.preco)).toBeCloseTo(99.9);
  });

  it('POST /products → 400 missing nome', async () => {
    const res = await request(server)
      .post('/products')
      .send({ preco: 10.0 });
    expect(res.status).toBe(400);
  });

  it('GET /products/999999 → 404 not found', async () => {
    const res = await request(server).get('/products/999999');
    expect(res.status).toBe(404);
  });
});

// ============================================================================
// 5. ProfessionalsController /professionals
// ============================================================================
describe('ProfessionalsController /professionals', () => {
  it('POST /professionals → 201 creates a professional', async () => {
    const res = await request(server)
      .post('/professionals')
      .send({
        usuarioId: ids.userForProfessional,
        especializacao: 'E2E Personal Trainer',
        biografia: 'Testing bio',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.especializacao).toBe('E2E Personal Trainer');
    expect(res.body.usuario).toBeDefined();
    expect(res.body.usuario.id).toBe(ids.userForProfessional);
    ids.professional = res.body.id;
  });

  it('GET /professionals → 200 returns active professionals', async () => {
    const res = await request(server).get('/professionals');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /professionals/:id → 200 returns the professional with user info', async () => {
    const res = await request(server).get(`/professionals/${ids.professional}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(ids.professional);
    expect(res.body.usuario).toBeDefined();
    expect(res.body.usuario).toHaveProperty('nome');
    expect(res.body.usuario).toHaveProperty('email');
    // Password should never appear
    expect(res.body.usuario).not.toHaveProperty('senha');
  });

  it('PATCH /professionals/:id → 200 updates the professional', async () => {
    const res = await request(server)
      .patch(`/professionals/${ids.professional}`)
      .send({ biografia: 'Updated bio' });

    expect(res.status).toBe(200);
    expect(res.body.biografia).toBe('Updated bio');
  });

  it('POST /professionals → 409 duplicate user', async () => {
    const res = await request(server)
      .post('/professionals')
      .send({
        usuarioId: ids.userForProfessional,
        especializacao: 'Duplicate',
      });
    expect(res.status).toBe(409);
  });

  it('POST /professionals → 404 user not found', async () => {
    const res = await request(server)
      .post('/professionals')
      .send({
        usuarioId: 999999,
        especializacao: 'No user',
      });
    expect(res.status).toBe(404);
  });

  it('GET /professionals/999999 → 404 not found', async () => {
    const res = await request(server).get('/professionals/999999');
    expect(res.status).toBe(404);
  });

  // DELETE (soft-delete)
  it('DELETE /professionals/:id → 200 soft-deletes the professional', async () => {
    const res = await request(server).delete(`/professionals/${ids.professional}`);
    expect(res.status).toBe(200);
    expect(res.body.ativo).toBe(false);
  });
});

// ============================================================================
// 6. ExercisesController /exercises
// ============================================================================
describe('ExercisesController /exercises', () => {
  it('POST /exercises → 201 creates an exercise', async () => {
    const res = await request(server)
      .post('/exercises')
      .send({
        nome: 'E2E Supino Reto',
        grupoMuscular: 'Peito',
        passoAPasso: '1. Deite no banco. 2. Segure a barra. 3. Desça controladamente.',
        nivel: 'INTERMEDIARIO',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('E2E Supino Reto');
    ids.exercise = res.body.id;
  });

  it('GET /exercises → 200 returns array', async () => {
    const res = await request(server).get('/exercises');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /exercises?grupoMuscular=Peito → 200 filters by muscle group', async () => {
    const res = await request(server).get('/exercises?grupoMuscular=Peito');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    for (const ex of res.body) {
      expect(ex.grupoMuscular).toBe('Peito');
    }
  });

  it('GET /exercises?nivel=INTERMEDIARIO → 200 filters by level', async () => {
    const res = await request(server).get('/exercises?nivel=INTERMEDIARIO');
    expect(res.status).toBe(200);
    for (const ex of res.body) {
      expect(ex.nivel).toBe('INTERMEDIARIO');
    }
  });

  it('GET /exercises/:id → 200 returns the exercise', async () => {
    const res = await request(server).get(`/exercises/${ids.exercise}`);
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('E2E Supino Reto');
  });

  it('PATCH /exercises/:id → 200 updates the exercise', async () => {
    const res = await request(server)
      .patch(`/exercises/${ids.exercise}`)
      .send({ descricao: 'Updated description' });

    expect(res.status).toBe(200);
    expect(res.body.descricao).toBe('Updated description');
  });

  it('POST /exercises → 400 missing required fields', async () => {
    const res = await request(server).post('/exercises').send({});
    expect(res.status).toBe(400);
  });

  it('GET /exercises/999999 → 404 not found', async () => {
    const res = await request(server).get('/exercises/999999');
    expect(res.status).toBe(404);
  });

  // DELETE (soft-delete)
  it('DELETE /exercises/:id → 200 soft-deletes the exercise', async () => {
    const res = await request(server).delete(`/exercises/${ids.exercise}`);
    expect(res.status).toBe(200);
    expect(res.body.ativo).toBe(false);
  });
});

// ============================================================================
// 7. SubscriptionsController /subscriptions
// ============================================================================
describe('SubscriptionsController /subscriptions', () => {
  it('POST /subscriptions → 201 creates a subscription', async () => {
    const res = await request(server)
      .post('/subscriptions')
      .send({
        usuarioId: ids.userForSubscription,
        planoId: ids.planForSubscription,
        status: 'ATIVA',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.usuario).toBeDefined();
    expect(res.body.plano).toBeDefined();
    ids.subscription = res.body.id;
  });

  it('GET /subscriptions → 200 returns array', async () => {
    const res = await request(server).get('/subscriptions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /subscriptions?usuarioId=X → 200 filters by user', async () => {
    const res = await request(server).get(
      `/subscriptions?usuarioId=${ids.userForSubscription}`,
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    for (const s of res.body) {
      expect(s.usuario.id).toBe(ids.userForSubscription);
    }
  });

  it('GET /subscriptions/:id → 200 returns the subscription', async () => {
    const res = await request(server).get(`/subscriptions/${ids.subscription}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(ids.subscription);
    expect(res.body).toHaveProperty('usuario');
    expect(res.body).toHaveProperty('plano');
  });

  it('PATCH /subscriptions/:id → 200 updates the subscription', async () => {
    const res = await request(server)
      .patch(`/subscriptions/${ids.subscription}`)
      .send({ status: 'ATIVA' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ATIVA');
  });

  it('POST /subscriptions → 400 missing required fields', async () => {
    const res = await request(server).post('/subscriptions').send({});
    expect(res.status).toBe(400);
  });

  it('POST /subscriptions → 404 user not found', async () => {
    const res = await request(server)
      .post('/subscriptions')
      .send({
        usuarioId: 999999,
        planoId: ids.planForSubscription,
      });
    expect(res.status).toBe(404);
  });

  it('POST /subscriptions → 409 duplicate active subscription', async () => {
    const res = await request(server)
      .post('/subscriptions')
      .send({
        usuarioId: ids.userForSubscription,
        planoId: ids.planForSubscription,
      });
    expect(res.status).toBe(409);
  });

  it('GET /subscriptions/999999 → 404 not found', async () => {
    const res = await request(server).get('/subscriptions/999999');
    expect(res.status).toBe(404);
  });

  // DELETE (logical cancellation)
  it('DELETE /subscriptions/:id → 200 cancels the subscription', async () => {
    const res = await request(server).delete(`/subscriptions/${ids.subscription}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('CANCELADA');
  });
});

// ============================================================================
// 8. OrdersController /orders
// ============================================================================
describe('OrdersController /orders', () => {
  it('POST /orders → 201 creates an order with items', async () => {
    const res = await request(server)
      .post('/orders')
      .send({
        usuarioId: ids.userForOrder,
        itens: [
          { produtoId: ids.product, quantidade: 2 },
          { produtoId: ids.product2, quantidade: 1 },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.itens).toHaveLength(2);
    expect(res.body.usuario).toBeDefined();
    expect(Number(res.body.total)).toBeGreaterThan(0);
    ids.order = res.body.id;
  });

  it('GET /orders → 200 returns array', async () => {
    const res = await request(server).get('/orders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /orders?usuarioId=X → 200 filters by user', async () => {
    const res = await request(server).get(
      `/orders?usuarioId=${ids.userForOrder}`,
    );
    expect(res.status).toBe(200);
    for (const o of res.body) {
      expect(o.usuario.id).toBe(ids.userForOrder);
    }
  });

  it('GET /orders/:id → 200 returns the order with items', async () => {
    const res = await request(server).get(`/orders/${ids.order}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(ids.order);
    expect(res.body.itens).toBeDefined();
    expect(res.body.usuario).toBeDefined();
  });

  it('PATCH /orders/:id → 200 updates order status', async () => {
    const res = await request(server)
      .patch(`/orders/${ids.order}`)
      .send({ status: 'CONFIRMADO' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('CONFIRMADO');
  });

  it('POST /orders → 400 missing items', async () => {
    const res = await request(server)
      .post('/orders')
      .send({ usuarioId: ids.userForOrder, itens: [] });
    expect(res.status).toBe(400);
  });

  it('POST /orders → 400 missing usuarioId', async () => {
    const res = await request(server)
      .post('/orders')
      .send({ itens: [{ produtoId: ids.product, quantidade: 1 }] });
    expect(res.status).toBe(400);
  });

  it('POST /orders → 404 user not found', async () => {
    const res = await request(server)
      .post('/orders')
      .send({
        usuarioId: 999999,
        itens: [{ produtoId: ids.product, quantidade: 1 }],
      });
    expect(res.status).toBe(404);
  });

  it('POST /orders → 404 product not found', async () => {
    const res = await request(server)
      .post('/orders')
      .send({
        usuarioId: ids.userForOrder,
        itens: [{ produtoId: 999999, quantidade: 1 }],
      });
    expect(res.status).toBe(404);
  });

  it('POST /orders → 400 duplicate products in items', async () => {
    const res = await request(server)
      .post('/orders')
      .send({
        usuarioId: ids.userForOrder,
        itens: [
          { produtoId: ids.product, quantidade: 1 },
          { produtoId: ids.product, quantidade: 2 },
        ],
      });
    expect(res.status).toBe(400);
  });

  it('GET /orders/999999 → 404 not found', async () => {
    const res = await request(server).get('/orders/999999');
    expect(res.status).toBe(404);
  });

  // DELETE
  it('DELETE /orders/:id → 200 removes the order and restores stock', async () => {
    const res = await request(server).delete(`/orders/${ids.order}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('removido');
    ids.order = 0; // already deleted, skip afterAll cleanup
  });
});

// ============================================================================
// 9. UsersController DELETE (last, after dependents are gone)
// ============================================================================
describe('UsersController DELETE /users/:id', () => {
  it('DELETE /users/:id → 200 removes the user', async () => {
    const res = await request(server).delete(`/users/${ids.user}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('removido');

    // Confirm it's gone
    const check = await request(server).get(`/users/${ids.user}`);
    expect(check.status).toBe(404);
    ids.user = 0; // skip afterAll cleanup
  });

  it('DELETE /users/999999 → 404 not found', async () => {
    const res = await request(server).delete('/users/999999');
    expect(res.status).toBe(404);
  });
});

// ============================================================================
// 10. Products DELETE (clean up after orders are gone)
// ============================================================================
describe('ProductsController DELETE /products/:id', () => {
  it('DELETE /products/:id → 200 removes the product', async () => {
    const res = await request(server).delete(`/products/${ids.product}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('removido');
    ids.product = 0;
  });

  it('DELETE /products/999999 → 404 not found', async () => {
    const res = await request(server).delete('/products/999999');
    expect(res.status).toBe(404);
  });
});

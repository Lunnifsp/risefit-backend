/**
 * E2E Test Setup — shared NestJS app bootstrap & cleanup utilities.
 *
 * Every spec imports `getApp()` to obtain a lazily-created `INestApplication`.
 * `afterAll` hooks in each spec must call their own cleanup; the global
 * `afterAll` here tears down the app & Prisma connection once all suites finish.
 */
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

let app: INestApplication;
let prisma: PrismaService;

/**
 * Bootstraps the NestJS app once and returns it for every spec.
 */
export async function getApp(): Promise<INestApplication> {
  if (app) return app;

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();

  // Match the production pipe for class-validator based controllers (Products, Orders)
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  await app.init();
  prisma = app.get(PrismaService);
  return app;
}

export function getPrisma(): PrismaService {
  return prisma;
}

export async function closeApp(): Promise<void> {
  if (app) {
    await app.close();
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { PlansController } from './plans.controller.js';
import { PlansService } from './plans.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('PlansController', () => {
  let controller: PlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlansController],
      providers: [PlansService, { provide: PrismaService, useValue: {} }],
    }).compile();

    controller = module.get<PlansController>(PlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalsController } from './professionals.controller.js';
import { ProfessionalsService } from './professionals.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ProfessionalsController', () => {
  let controller: ProfessionalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionalsController],
      providers: [
        ProfessionalsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<ProfessionalsController>(ProfessionalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
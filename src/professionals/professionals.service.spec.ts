import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalsService } from './professionals.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ProfessionalsService', () => {
  let service: ProfessionalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessionalsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<ProfessionalsService>(ProfessionalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
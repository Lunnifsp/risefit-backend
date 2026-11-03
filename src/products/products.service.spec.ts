import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  const mockProduct = {
    id: 1,
    nome: 'Whey Protein Isolado',
    descricao: 'Suplemento de proteína pura',
    preco: new Prisma.Decimal(149.9),
    estoque: 20,
    urlImagem: 'https://example.com/whey.png',
    ativo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  };

  const mockPrismaService = {
    product: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um produto com sucesso', async () => {
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const dto = {
        nome: 'Whey Protein Isolado',
        descricao: 'Suplemento de proteína pura',
        preco: 149.9,
        estoque: 20,
        urlImagem: 'https://example.com/whey.png',
      };

      const result = await service.create(dto);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          nome: dto.nome,
          descricao: dto.descricao,
          preco: new Prisma.Decimal(dto.preco),
          estoque: dto.estoque,
          urlImagem: dto.urlImagem,
        },
      });
      expect(result).toEqual(mockProduct);
    });

    it('deve lançar ConflictException em erro P2002', async () => {
      const knownError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        { code: 'P2002', clientVersion: '7.10.0' },
      );
      mockPrismaService.product.create.mockRejectedValue(knownError);

      await expect(
        service.create({
          nome: 'Whey',
          preco: 100,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de produtos', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);

      const result = await service.findAll();

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('findOne', () => {
    it('deve lançar BadRequestException se ID for inválido', async () => {
      await expect(service.findOne(-1)).rejects.toThrow(BadRequestException);
      await expect(service.findOne(0)).rejects.toThrow(BadRequestException);
    });

    it('deve lançar NotFoundException se produto não existir', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('deve retornar o produto quando encontrado', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('deve atualizar um produto com sucesso', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      const updatedProduct = { ...mockProduct, preco: new Prisma.Decimal(129.9) };
      mockPrismaService.product.update.mockResolvedValue(updatedProduct);

      const result = await service.update(1, { preco: 129.9 });

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          preco: new Prisma.Decimal(129.9),
        },
      });
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('remove', () => {
    it('deve remover o produto com sucesso', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      const result = await service.remove(1);

      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual({ message: 'Produto removido com sucesso' });
    });

    it('deve lançar ConflictException se produto estiver em pedidos (P2003)', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      const foreignKeyError = new Prisma.PrismaClientKnownRequestError(
        'Foreign key constraint failed',
        { code: 'P2003', clientVersion: '7.10.0' },
      );
      mockPrismaService.product.delete.mockRejectedValue(foreignKeyError);

      await expect(service.remove(1)).rejects.toThrow(ConflictException);
    });
  });
});


import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { OrderStatus } from '../generated/prisma/enums.js';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;

  const mockUser = {
    id: 1,
    nome: 'Carlos Silva',
    email: 'carlos@example.com',
  };

  const mockProduct = {
    id: 10,
    nome: 'Whey Protein',
    preco: new Prisma.Decimal(120),
    estoque: 15,
    ativo: true,
  };

  const mockOrder = {
    id: 1,
    usuarioId: 1,
    total: new Prisma.Decimal(240),
    status: OrderStatus.PENDENTE,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    usuario: mockUser,
    itens: [
      {
        id: 100,
        pedidoId: 1,
        produtoId: 10,
        quantidade: 2,
        precoUnitario: new Prisma.Decimal(120),
        subtotal: new Prisma.Decimal(240),
        produto: {
          id: 10,
          nome: 'Whey Protein',
          urlImagem: null,
        },
      },
    ],
  };

  const mockTx = {
    product: {
      update: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    order: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    orderProduct: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
  };

  const mockPrismaService = {
    user: {
      findUnique: vi.fn(),
    },
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    order: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    orderProduct: {
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
    vi.clearAllMocks();

    mockPrismaService.$transaction.mockImplementation(async (cb: (tx: any) => any) => {
      return cb(mockTx);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um pedido com sucesso debitando estoque', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockTx.order.create.mockResolvedValue(mockOrder);

      const dto = {
        usuarioId: 1,
        itens: [{ produtoId: 10, quantidade: 2 }],
      };

      const result = await service.create(dto);

      expect(mockTx.product.update).toHaveBeenCalledWith({
        where: { id: 10 },
        data: { estoque: { decrement: 2 } },
      });
      expect(mockTx.order.create).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          usuarioId: 99,
          itens: [{ produtoId: 10, quantidade: 1 }],
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar BadRequestException se houver produtos duplicados no pedido', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.create({
          usuarioId: 1,
          itens: [
            { produtoId: 10, quantidade: 1 },
            { produtoId: 10, quantidade: 2 },
          ],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException se estoque for insuficiente', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.product.findMany.mockResolvedValue([
        { ...mockProduct, estoque: 1 },
      ]);

      await expect(
        service.create({
          usuarioId: 1,
          itens: [{ produtoId: 10, quantidade: 5 }],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException se produto estiver inativo', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.product.findMany.mockResolvedValue([
        { ...mockProduct, ativo: false },
      ]);

      await expect(
        service.create({
          usuarioId: 1,
          itens: [{ produtoId: 10, quantidade: 1 }],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de pedidos', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([mockOrder]);

      const result = await service.findAll();
      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: {},
        include: expect.any(Object),
        orderBy: { id: 'desc' },
      });
      expect(result).toEqual([mockOrder]);
    });

    it('deve filtrar por usuarioId e status válidos', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([mockOrder]);

      const result = await service.findAll(1, OrderStatus.PENDENTE);
      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: { usuarioId: 1, status: OrderStatus.PENDENTE },
        include: expect.any(Object),
        orderBy: { id: 'desc' },
      });
      expect(result).toEqual([mockOrder]);
    });

    it('deve lançar BadRequestException se status for inválido', async () => {
      expect(() => service.findAll(undefined, 'STATUS_INEXISTENTE' as any)).toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException se usuarioId for inválido', async () => {
      expect(() => service.findAll(-5, OrderStatus.PENDENTE)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('deve lançar BadRequestException se ID for inválido', async () => {
      await expect(service.findOne(-1)).rejects.toThrow(BadRequestException);
    });

    it('deve lançar NotFoundException se o pedido não for encontrado', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('deve retornar o pedido quando encontrado', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('update', () => {
    it('deve devolver produtos ao estoque se pedido for cancelado', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      const cancelledOrder = { ...mockOrder, status: OrderStatus.CANCELADO };
      mockTx.order.update.mockResolvedValue(cancelledOrder);

      const result = await service.update(1, { status: OrderStatus.CANCELADO });

      expect(mockTx.product.update).toHaveBeenCalledWith({
        where: { id: 10 },
        data: { estoque: { increment: 2 } },
      });
      expect(result.status).toBe(OrderStatus.CANCELADO);
    });
  });

  describe('remove', () => {
    it('deve remover itens e pedido com sucesso devolvendo estoque', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.remove(1);

      expect(mockTx.product.update).toHaveBeenCalledWith({
        where: { id: 10 },
        data: { estoque: { increment: 2 } },
      });
      expect(mockTx.orderProduct.deleteMany).toHaveBeenCalledWith({
        where: { pedidoId: 1 },
      });
      expect(mockTx.order.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual({ message: 'Pedido removido com sucesso' });
    });
  });
});


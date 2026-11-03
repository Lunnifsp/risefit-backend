import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { OrderStatus } from '../generated/prisma/enums.js';
import { Prisma } from '../generated/prisma/client.js';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrder = {
    id: 1,
    usuarioId: 1,
    total: new Prisma.Decimal(150),
    status: OrderStatus.PENDENTE,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    usuario: { id: 1, nome: 'João', email: 'joao@example.com' },
    itens: [],
  };

  const mockOrdersService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar create com o DTO correto', async () => {
    mockOrdersService.create.mockResolvedValue(mockOrder);

    const dto = {
      usuarioId: 1,
      itens: [{ produtoId: 10, quantidade: 2 }],
    };

    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockOrder);
  });

  it('deve chamar findAll com filtros opcionais', async () => {
    mockOrdersService.findAll.mockResolvedValue([mockOrder]);

    const result = await controller.findAll({ usuarioId: 1, status: OrderStatus.PENDENTE });
    expect(service.findAll).toHaveBeenCalledWith(1, OrderStatus.PENDENTE);
    expect(result).toEqual([mockOrder]);
  });

  it('deve chamar findOne com o ID correto', async () => {
    mockOrdersService.findOne.mockResolvedValue(mockOrder);

    const result = await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockOrder);
  });

  it('deve chamar update com ID e DTO', async () => {
    const updateDto = { status: OrderStatus.CONFIRMADO };
    const updated = { ...mockOrder, status: OrderStatus.CONFIRMADO };
    mockOrdersService.update.mockResolvedValue(updated);

    const result = await controller.update(1, updateDto);
    expect(service.update).toHaveBeenCalledWith(1, updateDto);
    expect(result.status).toEqual(OrderStatus.CONFIRMADO);
  });

  it('deve chamar remove com o ID correto', async () => {
    const response = { message: 'Pedido removido com sucesso' };
    mockOrdersService.remove.mockResolvedValue(response);

    const result = await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });
});


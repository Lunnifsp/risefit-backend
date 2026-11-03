import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { Prisma } from '../generated/prisma/client.js';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct = {
    id: 1,
    nome: 'Creatina Creapure',
    descricao: 'Monoidratada 300g',
    preco: new Prisma.Decimal(99.9),
    estoque: 15,
    urlImagem: 'https://example.com/creatina.png',
    ativo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  };

  const mockProductsService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar create com o DTO correto', async () => {
    mockProductsService.create.mockResolvedValue(mockProduct);

    const dto = {
      nome: 'Creatina Creapure',
      descricao: 'Monoidratada 300g',
      preco: 99.9,
      estoque: 15,
      urlImagem: 'https://example.com/creatina.png',
    };

    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockProduct);
  });

  it('deve chamar findAll', async () => {
    mockProductsService.findAll.mockResolvedValue([mockProduct]);

    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockProduct]);
  });

  it('deve chamar findOne com o ID correto', async () => {
    mockProductsService.findOne.mockResolvedValue(mockProduct);

    const result = await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockProduct);
  });

  it('deve chamar update com ID e DTO', async () => {
    const updateDto = { preco: 89.9 };
    mockProductsService.update.mockResolvedValue({
      ...mockProduct,
      preco: new Prisma.Decimal(89.9),
    });

    const result = await controller.update(1, updateDto);
    expect(service.update).toHaveBeenCalledWith(1, updateDto);
    expect(result.preco).toEqual(new Prisma.Decimal(89.9));
  });

  it('deve chamar remove com o ID correto', async () => {
    const response = { message: 'Produto removido com sucesso' };
    mockProductsService.remove.mockResolvedValue(response);

    const result = await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });
});


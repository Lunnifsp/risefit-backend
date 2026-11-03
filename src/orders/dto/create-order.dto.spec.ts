import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateOrderDto } from './create-order.dto.js';
import { OrderStatus } from '../../generated/prisma/enums.js';

describe('CreateOrderDto Validation', () => {
  it('deve validar com sucesso um DTO válido', async () => {
    const plain = {
      usuarioId: 1,
      status: OrderStatus.PENDENTE,
      itens: [
        {
          produtoId: 10,
          quantidade: 2,
          precoUnitario: 99.9,
        },
      ],
    };

    const dto = plainToInstance(CreateOrderDto, plain);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('deve falhar se usuarioId for inválido ou ausente', async () => {
    const plain = {
      usuarioId: -1,
      itens: [{ produtoId: 1, quantidade: 1 }],
    };

    const dto = plainToInstance(CreateOrderDto, plain);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const error = errors.find((e) => e.property === 'usuarioId');
    expect(error).toBeDefined();
    expect(error?.constraints?.isPositive).toBe('O ID do usuário deve ser maior que zero');
  });

  it('deve falhar se itens for uma lista vazia', async () => {
    const plain = {
      usuarioId: 1,
      itens: [],
    };

    const dto = plainToInstance(CreateOrderDto, plain);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const error = errors.find((e) => e.property === 'itens');
    expect(error).toBeDefined();
    expect(error?.constraints?.arrayMinSize).toBe('O pedido deve conter pelo menos um item');
  });

  it('deve falhar se um item do pedido tiver quantidade negativa', async () => {
    const plain = {
      usuarioId: 1,
      itens: [
        {
          produtoId: 5,
          quantidade: 0,
        },
      ],
    };

    const dto = plainToInstance(CreateOrderDto, plain);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const itensError = errors.find((e) => e.property === 'itens');
    expect(itensError).toBeDefined();
    expect(itensError?.children?.[0]?.children?.find((c) => c.property === 'quantidade')?.constraints?.isPositive).toBe(
      'A quantidade deve ser maior que zero',
    );
  });
});


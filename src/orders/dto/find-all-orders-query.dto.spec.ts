import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { FindAllOrdersQueryDto } from './find-all-orders-query.dto.js';
import { OrderStatus } from '../../generated/prisma/enums.js';

describe('FindAllOrdersQueryDto Validation', () => {
  it('deve validar com sucesso quando nenhum parâmetro é enviado', async () => {
    const plain = {};
    const dto = plainToInstance(FindAllOrdersQueryDto, plain);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('deve validar com sucesso com usuarioId e status válidos', async () => {
    const plain = {
      usuarioId: '2',
      status: OrderStatus.CONFIRMADO,
    };
    const dto = plainToInstance(FindAllOrdersQueryDto, plain);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.usuarioId).toBe(2);
    expect(dto.status).toBe(OrderStatus.CONFIRMADO);
  });

  it('deve falhar se status for inválido', async () => {
    const plain = {
      status: 'INVALID_STATUS',
    };
    const dto = plainToInstance(FindAllOrdersQueryDto, plain);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const statusError = errors.find((e) => e.property === 'status');
    expect(statusError).toBeDefined();
    expect(statusError?.constraints?.isEnum).toContain('Status do pedido inválido. Valores permitidos:');
  });

  it('deve falhar se usuarioId não for um número inteiro positivo', async () => {
    const plain = {
      usuarioId: '-3',
    };
    const dto = plainToInstance(FindAllOrdersQueryDto, plain);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const userError = errors.find((e) => e.property === 'usuarioId');
    expect(userError).toBeDefined();
    expect(userError?.constraints?.isPositive).toBe('O ID do usuário deve ser maior que zero');
  });
});


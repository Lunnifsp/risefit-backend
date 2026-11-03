import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../generated/prisma/enums.js';

export class FindAllOrdersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O ID do usuário deve ser um número inteiro' })
  @IsPositive({ message: 'O ID do usuário deve ser maior que zero' })
  usuarioId?: number;

  @IsOptional()
  @IsEnum(OrderStatus, {
    message: `Status do pedido inválido. Valores permitidos: ${Object.values(OrderStatus).join(', ')}`,
  })
  status?: OrderStatus;
}


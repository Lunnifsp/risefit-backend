import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../generated/prisma/enums.js';

export class CreateOrderItemDto {
  @IsNotEmpty({ message: 'O ID do produto é obrigatório' })
  @Type(() => Number)
  @IsInt({ message: 'O ID do produto deve ser um número inteiro' })
  @IsPositive({ message: 'O ID do produto deve ser maior que zero' })
  produtoId: number;

  @IsNotEmpty({ message: 'A quantidade é obrigatória' })
  @Type(() => Number)
  @IsInt({ message: 'A quantidade deve ser um número inteiro' })
  @IsPositive({ message: 'A quantidade deve ser maior que zero' })
  quantidade: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O preço unitário deve ser um número válido com até 2 casas decimais' },
  )
  @IsPositive({ message: 'O preço unitário deve ser maior que zero' })
  precoUnitario?: number;
}

export class CreateOrderDto {
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
  @Type(() => Number)
  @IsInt({ message: 'O ID do usuário deve ser um número inteiro' })
  @IsPositive({ message: 'O ID do usuário deve ser maior que zero' })
  usuarioId: number;

  @IsOptional()
  @IsEnum(OrderStatus, {
    message:
      'Status do pedido inválido. Valores permitidos: PENDENTE, CONFIRMADO, ENVIADO, ENTREGUE, CANCELADO',
  })
  status?: OrderStatus;

  @IsNotEmpty({ message: 'A lista de itens do pedido é obrigatória' })
  @IsArray({ message: 'Os itens do pedido devem ser uma lista' })
  @ArrayMinSize(1, { message: 'O pedido deve conter pelo menos um item' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  itens: CreateOrderItemDto[];
}


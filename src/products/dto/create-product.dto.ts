import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString({ message: 'O nome do produto deve ser um texto' })
  @IsNotEmpty({ message: 'O nome do produto é obrigatório' })
  @MaxLength(150, {
    message: 'O nome do produto deve ter no máximo 150 caracteres',
  })
  nome: string;

  @IsOptional()
  @IsString({ message: 'A descrição do produto deve ser um texto' })
  descricao?: string;

  @IsNotEmpty({ message: 'O preço do produto é obrigatório' })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O preço do produto deve ser um número válido com até 2 casas decimais' },
  )
  @IsPositive({ message: 'O preço do produto deve ser maior que zero' })
  preco: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O estoque deve ser um número inteiro' })
  @Min(0, { message: 'O estoque não pode ser negativo' })
  estoque?: number;

  @IsOptional()
  @IsString({ message: 'A URL da imagem deve ser um texto' })
  @MaxLength(255, {
    message: 'A URL da imagem deve ter no máximo 255 caracteres',
  })
  urlImagem?: string;

  @IsOptional()
  @IsBoolean({ message: 'O status ativo deve ser um valor booleano' })
  ativo?: boolean;
}


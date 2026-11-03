import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateProductDto } from './create-product.dto.js';

describe('CreateProductDto Validation', () => {
  it('deve validar com sucesso um DTO válido', async () => {
    const plain = {
      nome: 'Creatina Creapure 300g',
      descricao: 'Creatina pura 100% monoidratada',
      preco: 119.9,
      estoque: 50,
      urlImagem: 'https://example.com/creatina.png',
      ativo: true,
    };

    const dto = plainToInstance(CreateProductDto, plain);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('deve falhar se nome for vazio ou não for texto', async () => {
    const plain = {
      nome: '',
      preco: 50,
    };

    const dto = plainToInstance(CreateProductDto, plain);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const nomeError = errors.find((e) => e.property === 'nome');
    expect(nomeError).toBeDefined();
    expect(nomeError?.constraints?.isNotEmpty).toBe('O nome do produto é obrigatório');
  });

  it('deve falhar se preco for menor ou igual a zero', async () => {
    const plain = {
      nome: 'Barra de Cereal',
      preco: -10,
    };

    const dto = plainToInstance(CreateProductDto, plain);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const precoError = errors.find((e) => e.property === 'preco');
    expect(precoError).toBeDefined();
    expect(precoError?.constraints?.isPositive).toBe('O preço do produto deve ser maior que zero');
  });

  it('deve falhar se estoque for negativo', async () => {
    const plain = {
      nome: 'Barra de Cereal',
      preco: 10,
      estoque: -5,
    };

    const dto = plainToInstance(CreateProductDto, plain);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const estoqueError = errors.find((e) => e.property === 'estoque');
    expect(estoqueError).toBeDefined();
    expect(estoqueError?.constraints?.min).toBe('O estoque não pode ser negativo');
  });
});

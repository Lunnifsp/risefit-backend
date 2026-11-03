import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateProductDto } from './dto/create-product.dto.js';
import type { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private validateId(id: number): number {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new BadRequestException('ID inválido');
    }

    return id;
  }

  async create(dto: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data: {
          nome: dto.nome,
          descricao: dto.descricao,
          preco: new Prisma.Decimal(dto.preco),
          ...(dto.estoque !== undefined && { estoque: dto.estoque }),
          ...(dto.urlImagem !== undefined && { urlImagem: dto.urlImagem }),
          ...(dto.ativo !== undefined && { ativo: dto.ativo }),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Já existe um produto com estes dados');
        }
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.product.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const productId = this.validateId(id);

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const productId = this.validateId(id);

    await this.findOne(productId);

    const { preco, ...dados } = dto;

    const data: Prisma.ProductUpdateInput = {
      ...dados,
      ...(preco !== undefined && { preco: new Prisma.Decimal(preco) }),
    };

    try {
      return await this.prisma.product.update({
        where: { id: productId },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Já existe um produto com estes dados');
        }
      }

      throw error;
    }
  }

  async remove(id: number) {
    const productId = this.validateId(id);

    await this.findOne(productId);

    try {
      await this.prisma.product.delete({
        where: { id: productId },
      });

      return { message: 'Produto removido com sucesso' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ConflictException(
            'Não é possível remover o produto pois ele está associado a pedidos',
          );
        }
      }

      throw error;
    }
  }
}


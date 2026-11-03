import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { OrderStatus } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateOrderDto } from './dto/create-order.dto.js';
import type { UpdateOrderDto } from './dto/update-order.dto.js';

const orderInclude = {
  usuario: {
    select: {
      id: true,
      nome: true,
      email: true,
    },
  },
  itens: {
    include: {
      produto: {
        select: {
          id: true,
          nome: true,
          urlImagem: true,
        },
      },
    },
  },
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private validateId(id: number): number {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new BadRequestException('ID inválido');
    }

    return id;
  }

  async create(dto: CreateOrderDto) {
    const usuarioId = this.validateId(dto.usuarioId);

    const user = await this.prisma.user.findUnique({
      where: { id: usuarioId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!dto.itens || dto.itens.length === 0) {
      throw new BadRequestException('O pedido deve conter pelo menos um item');
    }

    const productIds = dto.itens.map((item) => item.produtoId);
    const uniqueProductIds = new Set(productIds);
    if (uniqueProductIds.size !== productIds.length) {
      throw new BadRequestException(
        'Não é permitido incluir produtos duplicados no mesmo pedido',
      );
    }

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((p) => p.id));
      const missingIds = productIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(
        `Produto(s) com ID(s) [${missingIds.join(', ')}] não encontrado(s)`,
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let total = new Prisma.Decimal(0);
    const itemsData: {
      produtoId: number;
      quantidade: number;
      precoUnitario: Prisma.Decimal;
      subtotal: Prisma.Decimal;
    }[] = [];

    for (const item of dto.itens) {
      const product = productMap.get(item.produtoId)!;

      if (!product.ativo) {
        throw new BadRequestException(`O produto "${product.nome}" está inativo`);
      }

      if (product.estoque < item.quantidade) {
        throw new BadRequestException(
          `Estoque insuficiente para o produto "${product.nome}". Disponível: ${product.estoque}, Solicitado: ${item.quantidade}`,
        );
      }

      const unitPrice =
        item.precoUnitario !== undefined
          ? new Prisma.Decimal(item.precoUnitario)
          : product.preco;

      const subtotal = unitPrice.mul(item.quantidade);
      total = total.add(subtotal);

      itemsData.push({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: unitPrice,
        subtotal,
      });
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        for (const item of dto.itens) {
          await tx.product.update({
            where: { id: item.produtoId },
            data: {
              estoque: {
                decrement: item.quantidade,
              },
            },
          });
        }

        return await tx.order.create({
          data: {
            usuarioId,
            total,
            status: dto.status ?? OrderStatus.PENDENTE,
            itens: {
              create: itemsData,
            },
          },
          include: orderInclude,
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Já existe um registro com estes dados');
        }
      }

      throw error;
    }
  }

  findAll(usuarioId?: number, status?: OrderStatus) {
    if (status !== undefined && !Object.values(OrderStatus).includes(status)) {
      throw new BadRequestException(
        `Status do pedido inválido. Valores permitidos: ${Object.values(OrderStatus).join(', ')}`,
      );
    }

    if (usuarioId !== undefined) {
      this.validateId(usuarioId);
    }

    return this.prisma.order.findMany({
      where: {
        ...(usuarioId !== undefined && { usuarioId }),
        ...(status !== undefined && { status }),
      },
      include: orderInclude,
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const orderId = this.validateId(id);

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: orderInclude,
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  async update(id: number, dto: UpdateOrderDto) {
    const orderId = this.validateId(id);
    const currentOrder = await this.findOne(orderId);

    if (dto.usuarioId !== undefined) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.usuarioId },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
    }

    return await this.prisma.$transaction(async (tx) => {
      // Caso haja atualização nos itens do pedido
      if (dto.itens !== undefined) {
        if (dto.itens.length === 0) {
          throw new BadRequestException('O pedido deve conter pelo menos um item');
        }

        const productIds = dto.itens.map((item) => item.produtoId);
        const uniqueProductIds = new Set(productIds);
        if (uniqueProductIds.size !== productIds.length) {
          throw new BadRequestException(
            'Não é permitido incluir produtos duplicados no mesmo pedido',
          );
        }

        // Se o pedido anterior não estava cancelado, devolve o estoque dos itens antigos
        if (currentOrder.status !== OrderStatus.CANCELADO) {
          for (const oldItem of currentOrder.itens) {
            await tx.product.update({
              where: { id: oldItem.produtoId },
              data: { estoque: { increment: oldItem.quantidade } },
            });
          }
        }

        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
        });

        if (products.length !== productIds.length) {
          const foundIds = new Set(products.map((p) => p.id));
          const missingIds = productIds.filter((pId) => !foundIds.has(pId));
          throw new NotFoundException(
            `Produto(s) com ID(s) [${missingIds.join(', ')}] não encontrado(s)`,
          );
        }

        const productMap = new Map(products.map((p) => [p.id, p]));
        let newTotal = new Prisma.Decimal(0);
        const newItemsData: {
          pedidoId: number;
          produtoId: number;
          quantidade: number;
          precoUnitario: Prisma.Decimal;
          subtotal: Prisma.Decimal;
        }[] = [];

        const targetStatus = dto.status ?? currentOrder.status;

        for (const item of dto.itens) {
          const product = productMap.get(item.produtoId)!;

          if (!product.ativo) {
            throw new BadRequestException(`O produto "${product.nome}" está inativo`);
          }

          if (targetStatus !== OrderStatus.CANCELADO && product.estoque < item.quantidade) {
            throw new BadRequestException(
              `Estoque insuficiente para o produto "${product.nome}". Disponível: ${product.estoque}, Solicitado: ${item.quantidade}`,
            );
          }

          const unitPrice =
            item.precoUnitario !== undefined
              ? new Prisma.Decimal(item.precoUnitario)
              : product.preco;

          const subtotal = unitPrice.mul(item.quantidade);
          newTotal = newTotal.add(subtotal);

          newItemsData.push({
            pedidoId: orderId,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: unitPrice,
            subtotal,
          });

          // Debita o estoque se o status não for CANCELADO
          if (targetStatus !== OrderStatus.CANCELADO) {
            await tx.product.update({
              where: { id: item.produtoId },
              data: { estoque: { decrement: item.quantidade } },
            });
          }
        }

        // Remove itens antigos e insere os novos
        await tx.orderProduct.deleteMany({
          where: { pedidoId: orderId },
        });

        await tx.orderProduct.createMany({
          data: newItemsData,
        });

        return await tx.order.update({
          where: { id: orderId },
          data: {
            ...(dto.usuarioId !== undefined && { usuarioId: dto.usuarioId }),
            ...(dto.status !== undefined && { status: dto.status }),
            total: newTotal,
          },
          include: orderInclude,
        });
      }

      // Se apenas o status ou usuário foi alterado (sem alterar os itens)
      if (dto.status !== undefined && dto.status !== currentOrder.status) {
        // Se mudou para CANCELADO, devolve os itens ao estoque
        if (dto.status === OrderStatus.CANCELADO) {
          for (const item of currentOrder.itens) {
            await tx.product.update({
              where: { id: item.produtoId },
              data: { estoque: { increment: item.quantidade } },
            });
          }
        }
        // Se saiu de CANCELADO para outro status, valida e debita novamente o estoque
        else if (currentOrder.status === OrderStatus.CANCELADO) {
          for (const item of currentOrder.itens) {
            const product = await tx.product.findUnique({
              where: { id: item.produtoId },
            });

            if (!product || product.estoque < item.quantidade) {
              throw new BadRequestException(
                `Estoque insuficiente para reativar o produto "${product?.nome ?? item.produtoId}"`,
              );
            }

            await tx.product.update({
              where: { id: item.produtoId },
              data: { estoque: { decrement: item.quantidade } },
            });
          }
        }
      }

      return await tx.order.update({
        where: { id: orderId },
        data: {
          ...(dto.usuarioId !== undefined && { usuarioId: dto.usuarioId }),
          ...(dto.status !== undefined && { status: dto.status }),
        },
        include: orderInclude,
      });
    });
  }

  async remove(id: number) {
    const orderId = this.validateId(id);
    const order = await this.findOne(orderId);

    return await this.prisma.$transaction(async (tx) => {
      // Se o pedido não estiver cancelado, devolve os produtos ao estoque
      if (order.status !== OrderStatus.CANCELADO) {
        for (const item of order.itens) {
          await tx.product.update({
            where: { id: item.produtoId },
            data: {
              estoque: {
                increment: item.quantidade,
              },
            },
          });
        }
      }

      // Remove os itens do pedido primeiro para respeitar integridade referencial
      await tx.orderProduct.deleteMany({
        where: { pedidoId: orderId },
      });

      // Remove o pedido
      await tx.order.delete({
        where: { id: orderId },
      });

      return { message: 'Pedido removido com sucesso' };
    });
  }
}


import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';

@Injectable()
export class InventoryRepository {
  constructor(private prisma: PrismaService) {}

  async findByProductId(productId: string) {
    return this.prisma.inventory.findUnique({
      where: { productId },
    });
  }

  async updateQuantity(productId: string, availableQuantity: number) {
    return this.prisma.inventory.update({
      where: { productId },
      data: { availableQuantity },
    });
  }

  async reserveStock(productId: string, quantity: number) {
    return this.prisma.inventory.update({
      where: { productId },
      data: {
        availableQuantity: {
          decrement: quantity,
        },
      },
    });
  }
}

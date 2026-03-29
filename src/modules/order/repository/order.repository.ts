import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: {
    userId: string;
    totalAmount: number;
    items: {
      productId: string;
      quantity: number;
      price: number;
    }[];
    idempotencyKey: string;
  }) {
    return this.prisma.order.create({
      data: {
        userId: data.userId,
        totalAmount: data.totalAmount,
        status: 'PENDING',
        items: {
          create: data.items,
        },
        idempotencyKey: data.idempotencyKey,
      },
      include: {
        items: true,
      },
    });
  }
}

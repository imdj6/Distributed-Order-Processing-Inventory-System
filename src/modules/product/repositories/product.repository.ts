import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; price: number }) {
    return this.prisma.product.create({ data });
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async findAll() {
    return this.prisma.product.findMany();
  }
}

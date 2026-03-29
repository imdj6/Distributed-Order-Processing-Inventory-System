import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private productRepo: ProductRepository) {}

  async createProduct(name: string, price: number) {
    return this.productRepo.create({ name, price });
  }

  async getProduct(id: string) {
    const product = await this.productRepo.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getAllProducts() {
    return await this.productRepo.findAll();
  }
}

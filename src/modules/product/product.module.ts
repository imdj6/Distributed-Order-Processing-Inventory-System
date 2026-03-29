import { Module } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}

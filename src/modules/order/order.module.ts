import { Module } from '@nestjs/common';
import { OrderRepository } from './repository/order.repository';
import { OrderService } from './service/order.service';
import { ProductModule } from '../product/product.module';
import { InventoryModule } from '../inventory/inventory.module';
import { OrderController } from './controller/order. controller';

@Module({
  controllers: [OrderController],
  imports: [ProductModule, InventoryModule],
  providers: [OrderRepository, OrderService],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}

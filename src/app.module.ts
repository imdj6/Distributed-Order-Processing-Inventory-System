import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CartModule } from './modules/cart/cart.module';
import { PrismaService } from './infra/database/prisma/prisma.service';
import { DatabaseModule } from './infra/database/database.module';
import { RedisModule } from './infra/redis/redis.module';
import { CommonModule } from './common/common.module';
import { QueueModule } from './infra/queue/queue.module';

@Module({
  imports: [
    ProductModule,
    OrderModule,
    InventoryModule,
    CartModule,
    DatabaseModule,
    RedisModule,
    CommonModule,
    QueueModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

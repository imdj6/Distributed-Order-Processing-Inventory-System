import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repository/order.repository';
import { InventoryService } from '../../inventory/service/inventory.service';
import { ProductRepository } from '../../product/repositories/product.repository';
import { QueueService } from '../../../infra/queue/queue.service';

@Injectable()
export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private productRepo: ProductRepository,
    private inventoryService: InventoryService,
    private queueService: QueueService,
  ) {}

  async createOrder(
    userId: string,
    productId: string,
    quantity: number,
    idempotencyKey: string,
  ) {
    // 1️⃣ Get product
    const product = await this.productRepo.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    // 3️⃣ Calculate total
    const totalAmount = product.price * quantity;

    // 4️⃣ Create order (PENDING)
    const order = await this.orderRepo.createOrder({
      userId,
      totalAmount,
      items: [
        {
          productId,
          quantity,
          price: product.price,
        },
      ],
      idempotencyKey,
    });

    await this.queueService.addOrderJob({
      orderId: order.id,
      productId,
      quantity,
    });

    return {
      message: 'Order placed successfully. Processing...',
      orderId: order.id,
    };
  }
}

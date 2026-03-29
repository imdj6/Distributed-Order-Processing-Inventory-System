import { Controller, Post, Body } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderService } from '../service/order.service';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(
      dto.userId,
      dto.productId,
      dto.quantity,
      dto.idempotencyKey,
    );
  }
}

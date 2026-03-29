import { Injectable } from '@nestjs/common';
import { orderQueue } from './bullmq.config';

@Injectable()
export class QueueService {
  async addOrderJob(data: {
    orderId: string;
    productId: string;
    quantity: number;
  }) {
    await orderQueue.add('create-order', data, {
      attempts: 3, // 🔥 retry
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}

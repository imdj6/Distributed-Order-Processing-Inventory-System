import { Queue } from 'bullmq';

export const dlqQueue = new Queue('order_dlq', {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});

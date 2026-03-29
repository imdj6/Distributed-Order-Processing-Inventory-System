import { Queue } from 'bullmq';

export const orderQueue = new Queue('order_queue', {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});

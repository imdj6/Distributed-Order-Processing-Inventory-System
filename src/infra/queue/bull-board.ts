import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { orderQueue } from './bullmq.config';
import { dlqQueue } from './dlq.queue';
import { Express } from 'express';
export function setupBullBoard(app: INestApplication) {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  createBullBoard({
    queues: [new BullMQAdapter(orderQueue), new BullMQAdapter(dlqQueue)],
    serverAdapter,
  });

  // 🔥 FIX: get underlying express app
  const expressApp = app.getHttpAdapter().getInstance() as Express;

  expressApp.use('/admin/queues', serverAdapter.getRouter());
}

import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { PrismaService } from '../infra/database/prisma/prisma.service';
import { RedisLockService } from '../common/locks/redis-lock.service';
import { dlqQueue } from '../infra/queue/dlq.queue';

const prisma = new PrismaService();
const redis = new Redis({ host: 'localhost', port: 6379 });

const lockService = new RedisLockService({
  getClient: () => redis,
} as any);

const worker = new Worker(
  'order_queue',
  async (
    job: Job<{ orderId: string; productId: string; quantity: number }>,
  ) => {
    const { orderId, productId, quantity } = job.data;

    const key = `lock:product:${productId}`;

    const { success, lockValue } = await lockService.acquireLock(key);

    if (!success) {
      throw new Error('Lock failed, retry'); // 🔥 retry
    }

    try {
      // 🔥 idempotency check (VERY IMPORTANT)
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (order?.status === 'CONFIRMED') {
        return; // already processed ✅
      }

      // 1️⃣ Get inventory
      const inventory = await prisma.inventory.findUnique({
        where: { productId },
      });

      if (!inventory || inventory.availableQuantity < quantity) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'FAILED' },
        });

        return;
      }

      // 2️⃣ Deduct stock
      await prisma.inventory.update({
        where: { productId },
        data: {
          availableQuantity: {
            decrement: quantity,
          },
        },
      });

      // 3️⃣ Confirm order
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });
    } catch (err) {
      console.error('Worker error:', err);

      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'FAILED' },
      });

      throw err; // 🔥 retry
    } finally {
      if (lockValue) {
        await lockService.releaseLock(key, lockValue);
      }
    }
  },
  {
    connection: {
      host: 'localhost',
      port: 6379,
    },
  },
);

// 🔥 DLQ HANDLING (VERY IMPORTANT)
worker.on('failed', (job, err) => {
  // 🔥 wrap async logic
  (async () => {
    console.error('Job permanently failed:', job?.id, err?.message);

    if (!job) return;

    if (job.attemptsMade >= job.opts.attempts!) {
      await dlqQueue.add('failed-order', {
        originalJobId: job.id,
        data: job.data,
        error: err.message,
        failedAt: new Date().toISOString(),
      });
    }
  })().catch((error) => {
    console.error('DLQ push failed:', error);
  });
});

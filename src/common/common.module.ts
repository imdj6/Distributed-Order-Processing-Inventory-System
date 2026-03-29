import { Global, Module } from '@nestjs/common';
import { RedisLockService } from './locks/redis-lock.service';
import { QueueService } from '../infra/queue/queue.service';

@Global()
@Module({
  imports: [],
  providers: [RedisLockService, QueueService],
  exports: [RedisLockService],
})
export class CommonModule {}

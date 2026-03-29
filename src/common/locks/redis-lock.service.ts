import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RedisService } from '../../infra/redis/service/redis.service';
import Redis from 'ioredis';

@Injectable()
export class RedisLockService {
  private redis: Redis;

  constructor(private redisService: RedisService) {
    this.redis = this.redisService.getClient(); // 🔥 THIS IS KEY
  }

  async acquireLock(key: string, ttl = 5000) {
    const lockValue = randomUUID();

    const result = await this.redis.set(key, lockValue, 'PX', ttl, 'NX');

    if (result === 'OK') {
      return { success: true, lockValue };
    }

    return { success: false };
  }

  async releaseLock(key: string, lockValue: string) {
    const script = `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
      else
        return 0
      end
    `;

    await this.redis.eval(script, 1, key, lockValue);
  }
}

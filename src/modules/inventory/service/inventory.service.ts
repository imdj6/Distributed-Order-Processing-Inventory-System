import { Injectable, BadRequestException } from '@nestjs/common';
import { InventoryRepository } from '../repository/inventory.repository';
import { RedisLockService } from '../../../common/locks/redis-lock.service';

@Injectable()
export class InventoryService {
  constructor(
    private inventoryRepo: InventoryRepository,
    private redisLock: RedisLockService,
  ) {}

  async checkAvailability(productId: string, quantity: number) {
    const inventory = await this.inventoryRepo.findByProductId(productId);

    if (!inventory) {
      throw new BadRequestException('Inventory not found');
    }

    if (inventory.availableQuantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    return true;
  }

  async reserveInventory(productId: string, quantity: number) {
    const key = `lock:product:${productId}`;

    const { success, lockValue } = await this.redisLock.acquireLock(key);

    if (!success) {
      throw new Error('Too many concurrent requests');
    }

    try {
      const inventory = await this.inventoryRepo.findByProductId(productId);

      if (!inventory) {
        throw new Error('Inventory not found');
      }

      if (inventory.availableQuantity < quantity) {
        throw new Error('Insufficient stock');
      }

      // 🔥 Reserve instead of deduct
      await this.inventoryRepo.reserveStock(productId, quantity);

      return true;
    } finally {
      if (lockValue) await this.redisLock.releaseLock(key, lockValue);
    }
  }
}

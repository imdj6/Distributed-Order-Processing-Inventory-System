import { Module } from '@nestjs/common';
import { InventoryService } from './service/inventory.service';
import { InventoryRepository } from './repository/inventory.repository';

@Module({
  providers: [InventoryService, InventoryRepository],
  exports: [InventoryService],
})
export class InventoryModule {}

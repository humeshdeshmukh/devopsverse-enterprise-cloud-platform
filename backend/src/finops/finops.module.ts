import { Module } from '@nestjs/common';
import { FinOpsController } from './finops.controller';
import { FinOpsService } from './finops.service';

@Module({
  controllers: [FinOpsController],
  providers: [FinOpsService],
  exports: [FinOpsService],
})
export class FinOpsModule {}

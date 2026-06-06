import { Module } from '@nestjs/common';
import { TelemetryModule } from './telemetry/telemetry.module';
import { PlatformModule } from './platform/platform.module';
import { SecurityModule } from './security/security.module';
import { FinOpsModule } from './finops/finops.module';
import { AiModule } from './ai/ai.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    TelemetryModule,
    PlatformModule,
    SecurityModule,
    FinOpsModule,
    AiModule,
    MessagingModule,
  ],
})
export class AppModule {}

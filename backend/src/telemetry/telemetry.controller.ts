import { Controller, Get, Query } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get('metrics')
  getMetrics() {
    return this.telemetryService.getMetrics();
  }

  @Get('logs')
  getLogs(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    return this.telemetryService.getLogs(parsedLimit);
  }

  @Get('traces')
  getTraces() {
    return this.telemetryService.getTraces();
  }
}

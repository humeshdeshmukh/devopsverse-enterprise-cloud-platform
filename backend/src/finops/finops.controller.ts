import { Controller, Get } from '@nestjs/common';
import { FinOpsService } from './finops.service';

@Controller('finops')
export class FinOpsController {
  constructor(private readonly finopsService: FinOpsService) {}

  @Get('costs')
  getCosts() {
    return this.finopsService.getCloudCosts();
  }

  @Get('namespaces')
  getNamespaces() {
    return this.finopsService.getNamespaceCosts();
  }

  @Get('breakdown')
  getBreakdown() {
    return this.finopsService.getResourceBreakdowns();
  }

  @Get('recommendations')
  getRecommendations() {
    return this.finopsService.getRecommendations();
  }
}

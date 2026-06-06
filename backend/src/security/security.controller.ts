import { Controller, Get } from '@nestjs/common';
import { SecurityService } from './security.service';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('vulnerabilities')
  getVulnerabilities() {
    return this.securityService.getVulnerabilityReport();
  }

  @Get('opa-policies')
  getOpaPolicies() {
    return this.securityService.getOpaPolicies();
  }

  @Get('falco-alerts')
  getFalcoAlerts() {
    return this.securityService.getFalcoAlerts();
  }
}

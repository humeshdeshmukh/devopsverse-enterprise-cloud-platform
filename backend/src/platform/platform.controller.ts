import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PlatformService } from './platform.service';

@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get('catalog')
  getCatalog() {
    return this.platformService.getCatalog();
  }

  @Get('argo-apps')
  getArgoApps() {
    return this.platformService.getArgoApps();
  }

  @Post('argo-apps/:name/sync')
  syncArgoApp(@Param('name') name: string) {
    return this.platformService.syncArgoApp(name);
  }

  @Post('scaffold')
  scaffoldTemplate(@Body() body: any) {
    const { templateType, params } = body;
    return this.platformService.scaffoldTemplate(templateType, params);
  }
}

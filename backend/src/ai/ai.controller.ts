import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('query')
  async query(@Body('query') query: string) {
    const response = await this.aiService.analyzeQuery(query || '');
    return { response };
  }
}

import { Controller, Get } from '@nestjs/common';
import { MessagingService } from './messaging.service';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('events')
  getEvents() {
    return this.messagingService.getEvents();
  }
}

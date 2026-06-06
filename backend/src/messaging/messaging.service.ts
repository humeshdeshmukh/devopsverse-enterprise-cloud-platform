import { Injectable, Logger } from '@nestjs/common';

export interface MessageEvent {
  id: string;
  timestamp: string;
  broker: 'Kafka' | 'RabbitMQ';
  topicOrQueue: string;
  payload: string;
  status: 'Published' | 'Consumed' | 'Failed';
  partitionOrAck?: string;
}

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);
  private events: MessageEvent[] = [];

  constructor() {
    // Populate initial event log
    this.generateMockEvents(10);
    
    // Start background simulation
    setInterval(() => {
      this.generateMockEvents(1);
    }, 5000); // Generate a new event every 5 seconds
  }

  getEvents(): MessageEvent[] {
    return this.events;
  }

  private generateMockEvents(count: number) {
    const brokers: ('Kafka' | 'RabbitMQ')[] = ['Kafka', 'RabbitMQ'];
    const kafkaTopics = ['order-events', 'payment-processed', 'user-signup', 'inventory-update'];
    const rabbitQueues = ['email-notifications', 'billing-tasks', 'sms-alerts', 'pdf-generator'];
    const payloads = {
      'order-events': '{"orderId":"ord-58819","amount":158.40,"customerId":"cust-0021","items":3}',
      'payment-processed': '{"transactionId":"tx-98218821","orderId":"ord-58819","status":"SUCCESS"}',
      'user-signup': '{"userId":"cust-0025","email":"test@example.com","ip":"192.168.1.52"}',
      'inventory-update': '{"sku":"item-2993","quantity":-1,"warehouseId":"wh-east"}',
      'email-notifications': '{"recipient":"test@example.com","subject":"Welcome to DevOpsVerse","template":"welcome_email"}',
      'billing-tasks': '{"invoiceId":"inv-0021","customerId":"cust-0021","amount":158.40}',
      'sms-alerts': '{"phone":"+15550192","message":"Your order ord-58819 has been dispatched"}',
      'pdf-generator': '{"documentType":"INVOICE","targetId":"inv-0021","bucket":"devopsverse-billing-receipts"}',
    };

    for (let i = 0; i < count; i++) {
      const broker = brokers[Math.floor(Math.random() * brokers.length)];
      const topicOrQueue = broker === 'Kafka' 
        ? kafkaTopics[Math.floor(Math.random() * kafkaTopics.length)]
        : rabbitQueues[Math.floor(Math.random() * rabbitQueues.length)];
      
      const payload = payloads[topicOrQueue] || '{}';
      const status = Math.random() > 0.95 ? 'Failed' : (Math.random() > 0.4 ? 'Consumed' : 'Published');
      const time = new Date(Date.now() - i * 5000).toISOString();
      const partitionOrAck = broker === 'Kafka'
        ? `Partition: ${Math.floor(Math.random() * 3)}, Offset: ${Math.floor(Math.random() * 2000) + 12000}`
        : `AckMode: AUTO, DeliveryTag: ${Math.floor(Math.random() * 80) + 1}`;

      const newEvent: MessageEvent = {
        id: `msg-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: time,
        broker,
        topicOrQueue,
        payload,
        status,
        partitionOrAck,
      };

      this.events.unshift(newEvent);
    }

    if (this.events.length > 50) {
      this.events = this.events.slice(0, 50);
    }
  }
}

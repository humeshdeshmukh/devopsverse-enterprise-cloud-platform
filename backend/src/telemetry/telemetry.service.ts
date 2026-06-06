import { Injectable } from '@nestjs/common';

@Injectable()
export class TelemetryService {
  private services = ['auth-api', 'payment-api', 'order-api', 'shipping-api'];

  getMetrics() {
    const timestamp = Date.now();
    return this.services.map(service => {
      let status = 'healthy';
      let latency = Math.floor(Math.random() * 80) + 20; // 20ms - 100ms
      let errorRate = Math.random() * 1.5; // 0 - 1.5%
      let cpu = Math.floor(Math.random() * 30) + 15; // 15% - 45%
      let memory = Math.floor(Math.random() * 100) + 120; // 120MB - 220MB

      // Inject simulated problems for specific APIs to make the dashboard dynamic
      if (service === 'payment-api' && Math.random() > 0.7) {
        status = 'degraded';
        latency = Math.floor(Math.random() * 800) + 400; // 400ms - 1200ms
        errorRate = Math.random() * 8 + 4; // 4% - 12%
        cpu = Math.floor(Math.random() * 40) + 50; // 50% - 90%
      }

      if (service === 'auth-api' && Math.random() > 0.85) {
        status = 'critical';
        latency = Math.floor(Math.random() * 2000) + 1000;
        errorRate = Math.random() * 30 + 20;
        cpu = Math.floor(Math.random() * 10) + 90; // High CPU
      }

      return {
        service,
        status,
        timestamp,
        latency, // ms
        errorRate, // %
        cpu, // %
        memory, // MB
        throughput: Math.floor(Math.random() * 200) + 50, // req/sec
      };
    });
  }

  getLogs(limit = 50) {
    const logTypes = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const components = ['gateway', 'auth-service', 'payment-service', 'database', 'redis-cache'];
    const messages = {
      INFO: [
        'User authentication successful',
        'Database connection established',
        'Cache hit for user profile data',
        'Payment transaction initiated successfully',
        'Order placed and dispatched to Kafka topic',
        'ArgoCD application sync completed',
      ],
      WARN: [
        'Slow query detected in order-db (took 240ms)',
        'Redis cache eviction limit approaching',
        'Kafka partition rebalancing in progress',
        'API Gateway rate-limiting applied for IP 192.168.1.14',
      ],
      ERROR: [
        'Failed to process transaction in payment-gateway (timeout)',
        'Connection refused to postgres-db:5432',
        'Redis connection lost, attempting reconnection',
        'Falco runtime rule violated: reverse shell activity detected',
        'OPA Gatekeeper: Pod denied due to privileged execution request',
      ],
      DEBUG: [
        'Garbage collection completed in 14ms',
        'Kong gateway routing request to /api/v1/auth',
        'Istio sidecar proxy injecting HTTP header x-request-id',
      ],
    };

    const logs = [];
    for (let i = 0; i < limit; i++) {
      const type = logTypes[Math.floor(Math.random() * logTypes.length)];
      const comp = components[Math.floor(Math.random() * components.length)];
      const list = messages[type];
      const msg = list[Math.floor(Math.random() * list.length)];
      const time = new Date(Date.now() - i * 3000).toISOString();

      logs.push({
        timestamp: time,
        level: type,
        component: comp,
        message: `[${comp}] ${msg}`,
      });
    }

    return logs;
  }

  getTraces() {
    return [
      {
        traceId: 'tr-98f8e8a718b2c451',
        name: 'POST /api/v1/payments/checkout',
        duration: 342,
        timestamp: new Date().toISOString(),
        spans: [
          {
            spanId: 'sp-kong-gateway-01',
            parentSpanId: null,
            name: 'kong-gateway-proxy',
            service: 'kong-api-gateway',
            duration: 342,
            status: 'OK',
          },
          {
            spanId: 'sp-istio-proxy-01',
            parentSpanId: 'sp-kong-gateway-01',
            name: 'istio-sidecar-ingress',
            service: 'istio-mesh-sidecar',
            duration: 338,
            status: 'OK',
          },
          {
            spanId: 'sp-auth-check-02',
            parentSpanId: 'sp-istio-proxy-01',
            name: 'auth-validate-token',
            service: 'auth-api',
            duration: 45,
            status: 'OK',
          },
          {
            spanId: 'sp-redis-get-01',
            parentSpanId: 'sp-auth-check-02',
            name: 'redis-get-session',
            service: 'redis-cache',
            duration: 4,
            status: 'OK',
          },
          {
            spanId: 'sp-payment-service-01',
            parentSpanId: 'sp-istio-proxy-01',
            name: 'payment-process-charge',
            service: 'payment-api',
            duration: 282,
            status: 'ERROR',
            errorDetails: 'Transaction checkout timeout on provider gateway',
          },
          {
            spanId: 'sp-postgres-query-01',
            parentSpanId: 'sp-payment-service-01',
            name: 'postgres-insert-ledger',
            service: 'postgres-db',
            duration: 15,
            status: 'OK',
          },
          {
            spanId: 'sp-kafka-emit-01',
            parentSpanId: 'sp-payment-service-01',
            name: 'kafka-publish-payment-failed',
            service: 'kafka-broker',
            duration: 8,
            status: 'OK',
          },
        ],
      },
      {
        traceId: 'tr-23a1e2f890c411d3',
        name: 'GET /api/v1/orders/catalog',
        duration: 54,
        timestamp: new Date(Date.now() - 5000).toISOString(),
        spans: [
          {
            spanId: 'sp-kong-gateway-02',
            parentSpanId: null,
            name: 'kong-gateway-proxy',
            service: 'kong-api-gateway',
            duration: 54,
            status: 'OK',
          },
          {
            spanId: 'sp-order-service-01',
            parentSpanId: 'sp-kong-gateway-02',
            name: 'order-fetch-catalog',
            service: 'order-api',
            duration: 50,
            status: 'OK',
          },
          {
            spanId: 'sp-redis-get-02',
            parentSpanId: 'sp-order-service-01',
            name: 'redis-get-catalog-cache',
            service: 'redis-cache',
            duration: 2,
            status: 'OK',
          },
        ],
      },
    ];
  }
}

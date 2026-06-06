import { Injectable } from '@nestjs/common';

export interface VulnerabilityReport {
  imageName: string;
  tag: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  scannedAt: string;
}

export interface OpaPolicy {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'ignored';
  severity: 'high' | 'medium' | 'low';
}

export interface FalcoAlert {
  timestamp: string;
  priority: 'Emergency' | 'Critical' | 'Warning' | 'Notice' | 'Info';
  rule: string;
  message: string;
  containerId: string;
}

@Injectable()
export class SecurityService {
  private vulnerabilities: VulnerabilityReport[] = [
    {
      imageName: 'devopsverse/auth-api',
      tag: 'release-v1.4.2',
      critical: 0,
      high: 2,
      medium: 8,
      low: 14,
      scannedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      imageName: 'devopsverse/payment-api',
      tag: 'release-v2.1.0',
      critical: 1,
      high: 5,
      medium: 12,
      low: 22,
      scannedAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      imageName: 'devopsverse/order-api',
      tag: 'latest',
      critical: 0,
      high: 0,
      medium: 3,
      low: 7,
      scannedAt: new Date(Date.now() - 100000).toISOString(),
    },
    {
      imageName: 'postgres:15-alpine',
      tag: '15-alpine',
      critical: 0,
      high: 1,
      medium: 4,
      low: 11,
      scannedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  private opaPolicies: OpaPolicy[] = [
    {
      id: 'opa-disallow-privileged',
      name: 'Disallow Privileged Containers',
      description: 'Prevents pods from running in privileged mode to avoid container breakout.',
      status: 'passed',
      severity: 'high',
    },
    {
      id: 'opa-enforce-read-only-root',
      name: 'Enforce Read-Only Root Filesystem',
      description: 'Forces pods to write temporary data only in mounted memory volumes.',
      status: 'failed',
      severity: 'medium',
    },
    {
      id: 'opa-require-resource-limits',
      name: 'Require Resource Limits',
      description: 'Guarantees that all deployments declare strict CPU and memory boundaries.',
      status: 'passed',
      severity: 'high',
    },
    {
      id: 'opa-drop-capabilities',
      name: 'Drop All Default Capabilities',
      description: 'Disables Linux root-level syscall privileges (NET_ADMIN, SYS_ADMIN, etc.).',
      status: 'passed',
      severity: 'medium',
    },
    {
      id: 'opa-block-latest-tag',
      name: 'Disallow Latest Image Tag',
      description: 'Restricts Kubernetes pods from referencing mutable latest tags in production.',
      status: 'failed',
      severity: 'high',
    },
  ];

  private falcoAlerts: FalcoAlert[] = [
    {
      timestamp: new Date().toISOString(),
      priority: 'Critical',
      rule: 'Spawned process inside container',
      message: 'A shell was spawned inside payment-api-prod (ID: c3df18a29b). Executed: /bin/sh -i',
      containerId: 'c3df18a29b',
    },
    {
      timestamp: new Date(Date.now() - 600000).toISOString(),
      priority: 'Warning',
      rule: 'Write below monitor directory',
      message: 'File change detected under /usr/bin inside auth-api-prod (ID: a098b1b22e). File: /usr/bin/netcat',
      containerId: 'a098b1b22e',
    },
    {
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      priority: 'Notice',
      rule: 'Inbound connection to non-allowed port',
      message: 'Pod user-db-prod received traffic on port 22 (SSH) from host 10.244.1.18',
      containerId: 'u988f918ee',
    },
  ];

  getVulnerabilityReport(): VulnerabilityReport[] {
    return this.vulnerabilities;
  }

  getOpaPolicies(): OpaPolicy[] {
    return this.opaPolicies;
  }

  getFalcoAlerts(): FalcoAlert[] {
    // Dynamically insert an alert sometimes to simulate a live system
    if (Math.random() > 0.85) {
      const containerNames = ['order-api-prod', 'shipping-api-dev', 'kong-gateway-prod'];
      const rules = ['Sensitive file read', 'Package management execution', 'Outbound connection to tor network'];
      const messages = [
        'Read of /etc/shadow or /etc/passwd detected in container.',
        'Package manager (apt-get/apk) executed in runtime container.',
        'Container initiated connection to Tor entry node: 185.220.101.4'
      ];
      const selectedIdx = Math.floor(Math.random() * rules.length);
      const newAlert: FalcoAlert = {
        timestamp: new Date().toISOString(),
        priority: Math.random() > 0.5 ? 'Critical' : 'Warning',
        rule: rules[selectedIdx],
        message: `${messages[selectedIdx]} inside ${containerNames[Math.floor(Math.random() * containerNames.length)]} (ID: ${Math.random().toString(36).substring(2, 12)})`,
        containerId: Math.random().toString(36).substring(2, 12),
      };
      this.falcoAlerts.unshift(newAlert);
      if (this.falcoAlerts.length > 20) {
        this.falcoAlerts.pop();
      }
    }
    return this.falcoAlerts;
  }
}

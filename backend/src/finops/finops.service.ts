import { Injectable } from '@nestjs/common';

export interface CloudCost {
  provider: 'AWS' | 'Azure' | 'GCP';
  monthlySpend: number;
  activeResources: number;
  trend: 'up' | 'down' | 'stable';
}

export interface NamespaceCost {
  namespace: string;
  spend: number;
  percentage: number;
}

export interface ResourceBreakdown {
  category: 'Compute' | 'Storage' | 'Network' | 'Management';
  spend: number;
}

export interface FinopsRecommendation {
  id: string;
  resourceName: string;
  provider: 'AWS' | 'Azure' | 'GCP';
  category: 'Idle Resource' | 'Right-sizing' | 'Spot Instances' | 'Reserved Instances';
  description: string;
  currentCost: number;
  proposedCost: number;
  potentialSavings: number;
  difficulty: 'low' | 'medium' | 'high';
}

@Injectable()
export class FinOpsService {
  private cloudCosts: CloudCost[] = [
    { provider: 'AWS', monthlySpend: 14250.80, activeResources: 230, trend: 'up' },
    { provider: 'Azure', monthlySpend: 7820.40, activeResources: 110, trend: 'stable' },
    { provider: 'GCP', monthlySpend: 5410.20, activeResources: 80, trend: 'down' },
  ];

  private namespaceCosts: NamespaceCost[] = [
    { namespace: 'production-apps', spend: 15480.50, percentage: 56 },
    { namespace: 'staging-environment', spend: 6910.10, percentage: 25 },
    { namespace: 'development-tenant', spend: 4140.20, percentage: 15 },
    { namespace: 'monitoring-observability', spend: 1104.60, percentage: 4 },
  ];

  private resourceBreakdowns: ResourceBreakdown[] = [
    { category: 'Compute', spend: 14850.20 },
    { category: 'Storage', spend: 6350.40 },
    { category: 'Network', spend: 4180.80 },
    { category: 'Management', spend: 2100.00 },
  ];

  private recommendations: FinopsRecommendation[] = [
    {
      id: 'rec-01',
      resourceName: 'payment-api-prod (Replica Count)',
      provider: 'AWS',
      category: 'Right-sizing',
      description: 'Right-size replica count from 10 to 4 based on actual CPU utilization (peak load never exceeds 28% capacity).',
      currentCost: 480.00,
      proposedCost: 192.00,
      potentialSavings: 288.00,
      difficulty: 'low',
    },
    {
      id: 'rec-02',
      resourceName: 'dev-database-ebs-volume',
      provider: 'AWS',
      category: 'Idle Resource',
      description: 'An unattached gp3 EBS volume has been idle for 28 days. Safely snapshot and delete.',
      currentCost: 84.00,
      proposedCost: 0.00,
      potentialSavings: 84.00,
      difficulty: 'low',
    },
    {
      id: 'rec-03',
      resourceName: 'staging-node-pool',
      provider: 'Azure',
      category: 'Spot Instances',
      description: 'Convert staging node pool virtual machine scale sets to use Azure Spot VMs (saves up to 60%).',
      currentCost: 1200.00,
      proposedCost: 480.00,
      potentialSavings: 720.00,
      difficulty: 'medium',
    },
    {
      id: 'rec-04',
      resourceName: 'gke-core-cluster-vms',
      provider: 'GCP',
      category: 'Reserved Instances',
      description: 'Purchase Committed Use Discounts (CUDs) for 3-year term matching baseline GKE instance sizes.',
      currentCost: 3100.00,
      proposedCost: 2015.00,
      potentialSavings: 1085.00,
      difficulty: 'high',
    },
  ];

  getCloudCosts() {
    return this.cloudCosts;
  }

  getNamespaceCosts() {
    return this.namespaceCosts;
  }

  getResourceBreakdowns() {
    return this.resourceBreakdowns;
  }

  getRecommendations() {
    return this.recommendations;
  }
}

import { Injectable, Logger } from '@nestjs/common';

export interface CatalogComponent {
  id: string;
  name: string;
  type: string;
  owner: string;
  lifecycle: string;
  description: string;
  language: string;
  repoUrl: string;
}

export interface ArgoApp {
  name: string;
  project: string;
  status: 'Synced' | 'OutOfSync';
  health: 'Healthy' | 'Degraded' | 'Missing' | 'Suspended';
  destinationCluster: string;
  namespace: string;
  repoUrl: string;
  targetRevision: string;
}

@Injectable()
export class PlatformService {
  private readonly logger = new Logger(PlatformService.name);

  private catalog: CatalogComponent[] = [
    {
      id: 'auth-api',
      name: 'Authentication API',
      type: 'service',
      owner: 'security-team',
      lifecycle: 'production',
      description: 'Handles JWT authorization, OAuth2 providers, and session tokens.',
      language: 'TypeScript / NestJS',
      repoUrl: 'https://github.com/devopsverse/auth-api',
    },
    {
      id: 'payment-api',
      name: 'Payment Processing Service',
      type: 'service',
      owner: 'billing-team',
      lifecycle: 'production',
      description: 'Coordinates checkout transactions and integrates with Stripe gateway.',
      language: 'Python / FastAPI',
      repoUrl: 'https://github.com/devopsverse/payment-api',
    },
    {
      id: 'order-api',
      name: 'Order Orchestrator',
      type: 'service',
      owner: 'logistics-team',
      lifecycle: 'production',
      description: 'Aggregates cart state and triggers billing and shipping workflows.',
      language: 'Go / Gin',
      repoUrl: 'https://github.com/devopsverse/order-api',
    },
    {
      id: 'shipping-api',
      name: 'Shipping Logistics API',
      type: 'service',
      owner: 'logistics-team',
      lifecycle: 'experimental',
      description: 'Manages labels, dispatch queues, and coordinates carrier APIs.',
      language: 'TypeScript / Express',
      repoUrl: 'https://github.com/devopsverse/shipping-api',
    },
    {
      id: 'user-db',
      name: 'User Database (Postgres)',
      type: 'database',
      owner: 'dba-team',
      lifecycle: 'production',
      description: 'Relational database housing user authentication hash and metadata.',
      language: 'PostgreSQL 15',
      repoUrl: 'https://github.com/devopsverse/iac-databases',
    },
  ];

  private argoApps: ArgoApp[] = [
    {
      name: 'kong-api-gateway',
      project: 'default',
      status: 'Synced',
      health: 'Healthy',
      destinationCluster: 'aws-eks-prod-01',
      namespace: 'kong-ingress',
      repoUrl: 'https://github.com/devopsverse/gitops-infra',
      targetRevision: 'main',
    },
    {
      name: 'istio-service-mesh',
      project: 'default',
      status: 'Synced',
      health: 'Healthy',
      destinationCluster: 'aws-eks-prod-01',
      namespace: 'istio-system',
      repoUrl: 'https://github.com/devopsverse/gitops-infra',
      targetRevision: 'main',
    },
    {
      name: 'payment-api-prod',
      project: 'default',
      status: 'OutOfSync',
      health: 'Healthy',
      destinationCluster: 'aws-eks-prod-01',
      namespace: 'default',
      repoUrl: 'https://github.com/devopsverse/payment-api',
      targetRevision: 'release-v2.1.0',
    },
    {
      name: 'observability-loki-tempo',
      project: 'default',
      status: 'Synced',
      health: 'Healthy',
      destinationCluster: 'azure-aks-dr-02',
      namespace: 'observability',
      repoUrl: 'https://github.com/devopsverse/gitops-infra',
      targetRevision: 'main',
    },
    {
      name: 'auth-api-prod',
      project: 'default',
      status: 'Synced',
      health: 'Degraded',
      destinationCluster: 'gcp-gke-core-03',
      namespace: 'default',
      repoUrl: 'https://github.com/devopsverse/auth-api',
      targetRevision: 'release-v1.4.2',
    },
  ];

  getCatalog(): CatalogComponent[] {
    return this.catalog;
  }

  getArgoApps(): ArgoApp[] {
    return this.argoApps;
  }

  syncArgoApp(name: string): ArgoApp {
    const app = this.argoApps.find(a => a.name === name);
    if (app) {
      app.status = 'Synced';
      app.health = 'Healthy';
      this.logger.log(`ArgoCD synced app: ${name}`);
    }
    return app;
  }

  scaffoldTemplate(templateType: string, params: any) {
    const { name, owner, description, language, cpuLimit, memoryLimit, replicaCount, dbType, cloudProvider } = params;

    let generatedFiles = [];
    let logSteps = [];

    logSteps.push(`[Portal] Initiating Golden Path scaffolding for [${templateType}]: ${name}...`);
    logSteps.push(`[Portal] Checking permission scopes for owner group: ${owner}... OK.`);

    if (templateType === 'microservice') {
      logSteps.push('[Git] Creating repository branch: feature/scaffold-' + name);
      logSteps.push('[Helm] Writing Chart.yaml and values.yaml templates...');
      logSteps.push('[Kubernetes] Designing deployment.yaml and service.yaml manifests...');
      logSteps.push('[CI/CD] Generating .github/workflows/pipeline.yml scan gates...');
      logSteps.push('[Git] Committing changes & triggering GitOps Pull Webhook to ArgoCD...');
      logSteps.push('[ArgoCD] Created new Application definition: ' + name + '-app');

      const helmValues = `
# Helm Values generated automatically for ${name}
replicaCount: ${replicaCount || 2}

image:
  repository: devopsverse/${name}
  tag: latest
  pullPolicy: IfNotPresent

resources:
  limits:
    cpu: ${cpuLimit || '500m'}
    memory: ${memoryLimit || '512Mi'}
  requests:
    cpu: 100m
    memory: 128Mi

service:
  type: ClusterIP
  port: 80

istio:
  enabled: true
  virtualService:
    gateways:
      - mesh
    hosts:
      - ${name}.devopsverse.local
`;

      const argoAppManifest = `
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ${name}-service-prod
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/devopsverse/gitops-apps.git'
    targetRevision: HEAD
    path: charts/${name}
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: prod-apps
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
`;

      generatedFiles.push({ filename: 'helm/values.yaml', content: helmValues });
      generatedFiles.push({ filename: 'argocd/application.yaml', content: argoAppManifest });

      // Add to catalog
      this.catalog.push({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        type: 'service',
        owner: owner || 'developer-team',
        lifecycle: 'experimental',
        description: description || 'Scaffolded service.',
        language: language || 'TypeScript',
        repoUrl: `https://github.com/devopsverse/${name}`,
      });

      // Add to ArgoCD App list
      this.argoApps.push({
        name: `${name}-service-prod`,
        project: 'default',
        status: 'OutOfSync',
        health: 'Missing',
        destinationCluster: 'aws-eks-prod-01',
        namespace: 'prod-apps',
        repoUrl: 'https://github.com/devopsverse/gitops-apps.git',
        targetRevision: 'HEAD',
      });

    } else if (templateType === 'database') {
      logSteps.push('[Terraform] Scaffolding new state workspace for database instance...');
      logSteps.push('[Terraform] Generating main.tf variables and IAM network scopes...');
      logSteps.push('[Kubernetes] Designing ConfigMap profiles and secret descriptors...');
      logSteps.push('[Git] Committing database IaC to repository: iac-databases...');

      const terraformDB = `
# Terraform configuration for database provisioning
module "${name}_db" {
  source = "../../modules/${dbType || 'postgres'}"

  instance_name    = "${name}-db"
  environment      = "production"
  cloud_provider   = "${cloudProvider || 'aws'}"
  storage_gb       = 50
  
  # Network
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  subnet_ids             = module.vpc.private_subnets
  
  # Engine parameters
  engine_version         = "${dbType === 'redis' ? '7.0' : '15.4'}"
  backup_retention_days  = 7
}
`;
      generatedFiles.push({ filename: 'terraform/db-instance.tf', content: terraformDB });

      this.catalog.push({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        type: 'database',
        owner: owner || 'dba-team',
        lifecycle: 'experimental',
        description: description || `Provisioned ${dbType} database instance.`,
        language: dbType || 'PostgreSQL',
        repoUrl: 'https://github.com/devopsverse/iac-databases',
      });
    }

    logSteps.push(`[Portal] Scaffold process completed successfully. Platform objects synchronizing.`);

    return {
      status: 'success',
      logs: logSteps,
      files: generatedFiles,
    };
  }
}

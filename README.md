# 🌌 DevOpsVerse Enterprise Cloud Platform

[![Platform State](https://img.shields.io/badge/DevOpsVerse-ONLINE-emerald?style=for-the-badge&logo=kubernetes&logoColor=white)](http://localhost:3000)

**Application & Portal Frameworks**
[![Next.js](https://img.shields.io/badge/Next.js-v14-blue?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-v10-red?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com)
[![Backstage](https://img.shields.io/badge/Backstage-Catalog-9BF0E1?style=for-the-badge&logo=backstage&logoColor=black)](https://backstage.io)

**Multi-Cloud & Orchestration**
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestration-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io)
[![Kong](https://img.shields.io/badge/Kong-API%20Gateway-1A1A1A?style=for-the-badge&logo=kong&logoColor=white)](https://konghq.com)
[![Istio](https://img.shields.io/badge/Istio-mTLS--Strict-indigo?style=for-the-badge&logo=istio&logoColor=white)](https://istio.io)
[![ArgoCD](https://img.shields.io/badge/ArgoCD-GitOps-orange?style=for-the-badge&logo=argo&logoColor=white)](https://argoproj.github.io/cd/)
[![Terraform](https://img.shields.io/badge/Terraform-IaC-844FBA?style=for-the-badge&logo=terraform&logoColor=white)](https://www.terraform.io)
[![Ansible](https://img.shields.io/badge/Ansible-Config-EE0000?style=for-the-badge&logo=ansible&logoColor=white)](https://www.ansible.com)

**Data Stores & Messaging**
[![Kafka](https://img.shields.io/badge/Apache%20Kafka-Streaming-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)](https://kafka.apache.org)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Broker-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)

**DevSecOps & Threat Shield**
[![Trivy](https://img.shields.io/badge/Trivy-Vulnerability%20Scan-1C71B7?style=for-the-badge&logo=aquasecurity&logoColor=white)](https://aquasecurity.github.io/trivy/)
[![Falco](https://img.shields.io/badge/Falco-Runtime%20Threat-00A6C0?style=for-the-badge&logo=falco&logoColor=white)](https://falco.org)
[![OPA Gatekeeper](https://img.shields.io/badge/OPA-Gatekeeper-3E85C6?style=for-the-badge&logo=openpolicyagent&logoColor=white)](https://openpolicyagent.org)

**Observability & AIOps**
[![Prometheus](https://img.shields.io/badge/Prometheus-Metrics-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)](https://prometheus.io)
[![Loki](https://img.shields.io/badge/Loki-Log%20Aggregator-F46800?style=for-the-badge&logo=grafana&logoColor=white)](https://grafana.com/oss/loki/)
[![Tempo](https://img.shields.io/badge/Tempo-Traces-F46800?style=for-the-badge&logo=grafana&logoColor=white)](https://grafana.com/oss/tempo/)
[![Gemini](https://img.shields.io/badge/Gemini-AI%20SRE-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT%20Audit-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)


Welcome to **DevOpsVerse**, the flagship cloud control plane and operations portal designed to demonstrate production-grade multi-cloud engineering, automation, SRE, and DevSecOps patterns.

This project integrates a **Next.js frontend** and a **NestJS backend control plane** with multi-cloud infrastructure models, service mesh configurations, real-time security scanning, automated FinOps dashboards, and an interactive **AI-SRE troubleshooting copilot**.

---

## 📸 Platform Console Tour

Here is a visual walk-through of the DevOpsVerse Enterprise Control Plane:

### 1. Control Plane Overview
![Control Plane Overview](assets/Screenshot%20From%202026-06-06%2013-22-59.png)
* **Description**: Aggregates CPU usage allocations, multi-cloud spend trends, ArgoCD synchronization flags, and active Falco security threats along with an interactive cluster topology map.

### 2. Service Mesh & Ingress Gateway
![Service Mesh & Gateway Control](assets/Screenshot%20From%202026-06-06%2013-23-05.png)
* **Description**: Includes real-time Canary release weight controls (for traffic splitting), active Envoy proxy stats, and live-generated Kubernetes `VirtualService` configuration YAMLs.

### 3. Developer Portal (Backstage Catalog & Scaffolding)
![Developer Portal & GitOps](assets/Screenshot%20From%202026-06-06%2013-23-09.png)
* **Description**: A unified Backstage-style catalog tracking microservices and databases, with a scaffolding wizard generating pre-configured Helm charts and multicloud Terraform IaC models.

### 4. Security Command Center
![Security Command Center](assets/Screenshot%20From%202026-06-06%2013-23-15.png)
* **Description**: Integrates static Trivy vulnerability tables, OPA Gatekeeper compliance rules, and real-time Falco runtime threat sensor alerts.

### 5. Multi-Cloud Observability & Tracing
![Multi-Cloud Observability](assets/Screenshot%20From%202026-06-06%2013-23-23.png)
* **Description**: Visualizes Prometheus microservice golden signals (latency, traffic, saturation, error rate), Grafana Loki logging aggregators, and Tempo distributed tracing spans.

### 6. FinOps Cost Management Console
![FinOps Cost Management](assets/Screenshot%20From%202026-06-06%2013-23-28.png)
* **Description**: Tracks resource spending shares across AWS, Azure, and GCP clusters, namespace compute shares, and outputs automated Kubecost efficiency optimizations.

### 7. AI-SRE Copilot Interface
![AI-SRE Copilot Interface](assets/Screenshot%20From%202026-06-06%2013-23-49.png)
* **Description**: Interactive troubleshooting chat interface leveraging Google Gemini to analyze telemetry logs and recommend exact code parameters or command interventions.

---

## 🏗️ System Architecture Topology

The control plane orchestrates multi-cloud deployments down to the container network and node configurations:

```text
Frontend (Next.js Dashboard)
     ↓
API Gateway (Kong Ingress)
     ↓
Service Mesh (Istio Envoy Sidecars)
     ↓
Microservices (NestJS Control Plane + Target APIs)
     ↓
Messaging Broker (Kafka + RabbitMQ)
     ↓
Databases (PostgreSQL + Redis Caching)
     ↓
Kubernetes (EKS / AKS / GKE Clusters)
     ↓
Infrastructure (AWS + Azure + GCP provisioned via Terraform)
```

---

## 🛠️ Combined Technologies & Skills

| Core Domain | Tech Stack | DevOps / SRE Concept |
|---|---|---|
| **Full Stack** | React, Next.js, TypeScript, Vanilla CSS | Glassmorphism dashboard, dynamic route splitting, status polling |
| **Backend** | NestJS (TypeScript), PostgreSQL, Redis | REST APIs, database state persistence, Redis caching |
| **Messaging** | Kafka, RabbitMQ | Event-driven architecture, partition offset logging, queue acknowledgements |
| **Containers & Orchestration** | Docker, Kubernetes | Multi-stage Docker builds, ingress controllers, resource limit quotas |
| **Platform Engineering** | Backstage, ArgoCD | Software catalog models, GitOps synchronization reconciliation loops |
| **Security (DevSecOps)** | Trivy, Falco, OPA | Container vulnerabilities tables, runtime security sensors, Gatekeeper constraints |
| **Observability** | Prometheus, Loki, Tempo | Golden signals (latency, traffic, saturation), log filters, distributed trace spans |
| **Infrastructure** | Terraform, Ansible | Multi-cloud VPC/EKS/AKS/GKE IaC, host configuration and hardening |
| **AI Integration** | Google Gemini, OpenAI | Telemetry-aware AI agent assisting SRE troubleshooting |

---

## 📂 Repository Layout

```text
10-devopsverse-enterprise-cloud-platform/
├── Dockerfile.frontend        # Multi-stage Next.js builder
├── Dockerfile.backend         # Multi-stage NestJS builder
├── docker-compose.yml         # Local stack (Postgres, Redis, NextJS, NestJS)
├── README.md                  # This presentation guide
├── start.sh                   # Autoprovisoning wrapper script
├── stop.sh                    # Teardown wrapper script
│
├── frontend/                  # Next.js Application Source
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app/
│       │   ├── page.tsx       # Cloud topology and system state overview
│       │   ├── mesh/          # Istio Canary and traffic weight slider
│       │   ├── platform/      # Backstage Catalog and Golden Paths templates
│       │   ├── security/      # Trivy vulnerabilities & OPA compliance checks
│       │   ├── monitoring/    # Real-time metrics charts and Loki logs console
│       │   ├── finops/        # Kubecost AWS/Azure/GCP spend analysis
│       │   └── ai-sre/        # OpenAI / Gemini powered Copilot chat
│       └── styles/
│           └── globals.css    # Responsive HSL CSS rules & glassmorphism theme
│
├── backend/                   # NestJS Application Source
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts            # Entrypoint
│       ├── app.module.ts      # NestJS module registry
│       ├── telemetry/         # Prometheus, Loki, and Tempo generator
│       ├── platform/          # Backstage catalog and ArgoCD sync triggers
│       ├── security/          # Trivy scanners, Falco sensors, and OPA evaluators
│       ├── finops/            # Kubecost bill aggregates
│       ├── ai/                # OpenAI & Gemini HTTP client with Mock fallback
│       └── messaging/         # Event handlers simulating Kafka broker queues
│
├── terraform/                 # Multi-cloud IaC Modules
│   ├── providers.tf           # AWS/Azure/GCP providers
│   ├── main.tf                # Coordinates all clouds
│   ├── aws/                   # VPC and EKS with Spot instances
│   ├── azure/                 # VNet and AKS
│   └── gcp/                   # VPC and GKE Autopilot
│
├── ansible/                   # Node Config Playbooks
│   ├── inventory.ini          # Multi-cloud inventory configuration
│   └── playbook.yml           # Host updates, Falco daemon setup, Istio deploy
│
└── kubernetes/                # Cluster manifests
    ├── kong-ingress.yaml      # Kong ingress API paths & rate-limits
    ├── istio-mesh.yaml        # Istio Gateways, VirtualServices, & strict mTLS
    ├── opa-gatekeeper.yaml    # Gatekeeper constraints (Privileged pods block)
    └── monitoring-stack.yaml  # ServiceMonitor rules, Loki & Tempo config maps
```

---

## ⚡ Local Quickstart

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed and running.
- (Optional) [Google Gemini API Key](https://aistudio.google.com/apikey) or [OpenAI API Key](https://platform.openai.com/api-keys) to power the SRE AI panel.

### Step 1: Clone and Configure
Clone this project and edit `.env` in the root folder with your keys:
```env
GEMINI_API_KEY=your-gemini-key
AI_PROVIDER=gemini # Uses gemini or openai, fallbacks to mock if empty
```

### Step 2: Spin Up the Stack
Run the bootstrap script to compile code and start services:
```bash
chmod +x start.sh stop.sh
./start.sh
```

### Step 3: Access the Portal
Open your browser to load the dashboard:
- **Control Plane Console**: [http://localhost:3000](http://localhost:3000)
- **NestJS API Endpoints**: [http://localhost:3001/api](http://localhost:3001/api)

---

## 🔬 SRE Interactive Scenarios

Our control plane replicates real-world SRE issues. Navigate to the **AI-SRE Copilot** tab and try:

1. **Memory Out-Of-Memory (OOM) Diagnostic**:
   - Ask: *"Why is payment-api crashing?"*
   - AI reads CPU/Memory curves, detects OOM Exit Code 137, scans heap dumps in Loki, and recommends editing limits in `values.yaml`.

2. **Database Cache Lock Latency**:
   - Ask: *"How do I fix latency on checkout requests?"*
   - AI traces transaction graphs, isolates PostgreSQL locking queries, identifies a 0% cache hit rate in Redis, and provides recovery query commands.

3. **Intrusion Detection Response**:
   - Ask: *"A Falco alert was fired, how do I secure the cluster?"*
   - AI decodes the rule `Spawned process inside container` (unauthorized user shell), locates the host container, and generates OPA security policy contexts to quarantine the pod.

4. **FinOps Cost Optimization**:
   - Ask: *"Show me how to optimize our AWS spend."*
   - AI scans regional auto-scaling settings, marks staging workloads running on high-cost instances, and writes Terraform code to implement Spot Node Pools.

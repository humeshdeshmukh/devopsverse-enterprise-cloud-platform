import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  async analyzeQuery(query: string): Promise<string> {
    const provider = process.env.AI_PROVIDER || 'mock';
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    this.logger.log(`Received SRE request. Provider setting: ${provider}`);

    // Determine runtime path
    if (provider === 'openai' && openaiKey) {
      try {
        return await this.callOpenAI(query, openaiKey);
      } catch (err) {
        this.logger.warn(`OpenAI failed: ${err.message}. Falling back to Mock.`);
      }
    } else if ((provider === 'gemini' || !openaiKey) && geminiKey) {
      try {
        return await this.callGemini(query, geminiKey);
      } catch (err) {
        this.logger.warn(`Gemini failed: ${err.message}. Falling back to Mock.`);
      }
    }

    // Default Fallback
    return this.getMockSreResponse(query);
  }

  private async callOpenAI(query: string, apiKey: string): Promise<string> {
    const systemPrompt = this.getSystemPrompt();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response from OpenAI.';
  }

  private async callGemini(query: string, apiKey: string): Promise<string> {
    const systemPrompt = this.getSystemPrompt();
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    
    // Combine prompts for Gemini generateContent endpoint
    const combinedPrompt = `${systemPrompt}\n\nUser Question: ${query}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: combinedPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
  }

  private getSystemPrompt(): string {
    return `You are Antigravity-SRE, a Senior Staff Platform Engineer and AIOps automated troubleshooter for the DevOpsVerse Enterprise Cloud Platform.
Your role is to diagnose complex multi-cloud, Kubernetes, service mesh, security, or database incidents.

Be concise, technical, and format your response in GitHub-style Markdown:
1. **Diagnosis**: Explain what happened.
2. **Root Cause Analysis (RCA)**: Explain why it occurred.
3. **Remediation Action**: Provide the EXACT shell command, kubectl command, or Terraform block to fix it.

Context:
- The platform runs Istio Service Mesh, Kong Ingress, Kafka messaging, PostgreSQL, and Redis cache.
- Telemetry consists of Prometheus metrics, Loki logs, and Tempo distributed traces.
- Security uses OPA policies, Trivy scans, and Falco runtime logs.
- Cloud providers are AWS, Azure, and GCP, provisioned with Terraform.`;
  }
  private getMockSreResponse(query: string): string {
    const lower = query.toLowerCase();

    if (lower.includes('degradation') || lower.includes('cascading') || lower.includes('global platform') || lower.includes('rebalancing')) {
      return `### 🚨 Incident Diagnosis: Global Platform Degradation (Cascading Failure)

**Diagnosis**: The platform is experiencing a cascading control plane and data plane degradation across AWS, Azure, and GCP clusters:
- **Istio/Envoy**: 503 UC (Upstream Connection) errors due to connection pool exhaustion.
- **Kafka**: Consumer group rebalancing storms due to PostgreSQL/Redis metadata lookup timeouts.
- **Kong Ingress**: High 504 Gateway Timeout rates caused by CPU-bound OPA policy evaluation latency (>500ms).
- **Falco**: Runtime security violation alerting on unauthorized exec attempts under the \`istio-system\` namespace.

**Root Cause Analysis (RCA)**:
1. **Primary**: A newly deployed OPA Rego policy (\`ingress-authz.rego\`) contains an $O(n^2)$ lookup complexity, causing CPU spikes on the Kong sidecars.
2. **Secondary**: The PostgreSQL instance limits connections because \`max_connections\` was left at the default in the recent Terraform state update, causing Kafka metadata queries to timeout.
3. **Tertiary**: A compromised container image (evading Trivy scans) initiated runtime shell command execs, locking kernel resources on the node.

---

### 🛠️ Remediation Action

1. **Revert OPA Policy & Scale Kong**:
   Apply the stable Rego policy and scale the Kong controller pods to handle traffic backlogs:
   \`\`\`bash
   kubectl apply -f https://raw.githubusercontent.com/devopsverse/policies/stable/ingress-authz.rego
   kubectl scale deployment kong-ingress-controller --replicas=5 -n kong
   \`\`\`

2. **Adjust PostgreSQL Connection Sizing**:
   Update your RDS/CloudSQL database instance configuration in your Terraform files to increase \`max_connections\` to \`1000\`:
   \`\`\`hcl
   resource "aws_db_instance" "platform_db" {
     # ... existing configuration
     parameter_group_name = "default.postgres14"
     parameter {
       name  = "max_connections"
       value = "1000"
     }
   }
   \`\`\`

3. **Quarantine Rogue Container & Refresh Proxy**:
   Evict the compromised pod and force-restart Istio system proxy pods to flush the exhausted connection pools:
   \`\`\`bash
   kubectl delete pod -l app=rogue-service -n production --force --grace-period=0
   kubectl rollout restart deployment -n istio-system
   \`\`\`

4. **Verify Recovery**:
   Check Prometheus metrics for 5xx error rate drops and query Kafka consumer group lag:
   \`\`\`bash
   # PromQL check
   sum(rate(istio_requests_total{response_code=~"5.."}[1m]))
   # Kafka lag check
   kubectl exec -it kafka-0 -n messaging -- kafka-consumer-groups --bootstrap-server localhost:9092 --describe --all-groups
   \`\`\``;
    }

    if (lower.includes('oom') || lower.includes('memory') || lower.includes('crash')) {
      return `### 🚨 Incident Diagnosis: Pod CrashLoopBackOff (OOMKilled)

**Diagnosis**: The container \`payment-api\` in namespace \`default\` was terminated with exit code **137** (OOMKilled).

**Root Cause Analysis (RCA)**:
- **Prometheus Metrics**: Memory saturation reached 100% of its resource limit (512MiB).
- **Loki Logs**: \`FATAL: JavaScript heap out of memory\` or \`Python memory allocation failure\`.
- **Tempo Traces**: Trace ID \`tr-98f8e8a\` shows connection pool leaks, keeping objects in memory during high throughput (250 req/sec).

---

### 🛠️ Remediation Action

1. **Temporary Patch (Right-Size Pod Limits)**:
   Increase the memory limit in the Helm deployment configurations:
   \`\`\`bash
   kubectl set resources deployment payment-api-prod --limits=memory=1Gi --requests=memory=512Mi
   \`\`\`

2. **Permanent GitOps Fix**:
   Update your \`values.yaml\` config in [values.yaml](file:///my%20devops%20projects/10-devopsverse-enterprise-cloud-platform/frontend/src/app/platform/page.tsx):
   \`\`\`yaml
   resources:
     limits:
       cpu: 500m
       memory: 1Gi # Raised from 512Mi
     requests:
       cpu: 100m
       memory: 512Mi
   \`\`\`
   Commit the change and trigger an ArgoCD sync.`;
    }

    if (lower.includes('slow') || lower.includes('latency') || lower.includes('timeout')) {
      return `### ⏱️ Incident Diagnosis: High API Response Latency (Slowdown)

**Diagnosis**: Ingress gateway response latency spiked from 50ms to **1.8 seconds** for endpoint \`/api/v1/payments/checkout\`.

**Root Cause Analysis (RCA)**:
- **Istio Service Mesh telemetry**: Latency is not inside \`kong-api-gateway\` or \`auth-api\`. It is isolated in \`payment-api\`.
- **Postgres telemetry**: Active transactions show table locks on the \`ledger\` database table.
- **Redis metrics**: Cache hit rate dropped to 0%, causing all calls to fall back to the PostgreSQL database.

---

### 🛠️ Remediation Action

1. **Clear Database Transaction Locks**:
   Identify and terminate hanging SQL locks in Postgres:
   \`\`\`sql
   SELECT pg_cancel_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND query_start < now() - interval '5 minutes';
   \`\`\`

2. **Warm the Redis Cache**:
   Execute redis-cli flush and reload configuration to restore cache operations:
   \`\`\`bash
   kubectl exec -it deployment/redis-cache -- redis-cli flushall
   \`\`\`

3. **Verify Service Mesh Routing**:
   Confirm Istio timeout configurations are set to prevent cascading thread pools exhaust:
   \`\`\`yaml
   apiVersion: networking.istio.io/v1alpha3
   kind: VirtualService
   metadata:
     name: payment-vs
   spec:
     hosts:
       - payment-api
     http:
       - route:
           - destination:
               host: payment-api
         timeout: 3s
   \`\`\` (Commit changes to [istio-mesh.yaml](file:///my%20devops%20projects/10-devopsverse-enterprise-cloud-platform/kubernetes/istio-mesh.yaml))`;
    }

    if (lower.includes('falco') || lower.includes('security') || lower.includes('unauthorized') || lower.includes('shell')) {
      return `### 🔒 Incident Diagnosis: Runtime Security Policy Violation (Falco Alert)

**Diagnosis**: Falco runtime sensor detected a high-severity execution anomaly in container \`payment-api-prod\` (Pod: \`payment-api-prod-9f8287\`).

**Root Cause Analysis (RCA)**:
- **Falco Rules Log**: Triggered rule \`Spawned process inside container\` at timestamp \`2026-06-06T12:45\`.
- **Details**: User \`root\` executed shell process \`/bin/sh -i\` which opened a connection descriptor. This is typical behavior for an attempted reverse shell exploit.

---

### 🛠️ Remediation Action

1. **Quarantine the Pod**:
   Immediately isolate the affected pod using a NetworkPolicy or delete it to trigger a rollout:
   \`\`\`bash
   kubectl delete pod payment-api-prod-9f8287 --force --grace-period=0
   \`\`\`

2. **Enable Read-Only Root Filesystem**:
   Prevent runtime file writes by altering the OPA / Kubernetes PodSecurityContext:
   \`\`\`yaml
   spec:
     containers:
     - name: payment-api
       securityContext:
         readOnlyRootFilesystem: true
         runAsNonRoot: true
         runAsUser: 10001
   \`\`\`

3. **Enforce Policy Audit**:
   Verify container builds using Trivy to patch vulnerabilities that allowed initial shell execution.`;
    }

    if (lower.includes('cost') || lower.includes('billing') || lower.includes('finops') || lower.includes('spend')) {
      return `### 💸 Platform FinOps Cost Assessment

**Diagnosis**: Cloud billing analysis indicates a **14.2% spike** in AWS compute costs over the last 30 days.

**Root Cause Analysis (RCA)**:
- **Kubecost Audit**: Dynamic node scaling triggered AWS AutoScaling group scaling in region \`us-east-1\` to support staging workloads that were running on high-cost On-Demand \`m5.2xlarge\` instances instead of Spot instances.
- **Orphan Volumes**: Two unattached \`io2\` SSD volumes (100GB each) are incurring billing while idle.

---

### 🛠️ Remediation Action

1. **Implement Spot Node Pools**:
   Apply Terraform updates to transition the staging node group to Spot:
   \`\`\`hcl
   resource "aws_eks_node_group" "staging" {
     cluster_name  = aws_eks_cluster.eks.name
     node_role_arn = aws_iam_role.node.arn
     # ...
     capacity_type  = "SPOT"
     instance_types = ["t3.medium", "t3.large"]
   }
   \`\`\`

2. **Tear Down Idle Storage**:
   Locate and delete orphan AWS volumes:
   \`\`\`bash
   aws ec2 delete-volume --volume-id vol-0af4b3e8e89f81a
   \`\`\`

3. **Configure Kubecost Budget Alerts**:
   Enable Slack alert integrations for namespace cost thresholds exceeding $20/day.`;
    }

    return `### 🤖 Antigravity-SRE Platform Copilot

I am online and analyzing the **DevOpsVerse Enterprise Cloud Platform** logs, metrics, and configurations.

I can assist you with troubleshooting. Try asking:
- *"Why is payment-api crashing?"* (OOM/CrashLoop diagnostics)
- *"How do I fix latency on checkout requests?"* (Database/Redis diagnostics)
- *"A Falco alert was fired, how do I secure the cluster?"* (Security remediation)
- *"Show me how to optimize our AWS spend."* (FinOps recommendations)

If you have specific errors, paste them here and I will scan the local cluster state.`;
  }
}

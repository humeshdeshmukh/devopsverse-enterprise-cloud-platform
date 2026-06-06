'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Database, 
  DollarSign, 
  ShieldAlert, 
  Layers, 
  Activity,
  GitBranch,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export default function OverviewPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [falcoAlerts, setFalcoAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    async function fetchData() {
      try {
        const [metricsRes, alertsRes] = await Promise.all([
          fetch(`${backendUrl}/api/telemetry/metrics`),
          fetch(`${backendUrl}/api/security/falco-alerts`)
        ]);
        
        if (metricsRes.ok) setMetrics(await metricsRes.json());
        if (alertsRes.ok) setFalcoAlerts(await alertsRes.json());
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  return (
    <div>
      {/* Topology Intro banner */}
      <div className="glass" style={{ padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', filter: 'blur(40px)' }}></div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
          Welcome to the DevOpsVerse Flagship Console
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '800px', lineHeight: '1.6' }}>
          This multi-cloud management dashboard coordinates **Kong API Gateway**, **Istio Service Mesh**, **Kubernetes orchestration**, and **ArgoCD GitOps** engines across AWS, Azure, and GCP clusters.
        </p>
      </div>

      {/* Main KPIs Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* KPI 1 */}
        <div className="glass glass-interactive" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Overall Cluster CPU</span>
            <Cpu size={20} color="#38bdf8" />
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: '800' }}>42.8%</h3>
          <span style={{ fontSize: '12px', color: 'rgb(74, 222, 128)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <span className="pulse-indicator success" style={{ margin: 0, width: '6px', height: '6px' }}></span> 
            Healthy allocation
          </span>
        </div>

        {/* KPI 2 */}
        <div className="glass glass-interactive" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>FinOps Multi-Cloud Spend</span>
            <DollarSign size={20} color="#a78bfa" />
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: '800' }}>$27,481.40</h3>
          <span style={{ fontSize: '12px', color: 'rgb(74, 222, 128)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <TrendingDown size={14} /> -4.2% optimization saving
          </span>
        </div>

        {/* KPI 3 */}
        <div className="glass glass-interactive" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>GitOps Pipelines (ArgoCD)</span>
            <GitBranch size={20} color="#fbbf24" />
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: '800' }}>4 / 5</h3>
          <span style={{ fontSize: '12px', color: '#fbbf24', marginTop: '6px', display: 'block' }}>
            1 Service Out-Of-Sync
          </span>
        </div>

        {/* KPI 4 */}
        <div className="glass glass-interactive" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Runtime Security Violations</span>
            <ShieldAlert size={20} color="#f87171" />
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: '800' }}>
            {loading ? '...' : falcoAlerts.length}
          </h3>
          <span style={{ fontSize: '12px', color: '#f87171', marginTop: '6px', display: 'block' }}>
            Active audit notifications
          </span>
        </div>
      </div>

      {/* Main Grid: Topology and Incident Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Topology Map */}
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
            Enterprise Deployment Topology
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', padding: '20px 0' }}>
            {/* Gateway */}
            <div className="glass" style={{ padding: '12px 24px', width: '220px', textAlign: 'center', borderLeft: '4px solid #38bdf8' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Kong API Gateway</span>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>api.devopsverse.local</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', height: '24px', width: '2px', background: '#38bdf8' }}></div>

            {/* Service Mesh Boundary */}
            <div className="glass" style={{ padding: '16px', width: '100%', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
              <div style={{ textAlign: 'center', fontSize: '11px', textTransform: 'uppercase', color: '#818cf8', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Istio Service Mesh Cluster Overlay
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', gap: '12px', flexWrap: 'wrap' }}>
                {metrics.map(svc => (
                  <div key={svc.service} className="glass" style={{ padding: '10px 16px', minWidth: '140px', textAlign: 'center', background: 'rgba(255,255,255,0.03)' }}>
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Service</span>
                    <div style={{ fontWeight: '700', fontSize: '13px', margin: '4px 0' }}>{svc.service}</div>
                    <span className={`badge ${svc.status === 'healthy' ? 'badge-success' : svc.status === 'degraded' ? 'badge-warning' : 'badge-error'}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                      {svc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', height: '24px', width: '2px', background: '#818cf8' }}></div>

            {/* Backends & Brokers */}
            <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'center' }}>
              <div className="glass" style={{ padding: '12px 20px', width: '180px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Messaging Broker</span>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#fbbf24' }}>Kafka / RabbitMQ</div>
              </div>
              
              <div className="glass" style={{ padding: '12px 20px', width: '180px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Persistent DB</span>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#f87171' }}>PostgreSQL / Redis</div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Link href="/mesh" style={{ color: '#38bdf8', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
              Inspect Service Mesh details <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Live Security Log */}
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
            Runtime Security Event Log
          </h3>
          <div className="console-box" style={{ height: '315px', padding: '12px' }}>
            {loading ? (
              <span className="console-line muted">Polling security feeds...</span>
            ) : falcoAlerts.length === 0 ? (
              <span className="console-line success">All Falco runtime shields green. No alerts.</span>
            ) : (
              falcoAlerts.map((alert, idx) => (
                <div key={idx} style={{ marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className={`badge ${alert.priority === 'Critical' ? 'badge-error' : 'badge-warning'}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                      {alert.priority}
                    </span>
                    <span style={{ color: '#6b7280', fontSize: '10px' }}>
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ color: '#fbbf24', fontSize: '11px', fontWeight: '700' }}>{alert.rule}</div>
                  <div style={{ color: 'var(--text-main)', fontSize: '11px', marginTop: '2px', fontFamily: 'monospace' }}>
                    {alert.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

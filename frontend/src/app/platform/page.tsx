'use client';

import React, { useState, useEffect } from 'react';
import { Layers, GitBranch, RefreshCw, Plus, Code, HelpCircle, Terminal as TermIcon } from 'lucide-react';

export default function PlatformPage() {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [argoApps, setArgoApps] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'argo' | 'scaffold'>('catalog');
  
  // Scaffold state variables
  const [templateType, setTemplateType] = useState('microservice');
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('billing-team');
  const [description, setDescription] = useState('');
  const [cpuLimit, setCpuLimit] = useState('500m');
  const [memoryLimit, setMemoryLimit] = useState('512Mi');
  const [replicaCount, setReplicaCount] = useState(2);
  const [dbType, setDbType] = useState('postgres');
  const [cloudProvider, setCloudProvider] = useState('aws');

  // Scaffolder response
  const [scaffoldResult, setScaffoldResult] = useState<any>(null);
  const [scaffoldLogs, setScaffoldLogs] = useState<string[]>([]);
  const [scaffoldFiles, setScaffoldFiles] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchData = async () => {
    try {
      const [catRes, argoRes] = await Promise.all([
        fetch(`${backendUrl}/api/platform/catalog`),
        fetch(`${backendUrl}/api/platform/argo-apps`),
      ]);
      if (catRes.ok) setCatalog(await catRes.json());
      if (argoRes.ok) setArgoApps(await argoRes.json());
    } catch (err) {
      console.error('Fetch platform data error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [backendUrl]);

  // ArgoCD Sync handler
  const handleArgoSync = async (appName: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/platform/argo-apps/${appName}/sync`, {
        method: 'POST'
      });
      if (res.ok) {
        // Refresh apps list
        fetchData();
      }
    } catch (err) {
      console.error('Argo sync failed:', err);
    }
  };

  // Scaffolder Form Handler
  const handleScaffoldSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setScaffoldResult(null);
    setScaffoldLogs(['[Portal] Sending scaffolding request to control plane...']);
    setScaffoldFiles([]);

    const payload = {
      templateType,
      params: {
        name,
        owner,
        description,
        cpuLimit,
        memoryLimit,
        replicaCount: Number(replicaCount),
        dbType,
        cloudProvider,
      }
    };

    try {
      const res = await fetch(`${backendUrl}/api/platform/scaffold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        // Simulate real-time printing logs
        let delay = 0;
        data.logs.forEach((logLine: string, index: number) => {
          setTimeout(() => {
            setScaffoldLogs(prev => [...prev, logLine]);
            if (index === data.logs.length - 1) {
              setScaffoldResult('success');
              setScaffoldFiles(data.files || []);
              fetchData(); // reload catalog / argo lists
              setSubmitting(false);
            }
          }, delay);
          delay += 500;
        });
      } else {
        setScaffoldLogs(prev => [...prev, '❌ Scaffolder failed with API error.']);
        setSubmitting(false);
      }
    } catch (err) {
      setScaffoldLogs(prev => [...prev, '❌ Network communication error during scaffolding.']);
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Navigation tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', gap: '16px' }}>
        <button 
          onClick={() => setActiveTab('catalog')}
          className={`btn-secondary`}
          style={{ 
            background: activeTab === 'catalog' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            borderColor: activeTab === 'catalog' ? '#6366f1' : 'transparent',
            padding: '10px 20px',
            fontSize: '14px',
            borderBottom: activeTab === 'catalog' ? '2px solid #6366f1' : 'none',
            borderRadius: '8px 8px 0 0'
          }}
        >
          Developer Portal Catalog
        </button>
        <button 
          onClick={() => setActiveTab('argo')}
          className={`btn-secondary`}
          style={{ 
            background: activeTab === 'argo' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            borderColor: activeTab === 'argo' ? '#6366f1' : 'transparent',
            padding: '10px 20px',
            fontSize: '14px',
            borderBottom: activeTab === 'argo' ? '2px solid #6366f1' : 'none',
            borderRadius: '8px 8px 0 0'
          }}
        >
          ArgoCD GitOps Status
        </button>
        <button 
          onClick={() => setActiveTab('scaffold')}
          className={`btn-secondary`}
          style={{ 
            background: activeTab === 'scaffold' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            borderColor: activeTab === 'scaffold' ? '#6366f1' : 'transparent',
            padding: '10px 20px',
            fontSize: '14px',
            borderBottom: activeTab === 'scaffold' ? '2px solid #6366f1' : 'none',
            borderRadius: '8px 8px 0 0'
          }}
        >
          <Plus size={14} style={{ marginRight: '6px', display: 'inline' }} />
          Golden Path Templates
        </button>
      </div>

      {/* Tab 1: Catalog */}
      {activeTab === 'catalog' && (
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Service & Infrastructure Catalog</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
            Unified metadata list (Backstage style) tracking software applications, data models, APIs, and ownership teams.
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 8px' }}>Component Name</th>
                <th style={{ padding: '12px 8px' }}>Type</th>
                <th style={{ padding: '12px 8px' }}>Owner</th>
                <th style={{ padding: '12px 8px' }}>Lifecycle</th>
                <th style={{ padding: '12px 8px' }}>Framework / Version</th>
                <th style={{ padding: '12px 8px' }}>Repository</th>
              </tr>
            </thead>
            <tbody>
              {catalog.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: '700' }}>{item.name}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className="badge badge-info">{item.type}</span>
                  </td>
                  <td style={{ padding: '12px 8px', color: '#818cf8' }}>{item.owner}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className={`badge ${item.lifecycle === 'production' ? 'badge-success' : 'badge-warning'}`}>
                      {item.lifecycle}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>{item.language}</td>
                  <td style={{ padding: '12px 8px', fontSize: '12px' }}>
                    <a href={item.repoUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                      Git Repository
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: ArgoCD */}
      {activeTab === 'argo' && (
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>GitOps Deployment Manager</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
            ArgoCD continuous deployment applications. Monitors Git repository configurations synchronizing to active clusters.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {argoApps.map((app) => (
              <div key={app.name} className="glass" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{app.name}</h4>
                  <span className={`badge ${app.health === 'Healthy' ? 'badge-success' : 'badge-error'}`}>
                    {app.health}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cluster Target:</span>
                    <span style={{ color: 'white', fontFamily: 'monospace' }}>{app.destinationCluster}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Namespace:</span>
                    <span style={{ color: 'white' }}>{app.namespace}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Sync Posture:</span>
                    <span className={`badge ${app.status === 'Synced' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '10px' }}>
                      {app.status}
                    </span>
                  </div>
                </div>
                {app.status === 'OutOfSync' ? (
                  <button 
                    onClick={() => handleArgoSync(app.name)}
                    className="btn-primary" 
                    style={{ width: '100%', padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <RefreshCw size={14} /> Reconcile & Sync GitOps
                  </button>
                ) : (
                  <button 
                    disabled 
                    className="btn-secondary" 
                    style={{ width: '100%', padding: '8px 16px', fontSize: '13px', opacity: 0.5, cursor: 'not-allowed' }}
                  >
                    Synced
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Scaffold */}
      {activeTab === 'scaffold' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          {/* Form */}
          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Golden Path Templates Wizard</h3>
            <form onSubmit={handleScaffoldSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Template Category</label>
                <select className="form-select" value={templateType} onChange={(e) => setTemplateType(e.target.value)}>
                  <option value="microservice">Pre-configured Helm Microservice</option>
                  <option value="database">Multi-Cloud Terraform Database</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Name Identifier</label>
                <input required type="text" className="form-input" placeholder="e.g. order-processing" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Ownership Team</label>
                <select className="form-select" value={owner} onChange={(e) => setOwner(e.target.value)}>
                  <option value="billing-team">billing-team (Billing & Payments)</option>
                  <option value="logistics-team">logistics-team (Order & Shipping)</option>
                  <option value="security-team">security-team (IAM & Gatekeeper)</option>
                  <option value="dba-team">dba-team (DB & Cache Ops)</option>
                </select>
              </div>

              {templateType === 'microservice' ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>CPU Allocation Limit</label>
                      <input type="text" className="form-input" value={cpuLimit} onChange={(e) => setCpuLimit(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Memory Allocation Limit</label>
                      <input type="text" className="form-input" value={memoryLimit} onChange={(e) => setMemoryLimit(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Replicas Count</label>
                    <input type="number" className="form-input" value={replicaCount} onChange={(e) => setReplicaCount(Number(e.target.value))} />
                  </div>
                </>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Database Engine</label>
                    <select className="form-select" value={dbType} onChange={(e) => setDbType(e.target.value)}>
                      <option value="postgres">PostgreSQL 15</option>
                      <option value="redis">Redis 7 (In-Memory Key/Value)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Cloud Host Provider</label>
                    <select className="form-select" value={cloudProvider} onChange={(e) => setCloudProvider(e.target.value)}>
                      <option value="aws">AWS (Amazon RDS / ElastiCache)</option>
                      <option value="azure">Azure (Flexible Server / Cache)</option>
                      <option value="gcp">GCP (Cloud SQL / Memorystore)</option>
                    </select>
                  </div>
                </div>
              )}

              <button 
                disabled={submitting}
                type="submit" 
                className="btn-primary" 
                style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {submitting ? 'Scaffolding...' : 'Generate Architecture & Register Catalog'}
              </button>
            </form>
          </div>

          {/* Scaffold Console Output */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Logs Console */}
            <div className="glass" style={{ padding: '24px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
                <TermIcon size={16} color="#38bdf8" />
                <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Platform Execution Console</h4>
              </div>
              <div className="console-box" style={{ height: '230px', fontSize: '12px' }}>
                {scaffoldLogs.length === 0 ? (
                  <span className="console-line muted">Awaiting Golden Path initiation...</span>
                ) : (
                  scaffoldLogs.map((log, idx) => (
                    <div key={idx} className={`console-line ${log.startsWith('[Portal]') ? 'info' : log.includes('error') || log.startsWith('❌') ? 'error' : 'success'}`}>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Generated Files */}
            {scaffoldFiles.length > 0 && (
              <div className="glass" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Code size={16} color="#a78bfa" />
                  <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Output Artifacts</h4>
                </div>
                {scaffoldFiles.map((file, idx) => (
                  <div key={idx} style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: '600', marginBottom: '4px', fontFamily: 'monospace' }}>
                      📄 {file.filename}
                    </div>
                    <div className="console-box" style={{ height: '110px', fontSize: '11px', padding: '10px' }}>
                      <pre style={{ margin: 0, color: '#f3f4f6' }}>{file.content}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

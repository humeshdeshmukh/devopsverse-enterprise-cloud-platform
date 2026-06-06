'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SecurityPage() {
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [opaPolicies, setOpaPolicies] = useState<any[]>([]);
  const [falcoAlerts, setFalcoAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    async function fetchSecurityData() {
      try {
        const [vulnRes, opaRes, falcoRes] = await Promise.all([
          fetch(`${backendUrl}/api/security/vulnerabilities`),
          fetch(`${backendUrl}/api/security/opa-policies`),
          fetch(`${backendUrl}/api/security/falco-alerts`),
        ]);
        if (vulnRes.ok) setVulnerabilities(await vulnRes.json());
        if (opaRes.ok) setOpaPolicies(await opaRes.json());
        if (falcoRes.ok) setFalcoAlerts(await falcoRes.json());
      } catch (err) {
        console.error('Error fetching security data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 4000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ShieldAlert size={36} color="#f87171" />
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>Trivy CVEs</span>
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>1 Critical / 8 High</h3>
          </div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ShieldCheck size={36} color="#4ade80" />
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>OPA Gatekeeper</span>
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>3 / 5 Rules Passing</h3>
          </div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AlertTriangle size={36} color="#fbbf24" />
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>Falco Audit Feed</span>
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>{loading ? '...' : falcoAlerts.length} Active Events</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        
        {/* Trivy Vulnerability Table */}
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
            Trivy Static Container Vulnerabilities
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 6px' }}>Container Image</th>
                <th style={{ padding: '10px 6px', textAlign: 'center' }}>Critical</th>
                <th style={{ padding: '10px 6px', textAlign: 'center' }}>High</th>
                <th style={{ padding: '10px 6px', textAlign: 'center' }}>Medium</th>
                <th style={{ padding: '10px 6px', textAlign: 'center' }}>Low</th>
              </tr>
            </thead>
            <tbody>
              {vulnerabilities.map((report, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 6px', fontWeight: '700' }}>
                    {report.imageName}
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'inline', marginLeft: '6px' }}>
                      ({report.tag})
                    </span>
                  </td>
                  <td style={{ padding: '10px 6px', textAlign: 'center', color: report.critical > 0 ? '#f87171' : 'var(--text-muted)', fontWeight: report.critical > 0 ? '700' : 'normal' }}>
                    {report.critical}
                  </td>
                  <td style={{ padding: '10px 6px', textAlign: 'center', color: report.high > 0 ? '#fbbf24' : 'var(--text-muted)', fontWeight: report.high > 0 ? '700' : 'normal' }}>
                    {report.high}
                  </td>
                  <td style={{ padding: '10px 6px', textAlign: 'center' }}>{report.medium}</td>
                  <td style={{ padding: '10px 6px', textAlign: 'center' }}>{report.low}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* OPA Policy Compliance Check */}
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
            OPA Gatekeeper Policy Rules
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {opaPolicies.map((policy) => (
              <div key={policy.id} className="glass" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {policy.status === 'passed' ? (
                    <CheckCircle size={20} color="#4ade80" />
                  ) : (
                    <XCircle size={20} color="#f87171" />
                  )}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700' }}>{policy.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{policy.description}</div>
                  </div>
                </div>
                <span className={`badge ${policy.status === 'passed' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '9px' }}>
                  {policy.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Falco Runtime Alert Console */}
      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
          Falco Threat Detection Engine Alerts
        </h3>
        <div className="console-box" style={{ maxHeight: '350px' }}>
          {falcoAlerts.map((alert, idx) => (
            <div key={idx} style={{ marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span className={`badge ${alert.priority === 'Critical' ? 'badge-error' : 'badge-warning'}`}>
                    {alert.priority}
                  </span>
                  <span style={{ fontWeight: '700', fontSize: '13px', color: '#fbbf24' }}>{alert.rule}</span>
                </div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '13px', fontFamily: 'monospace', margin: '4px 0 0 0' }}>
                {alert.message}
              </p>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Pod Container Hash ID: <span style={{ color: '#38bdf8' }}>{alert.containerId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

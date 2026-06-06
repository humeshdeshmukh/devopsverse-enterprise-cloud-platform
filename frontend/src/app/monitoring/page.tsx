'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCw, BarChart2, Activity, Play, CheckCircle } from 'lucide-react';

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [traces, setTraces] = useState<any[]>([]);
  const [logFilter, setLogFilter] = useState('ALL');
  const [compFilter, setCompFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedTrace, setSelectedTrace] = useState<any>(null);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchData = async () => {
    try {
      const [metricsRes, logsRes, tracesRes] = await Promise.all([
        fetch(`${backendUrl}/api/telemetry/metrics`),
        fetch(`${backendUrl}/api/telemetry/logs?limit=40`),
        fetch(`${backendUrl}/api/telemetry/traces`),
      ]);
      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
      if (tracesRes.ok) {
        const traceData = await tracesRes.json();
        setTraces(traceData);
        if (traceData.length > 0 && !selectedTrace) {
          setSelectedTrace(traceData[0]);
        }
      }
    } catch (err) {
      console.error('Fetch monitoring data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  // Client side filtering for logs
  const filteredLogs = logs.filter(log => {
    const levelMatch = logFilter === 'ALL' || log.level === logFilter;
    const compMatch = compFilter === 'ALL' || log.component === compFilter;
    return levelMatch && compMatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Metrics Section: Golden Signals */}
      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
          Microservices Golden Signals (Prometheus Scraped)
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {metrics.map((svc) => (
            <div key={svc.service} className="glass" style={{ padding: '16px', background: 'rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '14px' }}>{svc.service}</span>
                <span className={`badge ${svc.status === 'healthy' ? 'badge-success' : svc.status === 'degraded' ? 'badge-warning' : 'badge-error'}`} style={{ fontSize: '9px' }}>
                  {svc.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Latency (avg):</span>
                  <span style={{ color: svc.latency > 300 ? '#f87171' : 'white', fontWeight: '600' }}>{svc.latency}ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Traffic (rate):</span>
                  <span>{svc.throughput} rps</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Error Rate:</span>
                  <span style={{ color: svc.errorRate > 2 ? '#f87171' : 'white' }}>{svc.errorRate.toFixed(2)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>CPU Saturation:</span>
                  <span>{svc.cpu}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Loki logs + Tempo Traces */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Loki Logs Terminal */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Grafana Loki Log Aggregator</h3>
            
            {/* Filter controls */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <select className="form-select" style={{ padding: '4px 8px', fontSize: '11px', width: 'auto' }} value={logFilter} onChange={(e) => setLogFilter(e.target.value)}>
                <option value="ALL">ALL LEVELS</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
              </select>
              <select className="form-select" style={{ padding: '4px 8px', fontSize: '11px', width: 'auto' }} value={compFilter} onChange={(e) => setCompFilter(e.target.value)}>
                <option value="ALL">ALL HOSTS</option>
                <option value="gateway">gateway</option>
                <option value="auth-service">auth-service</option>
                <option value="payment-service">payment-service</option>
                <option value="database">database</option>
              </select>
            </div>
          </div>

          <div className="console-box" style={{ height: '360px', padding: '12px', fontSize: '12px' }}>
            {filteredLogs.length === 0 ? (
              <span className="console-line muted">No logs matching filter found.</span>
            ) : (
              filteredLogs.map((log, idx) => (
                <div key={idx} className="console-line" style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#6b7280' }}>[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span style={{ 
                    color: log.level === 'ERROR' ? '#f87171' : log.level === 'WARN' ? '#fbbf24' : '#4ade80',
                    fontWeight: '700',
                    minWidth: '45px',
                    display: 'inline-block'
                  }}>
                    {log.level}
                  </span>
                  <span style={{ color: '#f3f4f6' }}>{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tempo Traces Explorer */}
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
            Grafana Tempo Distributed Tracing
          </h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            {traces.map((trace) => (
              <button 
                key={trace.traceId}
                onClick={() => setSelectedTrace(trace)}
                className="btn-secondary"
                style={{ 
                  flex: 1, 
                  fontSize: '11px', 
                  padding: '8px 12px',
                  background: selectedTrace?.traceId === trace.traceId ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  borderColor: selectedTrace?.traceId === trace.traceId ? '#6366f1' : 'var(--card-border)'
                }}
              >
                <div style={{ fontWeight: '700', color: 'white' }}>{trace.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  ID: {trace.traceId.substring(0, 8)}... ({trace.duration}ms)
                </div>
              </button>
            ))}
          </div>

          {selectedTrace && (
            <div className="glass" style={{ padding: '16px', background: 'rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Trace Root: <strong>{selectedTrace.name}</strong></span>
                <span>TraceID: {selectedTrace.traceId}</span>
              </div>
              
              {/* Span visual hierarchy */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedTrace.spans.map((span: any, index: number) => {
                  // Calculate indent padding based on depth
                  let depth = 0;
                  if (span.parentSpanId) {
                    depth = span.parentSpanId.includes('proxy') ? 1 : 2;
                  }
                  
                  return (
                    <div 
                      key={span.spanId} 
                      style={{ 
                        marginLeft: `${depth * 20}px`,
                        borderLeft: '2px solid rgba(255,255,255,0.1)',
                        paddingLeft: '10px'
                      }}
                    >
                      <div className="glass" style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '10px', color: '#38bdf8', fontFamily: 'monospace' }}>{span.service}</span>
                          <div style={{ fontSize: '12px', fontWeight: '700', marginTop: '2px' }}>{span.name}</div>
                          {span.status === 'ERROR' && (
                            <div style={{ fontSize: '10px', color: '#f87171', marginTop: '2px' }}>
                              ⚠ {span.errorDetails}
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: span.status === 'ERROR' ? '#f87171' : 'white' }}>
                          {span.duration}ms
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Network, Sliders, Layers, RefreshCw, Lock, HelpCircle } from 'lucide-react';

export default function MeshPage() {
  const [canaryWeight, setCanaryWeight] = useState(10); // 10% to v2
  const [gatewayStatus, setGatewayStatus] = useState('Active');
  const [serviceLock, setServiceLock] = useState(true);

  // Generate VirtualService YAML representation based on slider
  const getVirtualServiceYaml = () => {
    return `apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: payment-api-routes
  namespace: prod-apps
spec:
  hosts:
    - payment-api.devopsverse.local
  gateways:
    - payment-gateway
  http:
    - route:
        - destination:
            host: payment-api
            subset: v1
          weight: ${100 - canaryWeight}
        - destination:
            host: payment-api
            subset: v2-canary
          weight: ${canaryWeight}`;
  };

  const routes = [
    { path: '/api/v1/auth/*', service: 'auth-api', weight: '100%', tls: 'Strict mTLS' },
    { path: '/api/v1/payments/*', service: 'payment-api', weight: 'Split (Canary)', tls: 'Strict mTLS' },
    { path: '/api/v1/orders/*', service: 'order-api', weight: '100%', tls: 'Strict mTLS' },
    { path: '/api/v1/shipping/*', service: 'shipping-api', weight: '100%', tls: 'Permissive' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Overview stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div className="glass" style={{ padding: '20px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Istio Service Mesh</span>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>Strict mTLS</h3>
          <span style={{ fontSize: '12px', color: 'rgb(74, 222, 128)' }}>All pods injected with sidecar</span>
        </div>
        <div className="glass" style={{ padding: '20px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Kong API Gateway Ingress</span>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>{gatewayStatus}</h3>
          <span style={{ fontSize: '12px', color: 'rgb(74, 222, 128)' }}>Throughput: 842 req/sec</span>
        </div>
        <div className="glass" style={{ padding: '20px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Active Proxies (Envoy)</span>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>24 Running</h3>
          <span style={{ fontSize: '12px', color: 'rgb(74, 222, 128)' }}>Version: 1.18.2</span>
        </div>
      </div>

      {/* Canary controls & code panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        
        {/* Routing Controller */}
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
            Istio Canary Traffic Splitter (payment-api)
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
            Adjust the slider below to dynamically distribute ingress traffic weights between payment-api-v1 and payment-api-v2-canary.
          </p>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '14px', marginBottom: '10px' }}>
              <span style={{ color: '#38bdf8' }}>v1 (Stable): {100 - canaryWeight}%</span>
              <span style={{ color: '#a78bfa' }}>v2 (Canary): {canaryWeight}%</span>
            </div>
            
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={canaryWeight} 
              onChange={(e) => setCanaryWeight(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '5px',
                background: 'rgba(255,255,255,0.1)',
                outline: 'none',
                WebkitAppearance: 'none',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Topology preview */}
          <div className="glass" style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="glass" style={{ padding: '10px 16px', textAlign: 'center', borderColor: '#38bdf8' }}>
                <div style={{ fontWeight: '700', fontSize: '13px' }}>Gateway Ingress</div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>100% Traffic</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignSelf: 'stretch', justifyContent: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                <div>➡ ({100 - canaryWeight}%)</div>
                <div>➡ ({canaryWeight}%)</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="glass" style={{ padding: '8px 16px', borderLeft: '3px solid #38bdf8' }}>
                  <div style={{ fontWeight: '700', fontSize: '12px' }}>payment-api:v1</div>
                  <span style={{ fontSize: '10px', color: 'rgb(74, 222, 128)' }}>Active</span>
                </div>
                <div className="glass" style={{ padding: '8px 16px', borderLeft: '3px solid #a78bfa' }}>
                  <div style={{ fontWeight: '700', fontSize: '12px' }}>payment-api:v2</div>
                  <span style={{ fontSize: '10px', color: canaryWeight > 0 ? 'rgb(74, 222, 128)' : 'var(--text-muted)' }}>
                    {canaryWeight > 0 ? 'Receiving Load' : 'Idle'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live YAML Spec Output */}
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
            VirtualService Configuration (GitOps Ready)
          </h3>
          <div className="console-box" style={{ height: '300px' }}>
            <pre style={{ color: '#38bdf8', fontSize: '12px', margin: 0, whiteSpace: 'pre-wrap' }}>
              {getVirtualServiceYaml()}
            </pre>
          </div>
        </div>
      </div>

      {/* Ingress Gateway mappings */}
      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
          Kong API Gateway Route Configuration
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 8px' }}>Ingress Route Path</th>
              <th style={{ padding: '12px 8px' }}>Upstream Target Service</th>
              <th style={{ padding: '12px 8px' }}>Routing Weight</th>
              <th style={{ padding: '12px 8px' }}>Security Policy</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 8px', fontFamily: 'monospace', color: '#38bdf8' }}>{route.path}</td>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>{route.service}</td>
                <td style={{ padding: '12px 8px' }}>{route.weight}</td>
                <td style={{ padding: '12px 8px' }}>
                  <span className={`badge ${route.tls === 'Strict mTLS' ? 'badge-success' : 'badge-warning'}`}>
                    {route.tls}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

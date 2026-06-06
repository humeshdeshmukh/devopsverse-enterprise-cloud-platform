'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/styles/globals.css';
import { 
  Activity, 
  ShieldAlert, 
  Network, 
  Terminal, 
  DollarSign, 
  Cpu, 
  Compass, 
  Server,
  CloudLightning,
  Workflow
} from 'lucide-react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Control Plane Overview', href: '/', icon: Compass },
    { name: 'Service Mesh & Gateway', href: '/mesh', icon: Network },
    { name: 'Backstage & GitOps', href: '/platform', icon: Workflow },
    { name: 'Security Command', href: '/security', icon: ShieldAlert },
    { name: 'Observability & SRE', href: '/monitoring', icon: Terminal },
    { name: 'FinOps Cost Console', href: '/finops', icon: DollarSign },
    { name: 'AI-SRE Copilot', href: '/ai-sre', icon: CloudLightning },
  ];

  return (
    <html lang="en">
      <body>
        <div className="app-container">
          {/* Sidebar */}
          <aside className="sidebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
              <div style={{ background: 'linear-gradient(135deg, #6366f1, #38bdf8)', padding: '8px', borderRadius: '8px' }}>
                <Server size={22} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.03em' }}>
                  DEVOPS<span style={{ color: '#38bdf8' }}>VERSE</span>
                </h3>
                <span style={{ fontSize: '10px', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
                  Enterprise Cloud
                </span>
              </div>
            </div>

            <nav style={{ flex: 1 }}>
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer / System Status */}
            <div className="glass" style={{ padding: '12px', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Kubernetes:</span>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="pulse-indicator success" style={{ margin: '0 4px 0 0', width: '6px', height: '6px' }}></span>
                  Online
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Kong Gateway:</span>
                <span>Active</span>
              </div>
            </div>
          </aside>

          {/* Main Content Pane */}
          <main className="main-content">
            {/* Common Header */}
            <header className="header-container">
              <div>
                <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600', textTransform: 'uppercase' }}>
                  Enterprise Control Plane
                </span>
                <h1 style={{ fontSize: '24px', fontWeight: '800' }}>
                  {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
                </h1>
              </div>

              {/* Cloud Regions Indicators */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="glass" style={{ padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '700', color: '#ff9900' }}>AWS</span>
                  <span className="badge badge-success">EKS-Prod</span>
                </div>
                <div className="glass" style={{ padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '700', color: '#0078d4' }}>Azure</span>
                  <span className="badge badge-success">AKS-DR</span>
                </div>
                <div className="glass" style={{ padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '700', color: '#4285f4' }}>GCP</span>
                  <span className="badge badge-success">GKE-Core</span>
                </div>
              </div>
            </header>

            {/* Page Body */}
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

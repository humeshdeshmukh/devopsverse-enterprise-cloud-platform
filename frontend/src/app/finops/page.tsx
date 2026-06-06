'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, ShieldAlert, Award, TrendingDown, Layers, HelpCircle } from 'lucide-react';

export default function FinopsPage() {
  const [costs, setCosts] = useState<any[]>([]);
  const [namespaces, setNamespaces] = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    async function fetchFinopsData() {
      try {
        const [costsRes, nsRes, breakRes, recRes] = await Promise.all([
          fetch(`${backendUrl}/api/finops/costs`),
          fetch(`${backendUrl}/api/finops/namespaces`),
          fetch(`${backendUrl}/api/finops/breakdown`),
          fetch(`${backendUrl}/api/finops/recommendations`),
        ]);
        if (costsRes.ok) setCosts(await costsRes.json());
        if (nsRes.ok) setNamespaces(await nsRes.json());
        if (breakRes.ok) setBreakdown(await breakRes.json());
        if (recRes.ok) setRecommendations(await recRes.json());
      } catch (err) {
        console.error('Error fetching FinOps data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFinopsData();
  }, [backendUrl]);

  const totalMonthlySpend = costs.reduce((sum, c) => sum + c.monthlySpend, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <DollarSign size={28} color="#6366f1" />
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>Aggregated Monthly Bill</span>
            <h3 style={{ fontSize: '22px', fontWeight: '800' }}>${totalMonthlySpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <TrendingDown size={28} color="#4ade80" />
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>Identified Potential Savings</span>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#4ade80' }}>$2,177.00</h3>
          </div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <Award size={28} color="#fbbf24" />
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>FinOps Score Status</span>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fbbf24' }}>84 / 100</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Cost shares by Cloud Provider */}
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
            Cloud Host Provider Allocations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {costs.map((cost) => {
              const percentage = (cost.monthlySpend / totalMonthlySpend) * 100;
              const color = cost.provider === 'AWS' ? '#ff9900' : cost.provider === 'Azure' ? '#0078d4' : '#4285f4';
              
              return (
                <div key={cost.provider}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, display: 'inline-block' }}></span>
                      {cost.provider} Integration
                    </span>
                    <span>
                      ${cost.monthlySpend.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: color, borderRadius: '4px' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>Active resources: {cost.activeResources}</span>
                    <span>Trend: {cost.trend.toUpperCase()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cost allocation by namespace */}
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
            Kubernetes Namespace Spending Shares
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {namespaces.map((ns) => (
              <div key={ns.namespace} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{ns.namespace}</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700' }}>${ns.spend.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{ns.percentage}% of overall compute</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Kubecost Recommendations List */}
      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
          Kubecost Automated Budget & Efficiency Recommendations
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recommendations.map((rec) => (
            <div key={rec.id} className="glass" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.1)' }}>
              <div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span className={`badge ${rec.category === 'Idle Resource' ? 'badge-error' : rec.category === 'Right-sizing' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '10px' }}>
                    {rec.category}
                  </span>
                  <span style={{ fontWeight: '700', fontSize: '14px' }}>{rec.resourceName}</span>
                  <span className="badge badge-info" style={{ fontSize: '9px' }}>{rec.provider}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px', maxWidth: '800px', lineHeight: '1.5' }}>
                  {rec.description}
                </p>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Effort Difficulty: <span style={{ textTransform: 'capitalize', color: 'white' }}>{rec.difficulty}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '150px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Potential Monthly Savings</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#4ade80', marginTop: '2px' }}>
                  -${rec.potentialSavings.toFixed(2)}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-dark)', textDecoration: 'line-through', marginTop: '2px' }}>
                  Current: ${rec.currentCost.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

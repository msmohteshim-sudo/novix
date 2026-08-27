import React, { useState } from 'react';
import { Download, Printer, Filter, X, BarChart2, TrendingUp, DollarSign, Package } from 'lucide-react';
import '../dashboard/dashboard.css';

export const Reports: React.FC = () => {
  const [activeReport, setActiveReport] = useState<any>(null);

  const handleDownload = () => {
    if (!activeReport) return;
    
    // Create CSV content
    let csv = `Report: ${activeReport.title}\n`;
    csv += `Division: ${activeReport.type}\n`;
    csv += `Date: ${activeReport.date}\n\n`;
    
    csv += `EXECUTIVE SUMMARY\n`;
    csv += `"${activeReport.summary}"\n\n`;
    
    csv += `KEY METRICS\n`;
    Object.entries(activeReport.stats).forEach(([key, val]) => {
      csv += `${key.replace(/([A-Z])/g, ' $1').trim()},${val}\n`;
    });
    csv += `\n`;
    
    csv += `DETAILED BREAKDOWN\n`;
    csv += `Category,Current Period,Previous Period,Variance,Status\n`;
    activeReport.details.forEach((item: any) => {
      csv += `"${item.category}","${item.metric}","${item.previous}","${item.variance}","${item.status}"\n`;
    });
    csv += `\n`;
    
    csv += `RECOMMENDATIONS\n`;
    activeReport.recommendations.forEach((rec: string) => {
      csv += `"- ${rec}"\n`;
    });
    
    // Trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeReport.title.replace(/\s+/g, '_')}_${activeReport.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };  const reports = [
    {
      id: 1,
      title: 'Monthly Production Summary',
      description: 'Overview of factory output, machine utilization, and defect rates for the current month.',
      type: 'Production',
      icon: <BarChart2 size={24} color="#0ea5e9" />,
      date: 'Aug 2026',
      stats: { totalProduced: '125,400 m', efficiency: '94.2%', defective: '1.1%' },
      summary: "This month's production cycle for Avenza Textiles achieved a 94.2% overall efficiency rate, marking a 2.1% improvement over the previous quarter. The integration of the new weaving looms has successfully reduced bottlenecking in the finishing department. However, minor delays were observed during the dyeing phase due to temperature calibration issues.",
      details: [
        { category: 'Premium Cotton Yarn', metric: '45,200 m', previous: '42,000 m', variance: '+7.6%', status: 'Exceeding' },
        { category: 'Silk Blend Fabric', metric: '18,500 m', previous: '19,100 m', variance: '-3.1%', status: 'Below Target' },
        { category: 'Polyester Thread', metric: '61,700 m', previous: '60,500 m', variance: '+1.9%', status: 'On Target' },
        { category: 'Denim Twill', metric: '15,000 m', previous: '12,000 m', variance: '+25.0%', status: 'Exceeding' },
        { category: 'Organic Linen', metric: '8,400 m', previous: '9,000 m', variance: '-6.6%', status: 'Below Target' }
      ],
      recommendations: [
        "Recalibrate the thermostats on Dyeing Vats 3 and 4 to prevent future temperature fluctuations.",
        "Increase allocation of raw organic flax to boost the output of Organic Linen and meet Q4 demand.",
        "Schedule preventative maintenance for the new weaving looms next week to sustain high efficiency."
      ]
    },
    {
      id: 2,
      title: 'Sales & Revenue Analysis',
      description: 'Financial breakdown of fulfilled orders, revenue by region, and top-selling products.',
      type: 'Sales',
      icon: <DollarSign size={24} color="#10b981" />,
      date: 'Aug 2026',
      stats: { revenue: '$1.24M', orders: '142', growth: '+5.4%' },
      summary: "Avenza Textiles experienced robust financial growth this month, driven primarily by bulk export orders to the European market. Total revenue sits at $1.24M, exceeding our monthly forecast by 5.4%. Our B2B enterprise contracts account for 68% of this total, while direct-to-retail makes up the remaining 32%.",
      details: [
        { category: 'B2B Enterprise Contracts', metric: '$843,200', previous: '$800,000', variance: '+5.4%', status: 'On Target' },
        { category: 'Direct-to-Retail (Domestic)', metric: '$210,500', previous: '$225,000', variance: '-6.4%', status: 'Below Target' },
        { category: 'Direct-to-Retail (Export)', metric: '$186,300', previous: '$140,000', variance: '+33.0%', status: 'Exceeding' },
        { category: 'Custom Orders', metric: '$45,000', previous: '$38,000', variance: '+18.4%', status: 'Exceeding' }
      ],
      recommendations: [
        "Capitalize on the European export surge by allocating an additional 15% of marketing budget to the EU region.",
        "Investigate the drop in domestic retail sales; consider running a targeted promotional campaign in Q3.",
        "Expand the Custom Orders sales team as high-margin requests continue to outpace our current capacity."
      ]
    },
    {
      id: 3,
      title: 'Inventory Stock Valuation',
      description: 'Current valuation of raw materials, work-in-progress, and finished goods.',
      type: 'Inventory',
      icon: <Package size={24} color="#f59e0b" />,
      date: 'Current',
      stats: { rawMaterials: '$450k', finishedGoods: '$820k', turnover: '14 days' },
      summary: "Inventory turnover remains incredibly healthy at 14 days, demonstrating efficient supply chain management. We currently hold $450k in raw materials and $820k in finished goods ready for dispatch. Strategic stockpiling of raw Egyptian cotton has temporarily inflated our raw material valuation, but safeguards us against projected Q4 supply chain shortages.",
      details: [
        { category: 'Raw Egyptian Cotton', metric: '$210,000', previous: '$150,000', variance: '+40.0%', status: 'Strategic Reserve' },
        { category: 'Synthetic Dyes & Chemicals', metric: '$85,000', previous: '$90,000', variance: '-5.5%', status: 'On Target' },
        { category: 'Finished Premium Yarn', metric: '$410,000', previous: '$390,000', variance: '+5.1%', status: 'On Target' },
        { category: 'Finished Silk Fabric', metric: '$280,000', previous: '$310,000', variance: '-9.6%', status: 'Low Stock' },
        { category: 'Packaging Materials', metric: '$25,000', previous: '$22,000', variance: '+13.6%', status: 'On Target' }
      ],
      recommendations: [
        "Initiate emergency production runs for Silk Fabric to replenish stocks before the upcoming holiday rush.",
        "Audit the chemical storage facility to ensure optimal conditions for the aging synthetic dye inventory.",
        "Maintain the current stockpiling strategy for Egyptian cotton through November."
      ]
    },
    {
      id: 4,
      title: 'Machine Performance & Maintenance',
      description: 'Downtime logs, maintenance costs, and OEE (Overall Equipment Effectiveness) scores.',
      type: 'Operations',
      icon: <TrendingUp size={24} color="#8b5cf6" />,
      date: 'Last 30 Days',
      stats: { avgOEE: '88%', downtime: '42 hrs', cost: '$12k' },
      summary: "Overall Equipment Effectiveness (OEE) across the factory floor sits at a respectable 88%. We logged a total of 42 hours of unscheduled downtime this month, costing approximately $12k in lost production and parts. The primary culprit was the legacy Spinning Unit B, which accounted for 25 hours of the total downtime.",
      details: [
        { category: 'Spinning Unit A (New)', metric: '96% OEE', previous: '95%', variance: '+1.0%', status: 'Optimal' },
        { category: 'Spinning Unit B (Legacy)', metric: '65% OEE', previous: '72%', variance: '-9.7%', status: 'Critical' },
        { category: 'Automated Looms', metric: '92% OEE', previous: '89%', variance: '+3.3%', status: 'Optimal' },
        { category: 'Dyeing Vats', metric: '84% OEE', previous: '88%', variance: '-4.5%', status: 'Needs Attention' },
        { category: 'Packaging Line', metric: '98% OEE', previous: '98%', variance: '0.0%', status: 'Optimal' }
      ],
      recommendations: [
        "Immediately authorize the replacement budget for Spinning Unit B; repairs are no longer cost-effective.",
        "Conduct a deep-clean and sensor recalibration on the Dyeing Vats to restore their OEE to the 90%+ baseline.",
        "Commend the maintenance team on the stellar upkeep of the Packaging Line."
      ]
    }
  ];

  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">AVENZA TEXTILES Reports</h1>
          <p className="erp-page-subtitle">Access and generate enterprise intelligence reports</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-outline">
            <Filter size={16} style={{marginRight: '8px'}} /> Filter
          </button>
        </div>
      </div>

      <div className="erp-panel-grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
        {reports.map(report => (
          <div key={report.id} className="erp-panel col-span-6" style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid #e2e8f0' }} onClick={() => setActiveReport(report)} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.5rem' }}>
              <div style={{ padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                {report.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>{report.title}</h3>
                  <span className="erp-status-badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>{report.type}</span>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.5rem 0 1rem 0', lineHeight: 1.5 }}>
                  {report.description}
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                  {Object.entries(report.stats).map(([key, val]) => (
                    <div key={key}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#334155' }}>
                        {val as string}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeReport && (
        <div className="erp-modal-overlay">
          <div className="erp-modal" style={{ width: '900px', maxWidth: '95vw', height: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div className="erp-modal-header" style={{ borderBottom: '2px solid #e2e8f0' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.25rem' }}>{activeReport.title}</h2>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>AVENZA TEXTILES • {activeReport.date}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="erp-btn erp-btn-outline" style={{ padding: '0.5rem' }} onClick={() => window.print()}><Printer size={18} /></button>
                <button className="erp-btn erp-btn-outline" style={{ padding: '0.5rem' }} onClick={handleDownload}><Download size={18} /></button>
                <button className="erp-modal-close" onClick={() => setActiveReport(null)} style={{ marginLeft: '1rem' }}>
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="erp-modal-body" style={{ flex: 1, overflowY: 'auto', padding: '2rem', backgroundColor: '#f8fafc' }}>
              
              {/* Detailed Report Content */}
              <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}>
                
                {/* Header Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '2.5rem' }}>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0284c7', margin: 0, letterSpacing: '0.02em' }}>AVENZA TEXTILES</h1>
                  <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '1.1rem' }}>Enterprise Intelligence Report • {activeReport.type} Division</p>
                </div>

                {/* KPI Highlights */}
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                  {Object.entries(activeReport.stats).map(([key, val]) => (
                    <div key={key} style={{ flex: 1, padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <div style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>
                        {val as string}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Executive Summary */}
                <div style={{ marginBottom: '3rem' }}>
                  <h3 style={{ color: '#0f172a', fontSize: '1.25rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Executive Summary</h3>
                  <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.7 }}>
                    {activeReport.summary}
                  </p>
                </div>

                {/* Detailed Table */}
                <div style={{ marginBottom: '3rem' }}>
                  <h3 style={{ color: '#0f172a', fontSize: '1.25rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Detailed Breakdown</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9' }}>
                        <th style={{ padding: '14px 16px', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 600 }}>Category</th>
                        <th style={{ padding: '14px 16px', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 600 }}>Current Period</th>
                        <th style={{ padding: '14px 16px', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 600 }}>Previous Period</th>
                        <th style={{ padding: '14px 16px', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 600 }}>Variance</th>
                        <th style={{ padding: '14px 16px', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 600 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeReport.details.map((item: any, i: number) => {
                        const isPositive = item.variance.includes('+');
                        const isZero = item.variance === '0.0%';
                        let varColor = '#64748b'; // neutral
                        if (!isZero) {
                           // Depending on report type, sometimes + is bad (like downtime). For simplicity, we assume + is good unless it's operations downtime.
                           if (activeReport.type === 'Operations' && item.category.includes('Downtime')) varColor = isPositive ? '#ef4444' : '#10b981';
                           else varColor = isPositive ? '#10b981' : '#ef4444';
                        }
                        
                        let badgeClass = 'idle';
                        if (item.status === 'Exceeding' || item.status === 'Optimal') badgeClass = 'success';
                        if (item.status === 'Below Target' || item.status === 'Critical' || item.status === 'Needs Attention' || item.status === 'Low Stock') badgeClass = 'error';
                        if (item.status === 'On Target') badgeClass = 'success';
                        if (item.status === 'Strategic Reserve') badgeClass = 'running';

                        return (
                          <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '14px 16px', fontWeight: 500, color: '#1e293b' }}>{item.category}</td>
                            <td style={{ padding: '14px 16px', color: '#334155' }}>{item.metric}</td>
                            <td style={{ padding: '14px 16px', color: '#64748b' }}>{item.previous}</td>
                            <td style={{ padding: '14px 16px', color: varColor, fontWeight: 600 }}>{item.variance}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span className={`erp-status-badge ${badgeClass}`}>{item.status}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* AI Recommendations */}
                <div style={{ backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#dbeafe', padding: '1rem 1.5rem', borderBottom: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>AI</div>
                    <strong style={{ color: '#1e40af', fontSize: '1.05rem' }}>NOVAX Advisor Recommendations</strong>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#1e3a8a', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {activeReport.recommendations.map((rec: string, i: number) => (
                        <li key={i} style={{ marginBottom: i === activeReport.recommendations.length - 1 ? 0 : '0.75rem' }}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

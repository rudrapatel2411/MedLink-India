// MedLink India — Diagnostic Lab Control Panel (Phase 3)
import { useState, useEffect } from 'react';
import { labPharmacyAPI } from '../../services/api';
import { Plus, Send, ClipboardList, FileText, Activity, CheckCircle2, TrendingUp, Clock } from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

export default function LabDashboard() {
  const { t } = useLanguage();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    patientName: 'Rahul Kumar',
    testName: 'Complete Blood Count & Electrolytes',
    category: 'HAEMATOLOGY',
    metric1Name: 'Hemoglobin', metric1Val: '13.8 g/dL',
    metric2Name: 'Serum Potassium', metric2Val: '5.8 mEq/L (HIGH)',
    isCritical: true,
    criticalMessage: '🚨 CRITICAL: Potassium level is 5.8 mEq/L (High Risk of Cardiac Arrhythmia)',
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  
  // Phase 2: Pending Test Orders
  const [pendingOrders] = useState([
    { id: 'ORD-102', patientName: 'Ananya Sharma', testName: 'Lipid Profile', referredBy: 'Dr. Suresh', status: 'SAMPLE_COLLECTED' },
    { id: 'ORD-103', patientName: 'Vikram Singh', testName: 'Dengue NS1 Antigen', referredBy: 'Dr. Ramesh', status: 'PENDING_COLLECTION' }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await labPharmacyAPI.getLabReports();
      setReports(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch lab reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const metrics = {
        [reportForm.metric1Name]: reportForm.metric1Val,
        [reportForm.metric2Name]: reportForm.metric2Val,
      };
      await labPharmacyAPI.createLabReport({
        patientName: reportForm.patientName,
        testName: reportForm.testName,
        category: reportForm.category,
        metrics,
        isCritical: reportForm.isCritical,
        criticalMessage: reportForm.criticalMessage,
      });
      setSuccessMsg('✅ Test Report Generated & Auto-Pushed to Patient ABHA Vault!');
      setErrorMsg('');
      setTimeout(() => {
        setShowCreateModal(false);
        setSuccessMsg('');
        fetchData();
      }, 1500);
    } catch (err: any) {
      console.error('Failed to create report:', err);
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to generate report. Check connection.');
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /><span>{t('loadingLab')}</span></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }} className="animate-in">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('labTitle')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('labSubtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> {t('newReport')}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }} className="animate-in animate-in-delay-1">
        {[
          { key: 'orders', label: 'Pending Test Orders', icon: ClipboardList },
          { key: 'reports', label: 'Generated Reports', icon: FileText },
          { key: 'analytics', label: 'Billing & Analytics', icon: Activity },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 18px', border: 'none', borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                background: activeTab === tab.key ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                color: activeTab === tab.key ? 'var(--text-accent)' : 'var(--text-muted)',
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                borderBottom: activeTab === tab.key ? '2px solid var(--primary-500)' : '2px solid transparent',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Icon size={16} /> {tab.label}
              {tab.key === 'orders' && (
                <span style={{ background: 'var(--primary-500)', color: 'white', borderRadius: 'var(--radius-full)', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 800 }}>
                  {pendingOrders.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === 'orders' && (
        <div className="animate-in">
          <h3 style={{ fontWeight: 800, marginBottom: '16px' }}>📥 Prescription / Test Order Intake</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Tests ordered directly by doctors via their smart prescription engine.
          </p>
          <div className="dashboard-grid dashboard-grid-2">
            {pendingOrders.map(order => (
              <div key={order.id} className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-500)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{order.patientName}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Referred By: {order.referredBy}</div>
                  </div>
                  <span className="badge badge-in-progress">{order.status.replace('_', ' ')}</span>
                </div>
                <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Test Required</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-400)' }}>{order.testName}</div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => {
                  setReportForm({ ...reportForm, patientName: order.patientName, testName: order.testName });
                  setShowCreateModal(true);
                }}>
                  <Activity size={14} style={{ marginRight: '6px' }} /> Process Sample & Generate Report
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="animate-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 800 }}>📄 {t('recentReports')} (Vault Synced)</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reports.map(rep => (
          <div key={rep.id} className="glass-card-static" style={{ padding: '20px', borderLeft: rep.isCritical ? '4px solid var(--risk-critical)' : '4px solid var(--primary-500)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{rep.testName}</h4>
                  <span className="badge badge-scheduled">{rep.category}</span>
                  {rep.isCritical && <span className="badge badge-risk-critical">{t('criticalAlarm')}</span>}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {t('patientName')}: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{rep.patientName}</span> · {t('generated')}: {new Date(rep.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>
              <span className="badge badge-completed">{t('IN_VAULT')}</span>
            </div>

            {rep.isCritical && rep.criticalMessage && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px 14px', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
                {rep.criticalMessage}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {Object.entries(rep.metrics || {}).map(([key, val]: [string, any]) => (
                <div key={key} style={{ background: 'var(--bg-input)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{key}: </span>
                  <span style={{ fontWeight: 700, color: String(val).includes('HIGH') || String(val).includes('ELEVATED') ? '#f87171' : 'var(--text-primary)' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="animate-in">
          <h3 style={{ fontWeight: 800, marginBottom: '16px' }}>📈 Lab Performance & Billing Analytics</h3>
          
          <div className="dashboard-grid dashboard-grid-3" style={{ marginBottom: '24px' }}>
            <div className="glass-card stat-card stat-cyan">
              <div className="stat-card-header">
                <span className="stat-card-label">Avg. Turnaround Time</span>
                <div className="stat-card-icon"><Clock size={18} /></div>
              </div>
              <div className="stat-card-value">2.4 Hrs</div>
            </div>
            <div className="glass-card stat-card stat-emerald">
              <div className="stat-card-header">
                <span className="stat-card-label">Insurance Claims Pushed</span>
                <div className="stat-card-icon"><Send size={18} /></div>
              </div>
              <div className="stat-card-value">142</div>
            </div>
            <div className="glass-card stat-card stat-amber">
              <div className="stat-card-header">
                <span className="stat-card-label">Critical Alerts Fired</span>
                <div className="stat-card-icon"><TrendingUp size={18} /></div>
              </div>
              <div className="stat-card-value">12</div>
            </div>
          </div>

          <div className="glass-card-static" style={{ padding: '20px' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '12px' }}>Direct Insurance-Claim Documentation</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Lab reports are cryptographically signed and pushed directly to the TPA portal to support hospital insurance claims without manual document compilation.
            </p>
            <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--emerald-500)' }}>
              <CheckCircle2 size={24} />
              <div>
                <div style={{ fontWeight: 800 }}>Seamless Claim Support Active</div>
                <div style={{ fontSize: '0.8rem' }}>Billing Engine is currently auto-syncing with 5+ major TPAs.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Report Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, marginBottom: '16px' }}>{t('uploadLabReportTitle')}</h3>
            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '0.85rem' }}>
                ❌ {errorMsg}
              </div>
            )}
            {successMsg ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--risk-low)', fontWeight: 700 }}>
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleCreateReport} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="input-group">
                  <label>{t('patientName')}</label>
                  <input className="input" value={reportForm.patientName} onChange={e => setReportForm({ ...reportForm, patientName: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label>{t('testNameLabel')}</label>
                  <input className="input" value={reportForm.testName} onChange={e => setReportForm({ ...reportForm, testName: e.target.value })} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="input-group">
                    <label>{t('metric1Label')}</label>
                    <input className="input" value={reportForm.metric1Name} onChange={e => setReportForm({ ...reportForm, metric1Name: e.target.value })} />
                    <input className="input" style={{ marginTop: '4px' }} value={reportForm.metric1Val} onChange={e => setReportForm({ ...reportForm, metric1Val: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>{t('metric2Label')}</label>
                    <input className="input" value={reportForm.metric2Name} onChange={e => setReportForm({ ...reportForm, metric2Name: e.target.value })} />
                    <input className="input" style={{ marginTop: '4px' }} value={reportForm.metric2Val} onChange={e => setReportForm({ ...reportForm, metric2Val: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowCreateModal(false)} style={{ flex: 1 }}>{t('cancel')}</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}><Send size={16} /> {t('generateAndPush')}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

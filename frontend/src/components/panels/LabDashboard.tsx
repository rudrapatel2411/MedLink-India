// MedLink India — Diagnostic Lab Control Panel (Phase 3)
import { useState, useEffect } from 'react';
import { labPharmacyAPI } from '../../services/api';
import { Plus, Send } from 'lucide-react';

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
      setTimeout(() => {
        setShowCreateModal(false);
        setSuccessMsg('');
        fetchData();
      }, 1500);
    } catch (err) {
      console.error('Failed to create report:', err);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /><span>Loading Diagnostic Lab Reports...</span></div>;

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

      {/* Reports List */}
      <div className="section-header">
        <h3 className="section-title">📄 Recent Specimen Reports</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reports.map(rep => (
          <div key={rep.id} className="glass-card-static" style={{ padding: '20px', borderLeft: rep.isCritical ? '4px solid var(--risk-critical)' : '4px solid var(--primary-500)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{rep.testName}</h4>
                  <span className="badge badge-scheduled">{rep.category}</span>
                  {rep.isCritical && <span className="badge badge-risk-critical">CRITICAL ALARM</span>}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Patient: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{rep.patientName}</span> · Generated: {new Date(rep.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>
              <span className="badge badge-completed">IN VAULT</span>
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

      {/* New Report Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, marginBottom: '16px' }}>Generate Lab Report & Push to ABHA Vault</h3>
            {successMsg ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--risk-low)', fontWeight: 700 }}>
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleCreateReport} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="input-group">
                  <label>Patient Name</label>
                  <input className="input" value={reportForm.patientName} onChange={e => setReportForm({ ...reportForm, patientName: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label>Test Name</label>
                  <input className="input" value={reportForm.testName} onChange={e => setReportForm({ ...reportForm, testName: e.target.value })} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="input-group">
                    <label>Metric 1 Name & Value</label>
                    <input className="input" value={reportForm.metric1Name} onChange={e => setReportForm({ ...reportForm, metric1Name: e.target.value })} />
                    <input className="input" style={{ marginTop: '4px' }} value={reportForm.metric1Val} onChange={e => setReportForm({ ...reportForm, metric1Val: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>Metric 2 Name & Value</label>
                    <input className="input" value={reportForm.metric2Name} onChange={e => setReportForm({ ...reportForm, metric2Name: e.target.value })} />
                    <input className="input" style={{ marginTop: '4px' }} value={reportForm.metric2Val} onChange={e => setReportForm({ ...reportForm, metric2Val: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowCreateModal(false)} style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}><Send size={16} /> Push to Vault</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

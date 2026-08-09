// MedLink India — Government Health & Epidemic Analytics Panel (Phase 4)
import { useState, useEffect } from 'react';
import { insuranceGovtAPI } from '../../services/api';
import { Plus } from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

export default function GovtDashboard() {
  const { t } = useLanguage();
  const [outbreaks, setOutbreaks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [outbreakForm, setOutbreakForm] = useState({ district: 'North Delhi', state: 'Delhi', diseaseName: 'DENGUE', activeCases: '45', riskLevel: 'HIGH' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await insuranceGovtAPI.getOutbreaks();
      setOutbreaks(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch outbreaks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportOutbreak = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await insuranceGovtAPI.reportOutbreak(outbreakForm);
      setShowReportModal(false);
      fetchData();
    } catch (err) {
      console.error('Outbreak report failed:', err);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /><span>Loading Disease Outbreak Analytics...</span></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }} className="animate-in">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('govtTitle')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('govtSubtitle')}</p>
        </div>
        <button className="btn btn-danger" onClick={() => setShowReportModal(true)}>
          <Plus size={16} /> {t('reportOutbreak')}
        </button>
      </div>

      {/* Outbreak Heatmap List */}
      <div className="section-header">
        <h3 className="section-title">📍 Live Epidemic Outbreak Heatmap (District Level)</h3>
      </div>
      <div className="dashboard-grid dashboard-grid-2">
        {outbreaks.map(o => (
          <div key={o.id} className="glass-card" style={{ padding: '20px', borderLeft: o.riskLevel === 'HIGH' || o.riskLevel === 'SEVERE' ? '4px solid var(--risk-critical)' : '4px solid var(--risk-medium)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '1.2rem' }}>{o.district}, {o.state}</h4>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary-400)', fontWeight: 700, marginTop: '2px' }}>
                  🦠 {o.diseaseName} OUTBREAK
                </div>
              </div>
              <span className={`badge ${o.riskLevel === 'HIGH' || o.riskLevel === 'SEVERE' ? 'badge-risk-critical' : 'badge-risk-medium'}`}>
                {o.riskLevel} RISK
              </span>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Reported Cases</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>{o.activeCases}</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                District Needs Index:<br />
                <span style={{ color: 'var(--accent-400)', fontWeight: 700 }}>Medical Staff & Vaccines Allocated</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Outbreak Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, marginBottom: '16px' }}>Report District Outbreak Data</h3>
            <form onSubmit={handleReportOutbreak} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="input-group">
                  <label>District</label>
                  <input className="input" value={outbreakForm.district} onChange={e => setOutbreakForm({ ...outbreakForm, district: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label>State</label>
                  <input className="input" value={outbreakForm.state} onChange={e => setOutbreakForm({ ...outbreakForm, state: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="input-group">
                  <label>Disease Name</label>
                  <select className="input" value={outbreakForm.diseaseName} onChange={e => setOutbreakForm({ ...outbreakForm, diseaseName: e.target.value })}>
                    <option value="DENGUE">Dengue</option>
                    <option value="MALARIA">Malaria</option>
                    <option value="CHOLERA">Cholera</option>
                    <option value="COVID19">COVID-19</option>
                    <option value="TYPHOID">Typhoid</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Active Cases</label>
                  <input className="input" type="number" value={outbreakForm.activeCases} onChange={e => setOutbreakForm({ ...outbreakForm, activeCases: e.target.value })} required />
                </div>
              </div>
              <div className="input-group">
                <label>Risk Level</label>
                <select className="input" value={outbreakForm.riskLevel} onChange={e => setOutbreakForm({ ...outbreakForm, riskLevel: e.target.value })}>
                  <option value="MODERATE">🟡 MODERATE</option>
                  <option value="HIGH">🟠 HIGH</option>
                  <option value="SEVERE">🔴 SEVERE</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowReportModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-danger" style={{ flex: 1 }}>Submit Outbreak Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

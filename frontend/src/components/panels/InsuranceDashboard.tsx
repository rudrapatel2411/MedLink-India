// MedLink India — Insurance TPA & Auto-Claim Panel (Phase 4)
import { useState, useEffect } from 'react';
import { insuranceGovtAPI } from '../../services/api';
import { Plus, Send } from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

export default function InsuranceDashboard() {
  const { t } = useLanguage();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimForm, setClaimForm] = useState({
    patientName: 'Rahul Kumar',
    hospitalName: 'Apollo Hospitals, Delhi',
    policyNumber: 'STAR-HEALTH-991204',
    claimAmount: '35000',
    diagnosisCode: 'ICD-10-I10 (Acute Angina)',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await insuranceGovtAPI.getClaims();
      setClaims(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch claims:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await insuranceGovtAPI.submitClaim(claimForm);
      setShowClaimModal(false);
      fetchData();
    } catch (err) {
      console.error('Claim submission failed:', err);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /><span>{t('loadingInsurance')}</span></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }} className="animate-in">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('insuranceTitle')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('insuranceSubtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowClaimModal(true)}>
          <Plus size={16} /> {t('submitClaim')}
        </button>
      </div>

      {/* Claims List */}
      <div className="section-header">
        <h3 className="section-title">📄 {t('claimAuditLogs')}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {claims.map(claim => (
          <div key={claim.id} className="glass-card-static" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{claim.claimNumber}</h4>
                  <span className="badge badge-completed">{t(claim.status) || claim.status}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {t('patientName')}: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{claim.patientName}</span> · {t('hospital')}: {claim.hospitalName} · {t('policyNoLabel')}: <code style={{ color: 'var(--primary-400)' }}>{claim.policyNumber}</code>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {t('diagnosisCodeLabel')}: {claim.diagnosisCode}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-400)' }}>₹{claim.claimAmount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('cashlessApproved')}</div>
              </div>
            </div>

            {/* Audit Logs */}
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                {t('fraudAuditTitle')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {claim.auditLogs?.map((log: string, i: number) => (
                  <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="modal-overlay" onClick={() => setShowClaimModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, marginBottom: '16px' }}>{t('submitClaimTitle')}</h3>
            <form onSubmit={handleSubmitClaim} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label>{t('patientName')}</label>
                <input className="input" value={claimForm.patientName} onChange={e => setClaimForm({ ...claimForm, patientName: e.target.value })} required />
              </div>
              <div className="input-group">
                <label>{t('hospital')}</label>
                <input className="input" value={claimForm.hospitalName} onChange={e => setClaimForm({ ...claimForm, hospitalName: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="input-group">
                  <label>{t('policyNoLabel')}</label>
                  <input className="input" value={claimForm.policyNumber} onChange={e => setClaimForm({ ...claimForm, policyNumber: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label>{t('claimAmountLabel')}</label>
                  <input className="input" type="number" value={claimForm.claimAmount} onChange={e => setClaimForm({ ...claimForm, claimAmount: e.target.value })} required />
                </div>
              </div>
              <div className="input-group">
                <label>{t('diagnosisCodeLabel')}</label>
                <input className="input" value={claimForm.diagnosisCode} onChange={e => setClaimForm({ ...claimForm, diagnosisCode: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowClaimModal(false)} style={{ flex: 1 }}>{t('cancel')}</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}><Send size={16} /> {t('submit')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

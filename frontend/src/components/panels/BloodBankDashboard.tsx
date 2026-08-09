// MedLink India — Blood Bank Network Control Panel
import { useState, useEffect } from 'react';
import { hospitalAPI } from '../../services/api';
import { Droplets, Send } from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

export default function BloodBankDashboard() {
  const { t } = useLanguage();
  const [bloodBanks, setBloodBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ patientName: '', bloodBankId: '', bloodGroup: 'O-', unitsNeeded: '2', urgency: 'CRITICAL' });
  const [requestSuccess, setRequestSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await hospitalAPI.getBloodBanks();
      const banks = res.data.data || [];
      setBloodBanks(banks);
      if (banks.length > 0) {
        setRequestForm(prev => ({ ...prev, bloodBankId: banks[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch blood banks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBlood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hospitalAPI.requestBlood(requestForm);
      setRequestSuccess(`🚨 Urgent ${requestForm.unitsNeeded} ${t('unitsCount')} of ${requestForm.bloodGroup} Blood Request Dispatched!`);
      setTimeout(() => {
        setShowRequestModal(false);
        setRequestSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Blood request failed:', err);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /><span>{t('loading')}</span></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }} className="animate-in">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('bloodTitle')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('bloodSubtitle')}</p>
        </div>
        <button className="btn btn-danger" onClick={() => setShowRequestModal(true)}>
          <Droplets size={16} /> {t('urgentBloodSos')}
        </button>
      </div>

      {/* Blood Stock Cards per Center */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {bloodBanks.map(bank => (
          <div key={bank.id} className="glass-card-static" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.2rem' }}>{bank.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 {bank.address}, {bank.city} · 📞 {bank.phone}</p>
              </div>
              <span className="badge badge-completed">{t('liveSyncActive')}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
              {Object.entries(bank.stock || {}).map(([group, count]: [string, any]) => (
                <div
                  key={group}
                  style={{
                    background: group.includes('-') || count < 5 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(6, 182, 212, 0.08)',
                    border: `1px solid ${group.includes('-') || count < 5 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-glass)'}`,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{group}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: group.includes('-') || count < 5 ? '#f87171' : 'var(--text-primary)', marginTop: '2px' }}>
                    {count} <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)' }}>{t('unitsCount')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Urgent Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, marginBottom: '16px', color: '#f87171' }}>🚨 {t('requestBloodTitle')}</h3>
            {requestSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--risk-low)', fontWeight: 700 }}>
                {requestSuccess}
              </div>
            ) : (
              <form onSubmit={handleRequestBlood} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="input-group">
                  <label>{t('patientName')}</label>
                  <input className="input" placeholder="Rahul Kumar" value={requestForm.patientName} onChange={e => setRequestForm({ ...requestForm, patientName: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label>{t('selectBloodBank')}</label>
                  <select className="input" value={requestForm.bloodBankId} onChange={e => setRequestForm({ ...requestForm, bloodBankId: e.target.value })}>
                    {bloodBanks.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label>{t('bloodGroup')}</label>
                    <select className="input" value={requestForm.bloodGroup} onChange={e => setRequestForm({ ...requestForm, bloodGroup: e.target.value })}>
                      {['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Plasma', 'Platelets'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>{t('unitsNeeded')}</label>
                    <input className="input" type="number" min="1" max="10" value={requestForm.unitsNeeded} onChange={e => setRequestForm({ ...requestForm, unitsNeeded: e.target.value })} required />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowRequestModal(false)} style={{ flex: 1 }}>{t('cancel')}</button>
                  <button type="submit" className="btn btn-danger" style={{ flex: 1 }}><Send size={16} /> {t('dispatchBloodRequest')}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

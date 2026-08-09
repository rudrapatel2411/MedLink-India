// MedLink India — Hospital & ER Trauma Bay Panel
import { useState, useEffect } from 'react';
import { hospitalAPI } from '../../services/api';
import { Building2, HeartPulse, Edit2, ShieldAlert } from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

export default function HospitalDashboard() {
  const { t } = useLanguage();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [activeSOS, setActiveSOS] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHospital, setEditingHospital] = useState<any>(null);
  const [editForm, setEditForm] = useState({ availableBeds: '', icuBedsAvailable: '', oxygenBedsAvailable: '', emergencyStatus: 'GREEN' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hospRes, sosRes] = await Promise.all([
        hospitalAPI.getHospitals(),
        hospitalAPI.getActiveSOS(),
      ]);
      setHospitals(hospRes.data.data || []);
      setActiveSOS(sosRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch hospital data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBeds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHospital) return;
    try {
      await hospitalAPI.updateBeds(editingHospital.id, editForm);
      setEditingHospital(null);
      fetchData();
    } catch (err) {
      console.error('Failed to update beds:', err);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /><span>{t('loading')}</span></div>;

  const totalAvailable = hospitals.reduce((acc, h) => acc + (h.availableBeds || 0), 0);
  const totalICU = hospitals.reduce((acc, h) => acc + (h.icuBedsAvailable || 0), 0);
  const criticalCalls = activeSOS.filter(s => s.status === 'ACTIVE' || s.status === 'DISPATCHED');

  return (
    <div>
      <div style={{ marginBottom: '24px' }} className="animate-in">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('hospitalTitle')}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t('hospitalSubtitle')}</p>
      </div>

      {/* ER Emergency Banner */}
      {criticalCalls.length > 0 && (
        <div className="glass-card-static animate-in" style={{ padding: '20px', marginBottom: '24px', borderLeft: '4px solid var(--risk-critical)', background: 'rgba(239, 68, 68, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '1.5rem' }}>🚨</div>
              <div>
                <h3 style={{ fontWeight: 800, color: 'var(--risk-critical)' }}>
                  {criticalCalls.length} {t('traumaAlert')}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {t('traumaSubtitle')}
                </p>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {criticalCalls.map(sos => (
              <div key={sos.id} style={{ background: 'rgba(10, 14, 26, 0.6)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{sos.patientName}</span> ({sos.patientPhone}) · <span style={{ color: 'var(--risk-high)' }}>{sos.address}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {t('assignedVehicle')}: {sos.assignedAmbulanceNo} · {t('bloodGroup')}: <span style={{ color: '#f87171', fontWeight: 700 }}>{sos.bloodGroupNeeded || 'Any'}</span>
                  </div>
                </div>
                <span className="badge badge-risk-critical">{t(sos.status) || sos.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="dashboard-grid dashboard-grid-3 animate-in animate-in-delay-1" style={{ marginBottom: '28px' }}>
        <div className="glass-card stat-card stat-cyan">
          <div className="stat-card-header">
            <span className="stat-card-label">{t('wardBeds')}</span>
            <div className="stat-card-icon"><Building2 size={18} /></div>
          </div>
          <div className="stat-card-value">{totalAvailable}</div>
        </div>
        <div className="glass-card stat-card stat-rose">
          <div className="stat-card-header">
            <span className="stat-card-label">{t('icuBeds')}</span>
            <div className="stat-card-icon"><HeartPulse size={18} /></div>
          </div>
          <div className="stat-card-value">{totalICU}</div>
        </div>
        <div className="glass-card stat-card stat-amber">
          <div className="stat-card-header">
            <span className="stat-card-label">{t('alert')}</span>
            <div className="stat-card-icon"><ShieldAlert size={18} /></div>
          </div>
          <div className="stat-card-value">{criticalCalls.length}</div>
        </div>
      </div>

      {/* Hospital Bed Matrix */}
      <div className="section-header">
        <h3 className="section-title">🏥 {t('hospitalSubtitle')}</h3>
      </div>
      <div className="dashboard-grid dashboard-grid-2">
        {hospitals.map(h => (
          <div key={h.id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{h.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.address}, {h.city} · 📞 {h.phone}</p>
              </div>
              <span className={`badge ${h.emergencyStatus === 'GREEN' ? 'badge-completed' : 'badge-risk-high'}`}>
                {h.emergencyStatus} {t('status')}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('wardBeds')}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-400)' }}>{h.availableBeds}/{h.totalBeds}</div>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('icuBeds')}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171' }}>{h.icuBedsAvailable}</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('oxygenBeds')}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-400)' }}>{h.oxygenBedsAvailable}</div>
              </div>
            </div>

            <button
              className="btn btn-ghost btn-sm"
              style={{ width: '100%' }}
              onClick={() => {
                setEditingHospital(h);
                setEditForm({
                  availableBeds: String(h.availableBeds),
                  icuBedsAvailable: String(h.icuBedsAvailable),
                  oxygenBedsAvailable: String(h.oxygenBedsAvailable),
                  emergencyStatus: h.emergencyStatus,
                });
              }}
            >
              <Edit2 size={14} /> {t('updateBeds')}
            </button>
          </div>
        ))}
      </div>

      {/* Edit Beds Modal */}
      {editingHospital && (
        <div className="modal-overlay" onClick={() => setEditingHospital(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, marginBottom: '16px' }}>{t('updateBedTitle')} — {editingHospital.name}</h3>
            <form onSubmit={handleUpdateBeds} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label>{t('availableBedsLabel')}</label>
                <input className="input" type="number" value={editForm.availableBeds} onChange={e => setEditForm({ ...editForm, availableBeds: e.target.value })} required />
              </div>
              <div className="input-group">
                <label>{t('icuAvailableLabel')}</label>
                <input className="input" type="number" value={editForm.icuBedsAvailable} onChange={e => setEditForm({ ...editForm, icuBedsAvailable: e.target.value })} required />
              </div>
              <div className="input-group">
                <label>{t('oxygenAvailableLabel')}</label>
                <input className="input" type="number" value={editForm.oxygenBedsAvailable} onChange={e => setEditForm({ ...editForm, oxygenBedsAvailable: e.target.value })} required />
              </div>
              <div className="input-group">
                <label>{t('emergencyStatus')}</label>
                <select className="input" value={editForm.emergencyStatus} onChange={e => setEditForm({ ...editForm, emergencyStatus: e.target.value })}>
                  <option value="GREEN">🟢 GREEN (Accepting Patients)</option>
                  <option value="AMBER">🟡 AMBER (Limited Capacity)</option>
                  <option value="RED">🔴 RED (Trauma Bay Full)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setEditingHospital(null)} style={{ flex: 1 }}>{t('cancel')}</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

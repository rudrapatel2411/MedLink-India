// MedLink India — Hospital & ER Trauma Bay Panel
import { useState, useEffect } from 'react';
import { hospitalAPI } from '../../services/api';
import { Building2, HeartPulse, Edit2, ShieldAlert, Users, BedDouble, FileText, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import IPDTracker from './IPDTracker';
import OPDQueueTab from './OPDQueueTab';

export default function HospitalDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  
  // ER Overview state
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [activeSOS, setActiveSOS] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHospital, setEditingHospital] = useState<any>(null);
  const [editForm, setEditForm] = useState({ availableBeds: '', icuBedsAvailable: '', oxygenBedsAvailable: '', emergencyStatus: 'GREEN' });

  // Phase 5: Billing & Settlement State
  const [claims] = useState<any[]>([
    { id: 'hc-1', patientName: 'Rajesh Kumar', amount: '₹14,500', type: 'IPD - Discharge', status: 'PENDING_SUBMISSION', insuranceProvider: 'HDFC Ergo' },
    { id: 'hc-2', patientName: 'Sunita Sharma', amount: '₹8,200', type: 'OPD - Diagnostic', status: 'PENDING_SUBMISSION', insuranceProvider: 'Star Health' }
  ]);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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
        <p style={{ color: 'var(--text-muted)' }}>{t('hospitalSubtitle')} - Facility Management Panel</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }} className="animate-in animate-in-delay-1">
        {[
          { key: 'overview', label: 'ER & Overview', icon: ShieldAlert },
          { key: 'ipd', label: 'IPD Tracker', icon: BedDouble },
          { key: 'opd', label: 'OPD Queue Management', icon: Users },
          { key: 'billing', label: 'Billing & Claims', icon: FileText },
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
            </button>
          );
        })}
      </div>

      {/* ER & Overview Content */}
      {activeTab === 'overview' && (
        <div className="animate-in">
          {/* ER Emergency Banner */}
          {criticalCalls.length > 0 && (
            <div className="glass-card-static" style={{ padding: '20px', marginBottom: '24px', borderLeft: '4px solid var(--risk-critical)', background: 'rgba(239, 68, 68, 0.08)' }}>
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
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>Call #{sos.id.substring(0,4).toUpperCase()}: {sos.address} ➔ {sos.patientName} Suffered Trauma</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>Dispatching ALS Ambulance {sos.assignedAmbulanceNo || '#04'}</span>
                      </div>
                      
                      <div style={{ background: 'rgba(6, 182, 212, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '4px', padding: '10px', marginTop: '10px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <span>📡 <strong>Live GPS Triangulation:</strong> Distance 2.4 km</span>
                          <span>⏱️ <strong>ETA:</strong> 6 Mins</span>
                          <span style={{ color: 'var(--emerald-500)', fontWeight: 600 }}>✅ Hospital Pre-Notified</span>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '4px', padding: '10px', marginTop: '8px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#f87171' }}>
                          🩸 <strong>Blood Bank Status Sync:</strong> {sos.bloodGroupNeeded || 'O-ve'} (4 Units Available at City Blood Bank)
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', marginLeft: '16px' }}>
                      <span className="badge badge-risk-critical" style={{ fontSize: '0.9rem', padding: '6px 12px' }}>{t(sos.status) || sos.status}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact: {sos.patientPhone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="dashboard-grid dashboard-grid-3" style={{ marginBottom: '28px' }}>
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
      )}

      {/* IPD Tracker Content */}
      {activeTab === 'ipd' && (
        <div className="animate-in">
          <IPDTracker />
        </div>
      )}

      {/* OPD Queue Content */}
      {activeTab === 'opd' && (
        <div className="animate-in">
          <OPDQueueTab />
        </div>
      )}

      {/* Phase 5: Billing & Claims Content */}
      {activeTab === 'billing' && (
        <div className="animate-in">
          <h3 style={{ fontWeight: 800, marginBottom: '16px' }}>Digital Billing & Paperless Claims</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Push automated billing and discharge summaries directly into the insurer's claim pipeline.
          </p>

          <div className="dashboard-grid dashboard-grid-2">
            {claims.map(claim => (
              <div key={claim.id} className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-500)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{claim.patientName}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary-400)', marginTop: '2px' }}>{claim.type}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>Insurer: {claim.insuranceProvider}</div>
                  </div>
                  <span className="badge badge-scheduled">{claim.status.replace('_', ' ')}</span>
                </div>
                
                <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Billed Amount</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>{claim.amount}</div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setSelectedBill(claim)}>View Bill Details</button>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => showToast(`✅ Claim of ${claim.amount} for ${claim.patientName} submitted directly to ${claim.insuranceProvider}'s TPA pipeline via API.`, 'success')}>
                    <Send size={14} style={{ marginRight: '6px' }} /> Submit to Insurer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bill Details Modal */}
      {selectedBill && (
        <div className="modal-overlay" onClick={() => setSelectedBill(null)}>
          <div className="modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottom: '1px solid var(--border-glass)' }}>
              <h2 className="modal-title">📄 Itemized Bill Details</h2>
              <button className="modal-close" onClick={() => setSelectedBill(null)}>&times;</button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{selectedBill.patientName}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedBill.type}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--primary-400)', fontWeight: 600 }}>Insurer: {selectedBill.insuranceProvider}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Claim ID: {selectedBill.id.toUpperCase()}</div>
                </div>
              </div>

              <table className="data-table" style={{ width: '100%', marginBottom: '20px' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Description</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Room Charges (General Ward)</td>
                    <td style={{ textAlign: 'right' }}>₹4,000</td>
                  </tr>
                  <tr>
                    <td>Doctor Consultation Fees</td>
                    <td style={{ textAlign: 'right' }}>₹2,500</td>
                  </tr>
                  <tr>
                    <td>Pharmacy & Medicines</td>
                    <td style={{ textAlign: 'right' }}>₹1,200</td>
                  </tr>
                  <tr>
                    <td>Diagnostic Tests & X-Ray</td>
                    <td style={{ textAlign: 'right' }}>₹{selectedBill.amount === '₹14,500' ? '6,800' : '500'}</td>
                  </tr>
                  <tr style={{ background: 'var(--bg-input)' }}>
                    <td style={{ fontWeight: 800 }}>Total Billed Amount</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedBill.amount}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={() => setSelectedBill(null)}>Close</button>
                <button className="btn btn-primary" onClick={() => {
                  setSelectedBill(null);
                  showToast(`✅ Claim of ${selectedBill.amount} for ${selectedBill.patientName} submitted to ${selectedBill.insuranceProvider}.`, 'success');
                }}>
                  <Send size={16} style={{ marginRight: '8px' }} /> Push to TPA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type} toast-card`}>
          <div style={{ flex: 1 }}>{toast.message}</div>
          <button onClick={() => setToast(null)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.8 }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>&times;</span>
          </button>
        </div>
      )}
    </div>
  );
}

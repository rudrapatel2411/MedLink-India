// MedLink India — Patient Dashboard
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, prescriptionAPI, healthRecordAPI, hospitalAPI } from '../../services/api';
import {
  Activity, Calendar, FileText, Shield, Brain, Plus,
  Clock, CheckCircle2, Pill, X, Clipboard
} from 'lucide-react';
import SymptomChecker from './SymptomChecker';
import BookAppointment from './BookAppointment';
import DocumentViewer from './DocumentViewer';
import HealthProfileEditor from './HealthProfileEditor';
import HospitalTracker from './HospitalTracker';
import MedicationReminders from './MedicationReminders';

import { useLanguage } from '../../context/LanguageContext';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  
  // Health Vault & Consent State
  const [consents, setConsents] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptRes, rxRes, hrRes, consentRes] = await Promise.all([
        appointmentAPI.getMyAppointments(),
        prescriptionAPI.getMyPrescriptions(),
        healthRecordAPI.getMyRecords(),
        healthRecordAPI.getMyConsents()
      ]);
      setAppointments(apptRes.data.data || []);
      setPrescriptions(rxRes.data.data || []);
      setHealthRecords(hrRes.data.data || []);
      setConsents(consentRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      SCHEDULED: 'badge-scheduled',
      IN_QUEUE: 'badge-in-queue',
      IN_PROGRESS: 'badge-in-progress',
      COMPLETED: 'badge-completed',
      CANCELLED: 'badge-cancelled',
    };
    return map[status] || 'badge-scheduled';
  };

  const handleConsentResponse = async (id: string, action: 'GRANT' | 'DENY') => {
    try {
      await healthRecordAPI.respondToConsent(id, { action });
      showToast(`Consent ${action === 'GRANT' ? 'granted' : 'denied'} successfully!`, 'success');
      fetchData();
    } catch (err) {
      showToast(`Failed to ${action.toLowerCase()} consent.`, 'error');
    }
  };

  if (loading) {
    return <div className="page-loader"><div className="spinner" /><span>{t('loading')}</span></div>;
  }

  const upcomingAppts = appointments.filter(a => ['SCHEDULED', 'IN_QUEUE'].includes(a.status));
  const completedAppts = appointments.filter(a => a.status === 'COMPLETED');
  const activeRx = prescriptions.filter(p => p.status === 'ACTIVE');

  const tabs = [
    { key: 'overview', label: t('overview'), icon: Activity },
    { key: 'appointments', label: t('appointments'), icon: Calendar },
    { key: 'prescriptions', label: t('prescriptions'), icon: Pill },
    { key: 'vault', label: t('healthVault'), icon: Shield },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div style={{ marginBottom: '28px' }} className="animate-in">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          {t('welcomeBack')}, <span style={{ color: 'var(--primary-400)' }}>{user?.firstName}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          {t('patientSubtitle')}
        </p>
        {user?.role === 'PATIENT' && user?.abhaId && (
          <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '100px' }}>
            <Shield size={14} style={{ color: 'var(--emerald-500)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Your ABHA ID:</span>
            <span style={{ fontWeight: 800, color: 'var(--emerald-500)', letterSpacing: '0.5px' }}>{user.abhaId}</span>
          </div>
        )}
      </div>

      {/* Quick Action Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }} className="animate-in animate-in-delay-1">
        <button className="btn btn-danger" onClick={async () => {
          try {
            await hospitalAPI.triggerSOS({
              patientName: `${user?.firstName} ${user?.lastName}`,
              patientPhone: user?.phone || '+91-9988776655',
              latitude: 28.6139,
              longitude: 77.2090,
              address: 'Connaught Place, New Delhi',
              bloodGroupNeeded: user?.patientProfile?.bloodGroup || 'O-ve',
            });
            showToast('🚨 EMERGENCY SOS DISPATCHED! Ambulance & ER Bay Notified!', 'error');
          } catch (err) {
            console.error('SOS failed:', err);
            showToast('Failed to send SOS. Please call emergency services directly.', 'error');
          }
        }}>
          {t('sosButton')}
        </button>
        <button className="btn btn-primary" onClick={() => setShowSymptomChecker(true)}>
          <Brain size={16} /> {t('aiSymptomCheck')}
        </button>
        <button className="btn btn-primary" onClick={() => setShowAppointmentModal(true)}>
          <Calendar size={18} /> {t('bookAppointment')}
        </button>
      </div>

      {/* Complete Profile Banner */}
      {user?.role === 'PATIENT' && (!user.patientProfile?.bloodGroup || !user.patientProfile?.emergencyContact) && (
        <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)', padding: '12px 20px', borderRadius: 'var(--radius-lg)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: 'var(--yellow-500)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Complete Your Health Profile</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Add blood group and emergency contacts for better care.</div>
            </div>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={() => setShowProfileEditor(true)}>Update Profile</button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="dashboard-grid dashboard-grid-4 animate-in animate-in-delay-2" style={{ marginBottom: '28px' }}>
        <div className="glass-card stat-card stat-cyan">
          <div className="stat-card-header">
            <span className="stat-card-label">{t('upcoming')}</span>
            <div className="stat-card-icon"><Calendar size={18} /></div>
          </div>
          <div className="stat-card-value">{upcomingAppts.length}</div>
        </div>
        <div className="glass-card stat-card stat-emerald">
          <div className="stat-card-header">
            <span className="stat-card-label">{t('completedVisits')}</span>
            <div className="stat-card-icon"><CheckCircle2 size={18} /></div>
          </div>
          <div className="stat-card-value">{completedAppts.length}</div>
        </div>
        <div className="glass-card stat-card stat-amber">
          <div className="stat-card-header">
            <span className="stat-card-label">{t('activeRx')}</span>
            <div className="stat-card-icon"><Pill size={18} /></div>
          </div>
          <div className="stat-card-value">{activeRx.length}</div>
        </div>
        <div className="glass-card stat-card stat-violet">
          <div className="stat-card-header">
            <span className="stat-card-label">{t('vaultRecords')}</span>
            <div className="stat-card-icon"><FileText size={18} /></div>
          </div>
          <div className="stat-card-value">{healthRecords.length}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }} className="animate-in animate-in-delay-3">
        {tabs.map(tab => {
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
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                borderBottom: activeTab === tab.key ? '2px solid var(--primary-500)' : '2px solid transparent',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Icon size={15} /> {tab.label}
            </button>
          );
        })}
        <button
          onClick={() => setActiveTab('tracker')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 18px', border: 'none', borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            background: activeTab === 'tracker' ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
            color: activeTab === 'tracker' ? 'var(--text-accent)' : 'var(--text-muted)',
            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
            borderBottom: activeTab === 'tracker' ? '2px solid var(--primary-500)' : '2px solid transparent',
            transition: 'all var(--transition-fast)'
          }}
        >
          <Activity size={15} /> Hospital Tracker
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in animate-in-delay-4">
        {activeTab === 'overview' && (
          <div className="dashboard-grid dashboard-grid-2">
            
            {/* Medication Reminders Widget */}
            <div style={{ gridColumn: '1 / -1' }}>
              <MedicationReminders prescriptions={prescriptions} />
            </div>

            {/* Upcoming Appointments */}
            <div className="glass-card-static" style={{ padding: '20px' }}>
              <div className="section-header">
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>📅 {t('upcoming')}</h3>
                </div>
              </div>
              {upcomingAppts.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state-title">{t('noUpcoming')}</p>
                  <button className="btn btn-accent btn-sm" onClick={() => setShowAppointmentModal(true)}>
                    <Plus size={14} /> {t('bookNow')}
                  </button>
                </div>
              ) : (
                upcomingAppts.slice(0, 3).map(appt => (
                  <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <Clock size={12} /> {appt.scheduledDate} at {appt.scheduledTime}
                        {appt.tokenNumber && <span> · {t('token')} #{appt.tokenNumber}</span>}
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadge(appt.status)}`}>{t(appt.status) || appt.status}</span>
                  </div>
                ))
              )}
            </div>

            {/* Active Prescriptions */}
            <div className="glass-card-static" style={{ padding: '20px' }}>
              <div className="section-header">
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>💊 {t('activeRx')}</h3>
              </div>
              {activeRx.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state-title">{t('noActiveRx')}</p>
                </div>
              ) : (
                activeRx.slice(0, 3).map(rx => (
                  <div key={rx.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{rx.diagnosis || t('prescriptions')}</div>
                      <span className="badge badge-completed">{t(rx.status) || rx.status}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Dr. {rx.doctor?.firstName} {rx.doctor?.lastName} · {rx.medicines?.length} {t('medicines')}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                      {rx.medicines?.slice(0, 3).map((med: any) => (
                        <span key={med.id} className="symptom-tag" style={{ cursor: 'default' }}>
                          {med.medicineName} {med.dosage}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 700 }}>{t('allAppointments')}</h3>
              <button className="btn btn-accent btn-sm" onClick={() => setShowAppointmentModal(true)}><Plus size={14} /> {t('bookNew')}</button>
            </div>
            <div className="glass-card-static" style={{ overflow: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('doctor')}</th>
                    <th>{t('specialization')}</th>
                    <th>{t('dateTime')}</th>
                    <th>{t('type')}</th>
                    <th>{t('token')}</th>
                    <th>{t('status')}</th>
                    <th>{t('complaint')}</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appt => (
                    <tr key={appt.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}
                      </td>
                      <td>{appt.doctor?.doctorProfile?.specialization || '—'}</td>
                      <td>{appt.scheduledDate} · {appt.scheduledTime}</td>
                      <td><span className="badge badge-scheduled">{appt.type}</span></td>
                      <td style={{ textAlign: 'center' }}>#{appt.tokenNumber || '—'}</td>
                      <td><span className={`badge ${getStatusBadge(appt.status)}`}>{t(appt.status) || appt.status.replace('_', ' ')}</span></td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{appt.chiefComplaint || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📅</div>
                  <p className="empty-state-title">{t('noUpcoming')}</p>
                  <button className="btn btn-accent btn-sm" onClick={() => setShowAppointmentModal(true)}><Plus size={14} /> {t('bookNow')}</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>{t('allPrescriptions')}</h3>
            {prescriptions.length === 0 ? (
              <div className="glass-card-static empty-state">
                <div className="empty-state-icon">💊</div>
                <p className="empty-state-title">{t('noActiveRx')}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {prescriptions.map(rx => (
                  <div key={rx.id} className="glass-card-static rx-card">
                    <div className="rx-header">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                          <Clipboard size={16} style={{ display: 'inline', marginRight: '6px' }} />
                          {rx.diagnosis || t('prescriptions')}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Dr. {rx.doctor?.firstName} {rx.doctor?.lastName}
                          {rx.doctor?.doctorProfile?.specialization && ` · ${rx.doctor.doctorProfile.specialization}`}
                          {' · '}{new Date(rx.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                      <span className={`badge ${rx.status === 'ACTIVE' ? 'badge-completed' : 'badge-cancelled'}`}>{t(rx.status) || rx.status}</span>
                    </div>
                    {rx.notes && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', fontStyle: 'italic' }}>📝 {rx.notes}</p>}
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>{t('medicines')}</div>
                    <div className="rx-medicine-row" style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <span>{t('medicineLabel')}</span><span>{t('dosage')}</span><span>{t('frequency')}</span><span>{t('duration')}</span><span>{t('instructions')}</span>
                    </div>
                    {rx.medicines?.map((med: any) => (
                      <div key={med.id} className="rx-medicine-row">
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{med.medicineName}</span>
                        <span>{med.dosage}</span>
                        <span>{med.frequency}</span>
                        <span>{med.duration}</span>
                        <span>{med.instructions || '—'}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vault' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontWeight: 700 }}>{t('abhaVault')}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('patientSubtitle')}</p>
              </div>
            </div>

            {/* Pending Consent Requests */}
            {consents.filter(c => c.status === 'PENDING').length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--risk-critical)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <Shield size={16} /> Data Access Requests
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {consents.filter(c => c.status === 'PENDING').map(consent => (
                    <div key={consent.id} className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--risk-critical)' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>Dr. {consent.requester?.firstName} {consent.requester?.lastName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Reason: {consent.purpose} · Duration: {consent.duration.replace('_', ' ')}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary-400)', marginTop: '4px', fontWeight: 600 }}>
                          Requests: {JSON.parse(consent.recordTypes || '[]').join(', ').replace(/_/g, ' ')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleConsentResponse(consent.id, 'DENY')}>Deny</button>
                        <button className="btn btn-accent btn-sm" onClick={() => handleConsentResponse(consent.id, 'GRANT')}>Grant Access</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {healthRecords.length === 0 ? (
              <div className="glass-card-static empty-state">
                <div className="empty-state-icon">📁</div>
                <p className="empty-state-title">{t('noHealthRecords')}</p>
              </div>
            ) : (
              <div className="dashboard-grid dashboard-grid-3">
                {healthRecords.map(record => (
                  <div key={record.id} className="glass-card" style={{ padding: '20px', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setSelectedRecord(record)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '1.2rem' }}>
                        {record.recordType === 'LAB_REPORT' ? '🧪' : record.recordType === 'PRESCRIPTION' ? '💊' : record.recordType === 'VACCINATION' ? '💉' : '📄'}
                      </span>
                      <span className="badge badge-scheduled">{record.recordType.replace('_', ' ')}</span>
                    </div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>{record.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{record.description || '—'}</p>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(record.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TRACKER TAB --- */}
        {activeTab === 'tracker' && (
          <div className="animate-in animate-in-delay-3">
            <HospitalTracker />
          </div>
        )}
      </div>

      {/* Appointment Booking Modal */}
      {showAppointmentModal && (
        <div className="modal-overlay" onClick={() => setShowAppointmentModal(false)}>
          <div className="modal" style={{ maxWidth: '800px', background: 'var(--bg-primary)' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottom: '1px solid var(--border-glass)' }}>
              <h2 className="modal-title">Book Consultation</h2>
              <button className="modal-close" onClick={() => setShowAppointmentModal(false)}><X size={18} /></button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', maxHeight: '70vh' }}>
              <BookAppointment onSuccess={() => {
                setShowAppointmentModal(false);
                fetchData();
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Profile Editor Modal */}
      {showProfileEditor && (
        <HealthProfileEditor onClose={() => setShowProfileEditor(false)} />
      )}

      {/* Symptom Checker Modal */}
      {showSymptomChecker && (
        <div className="modal-overlay" onClick={() => setShowSymptomChecker(false)}>
          <div className="modal" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{t('aiSymptomCheck')}</h2>
              <button className="modal-close" onClick={() => setShowSymptomChecker(false)}><X size={18} /></button>
            </div>
            <SymptomChecker />
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showBooking && (
        <div className="modal-overlay" onClick={() => setShowBooking(false)}>
          <div className="modal" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{t('bookAppointment')}</h2>
              <button className="modal-close" onClick={() => setShowBooking(false)}><X size={18} /></button>
            </div>
            <BookAppointment onSuccess={() => { 
              setShowBooking(false); 
              fetchData(); 
              showToast('Appointment booked successfully!', 'success');
            }} />
          </div>
        </div>
      )}

      {/* Vault Document Viewer Modal */}
      {selectedRecord && (
        <DocumentViewer 
          record={selectedRecord} 
          user={user} 
          onClose={() => setSelectedRecord(null)} 
        />
      )}

      {/* Toast Notification Overlay */}
      {toast && (
        <div className={`toast toast-${toast.type} toast-card`}>
          <div style={{ flex: 1 }}>{toast.message}</div>
          <button onClick={() => setToast(null)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.8 }}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

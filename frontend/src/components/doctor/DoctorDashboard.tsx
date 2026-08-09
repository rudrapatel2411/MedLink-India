// MedLink India — Doctor Dashboard (OPD Consult Desk)
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, prescriptionAPI } from '../../services/api';
import {
  Users, Calendar, Stethoscope, Activity,
  CheckCircle2, Play, X, Pill
} from 'lucide-react';
import CreatePrescription from './CreatePrescription';

import { useLanguage } from '../../context/LanguageContext';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [opdQueue, setOpdQueue] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('opd');
  const [loading, setLoading] = useState(true);
  const [showRxModal, setShowRxModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptRes, rxRes] = await Promise.all([
        appointmentAPI.getMyAppointments(),
        prescriptionAPI.getMyPrescriptions(),
      ]);
      const allAppts = apptRes.data.data || [];
      setAppointments(allAppts);
      setPrescriptions(rxRes.data.data || []);

      // Build today's OPD queue
      const today = new Date().toISOString().split('T')[0];
      const todayQueue = allAppts.filter((a: any) =>
        a.scheduledDate === today && ['SCHEDULED', 'IN_QUEUE', 'IN_PROGRESS'].includes(a.status)
      ).sort((a: any, b: any) => (a.tokenNumber || 0) - (b.tokenNumber || 0));
      setOpdQueue(todayQueue);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (apptId: string, status: string) => {
    try {
      await appointmentAPI.updateStatus(apptId, { status });
      fetchData();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const openPrescription = (appt: any) => {
    setSelectedPatient(appt.patient);
    setSelectedAppt(appt);
    setShowRxModal(true);
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      SCHEDULED: 'badge-scheduled', IN_QUEUE: 'badge-in-queue',
      IN_PROGRESS: 'badge-in-progress', COMPLETED: 'badge-completed', CANCELLED: 'badge-cancelled',
    };
    return map[status] || 'badge-scheduled';
  };

  if (loading) {
    return <div className="page-loader"><div className="spinner" /><span>{t('loadingClinic')}</span></div>;
  }

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.scheduledDate === today);
  const completedToday = todayAppts.filter(a => a.status === 'COMPLETED').length;
  const inProgress = opdQueue.find(a => a.status === 'IN_PROGRESS');

  const greeting = new Date().getHours() < 12 ? t('goodMorning') : new Date().getHours() < 17 ? t('goodAfternoon') : t('goodEvening');

  const tabs = [
    { key: 'opd', label: t('opdQueue'), icon: Users },
    { key: 'appointments', label: t('allAppointments'), icon: Calendar },
    { key: 'prescriptions', label: t('prescriptions'), icon: Pill },
  ];

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: '28px' }} className="animate-in">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          {greeting}, <span style={{ color: 'var(--primary-400)' }}>Dr. {user?.lastName}</span> 👨‍⚕️
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          {user?.doctorProfile?.specialization || 'Doctor'} · {user?.doctorProfile?.hospitalAffiliation || ''}
        </p>
      </div>

      {/* Stats */}
      <div className="dashboard-grid dashboard-grid-4 animate-in animate-in-delay-1" style={{ marginBottom: '28px' }}>
        <div className="glass-card stat-card stat-cyan">
          <div className="stat-card-header">
            <span className="stat-card-label">{t('todaysQueue')}</span>
            <div className="stat-card-icon"><Users size={18} /></div>
          </div>
          <div className="stat-card-value">{opdQueue.length}</div>
        </div>
        <div className="glass-card stat-card stat-emerald">
          <div className="stat-card-header">
            <span className="stat-card-label">{t('completedVisits')}</span>
            <div className="stat-card-icon"><CheckCircle2 size={18} /></div>
          </div>
          <div className="stat-card-value">{completedToday}</div>
        </div>
        <div className="glass-card stat-card stat-amber">
          <div className="stat-card-header">
            <span className="stat-card-label">{t('totalConsultations')}</span>
            <div className="stat-card-icon"><Stethoscope size={18} /></div>
          </div>
          <div className="stat-card-value">{user?.doctorProfile?.totalConsultations || 0}</div>
        </div>
        <div className="glass-card stat-card stat-violet">
          <div className="stat-card-header">
            <span className="stat-card-label">{t('rating')}</span>
            <div className="stat-card-icon"><Activity size={18} /></div>
          </div>
          <div className="stat-card-value">⭐ {user?.doctorProfile?.rating || '—'}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }} className="animate-in animate-in-delay-2">
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
              {tab.key === 'opd' && opdQueue.length > 0 && (
                <span style={{ background: 'var(--primary-500)', color: 'white', borderRadius: 'var(--radius-full)', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 800 }}>
                  {opdQueue.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-in animate-in-delay-3">
        {activeTab === 'opd' && (
          <div>
            {/* Current Patient */}
            {inProgress && (
              <div className="glass-card-static" style={{ padding: '20px', marginBottom: '20px', borderLeft: '4px solid var(--primary-500)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span className="badge badge-in-progress">🔵 {t('inProgressConsult')}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('token')} #{inProgress.tokenNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {inProgress.patient?.firstName} {inProgress.patient?.lastName}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {inProgress.chiefComplaint || '—'}
                    </p>
                    {inProgress.patient?.patientProfile && (
                      <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {inProgress.patient.patientProfile.bloodGroup && <span>🩸 {inProgress.patient.patientProfile.bloodGroup}</span>}
                        {inProgress.patient.patientProfile.gender && <span>👤 {inProgress.patient.patientProfile.gender}</span>}
                        {inProgress.patient.patientProfile.dateOfBirth && <span>🎂 {inProgress.patient.patientProfile.dateOfBirth}</span>}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => openPrescription(inProgress)}>
                      <Pill size={14} /> {t('writeRx')}
                    </button>
                    <button className="btn btn-accent btn-sm" onClick={() => handleStatusUpdate(inProgress.id, 'COMPLETED')}>
                      <CheckCircle2 size={14} /> {t('completeConsultation')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Queue List */}
            <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>📋 {t('todaysQueue')}</h3>
            {opdQueue.filter(a => a.status !== 'IN_PROGRESS').length === 0 && !inProgress ? (
              <div className="glass-card-static empty-state">
                <div className="empty-state-icon">👨‍⚕️</div>
                <p className="empty-state-title">{t('noPatientsInQueue')}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {opdQueue.filter(a => a.status !== 'IN_PROGRESS').map(appt => (
                  <div key={appt.id} className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                        background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, color: 'var(--primary-400)', fontSize: '0.9rem'
                      }}>
                        #{appt.tokenNumber}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{appt.patient?.firstName} {appt.patient?.lastName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {appt.scheduledTime} · {appt.chiefComplaint?.substring(0, 50) || '—'}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span className={`badge ${getStatusBadge(appt.status)}`}>{t(appt.status) || appt.status.replace('_', ' ')}</span>
                      {appt.status === 'SCHEDULED' && (
                        <button className="btn btn-ghost btn-sm" onClick={() => handleStatusUpdate(appt.id, 'IN_QUEUE')}>
                          {t('IN_QUEUE')}
                        </button>
                      )}
                      {appt.status === 'IN_QUEUE' && !inProgress && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleStatusUpdate(appt.id, 'IN_PROGRESS')}>
                          <Play size={12} /> {t('startConsultation')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>{t('allAppointments')}</h3>
            <div className="glass-card-static" style={{ overflow: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('patientName')}</th>
                    <th>{t('dateTime')}</th>
                    <th>{t('token')}</th>
                    <th>{t('complaint')}</th>
                    <th>{t('status')}</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appt => (
                    <tr key={appt.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {appt.patient?.firstName} {appt.patient?.lastName}
                      </td>
                      <td>{appt.scheduledDate} · {appt.scheduledTime}</td>
                      <td style={{ textAlign: 'center' }}>#{appt.tokenNumber || '—'}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {appt.chiefComplaint || '—'}
                      </td>
                      <td><span className={`badge ${getStatusBadge(appt.status)}`}>{t(appt.status) || appt.status.replace('_', ' ')}</span></td>
                      <td>
                        {appt.status === 'IN_PROGRESS' && (
                          <button className="btn btn-primary btn-sm" onClick={() => openPrescription(appt)}>
                            <Pill size={12} /> {t('writeRx')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📅</div>
                  <p className="empty-state-title">{t('noPatientsInQueue')}</p>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {prescriptions.map(rx => (
                  <div key={rx.id} className="glass-card-static rx-card">
                    <div className="rx-header">
                      <div>
                        <div style={{ fontWeight: 700 }}>
                          {rx.patient?.firstName} {rx.patient?.lastName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {rx.diagnosis || '—'} · {new Date(rx.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                      <span className={`badge ${rx.status === 'ACTIVE' ? 'badge-completed' : 'badge-cancelled'}`}>{t(rx.status) || rx.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {rx.medicines?.map((m: any) => (
                        <span key={m.id} className="symptom-tag" style={{ cursor: 'default' }}>
                          {m.medicineName} {m.dosage} ({m.frequency})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Prescription Modal */}
      {showRxModal && selectedPatient && (
        <div className="modal-overlay" onClick={() => setShowRxModal(false)}>
          <div className="modal" style={{ maxWidth: '700px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">💊 {t('writeRx')}</h2>
              <button className="modal-close" onClick={() => setShowRxModal(false)}><X size={18} /></button>
            </div>
            <CreatePrescription
              patient={selectedPatient}
              appointmentId={selectedAppt?.id}
              onSuccess={() => { setShowRxModal(false); fetchData(); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

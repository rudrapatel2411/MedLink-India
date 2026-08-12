// MedLink India — Doctor Dashboard (OPD Consult Desk)
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, prescriptionAPI, healthRecordAPI } from '../../services/api';
import {
  Users, Calendar, Stethoscope, Activity,
  CheckCircle2, Play, X, Pill, Shield, Search, Brain
} from 'lucide-react';
import CreatePrescription from './CreatePrescription';
import DocumentViewer from '../patient/DocumentViewer';
import AICoPilotDesk from './AICoPilotDesk';

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
  const [selectedPatient] = useState<any>(null);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [showCoPilot, setShowCoPilot] = useState(false);

  const openPrescription = (appt: any) => {
    // Legacy support for direct prescription
    setSelectedAppt(appt);
    setShowRxModal(true);
  };

  // Demo Appt Generator
  const openDemoCoPilot = () => {
    const demoAppt = {
      id: 'demo-123',
      tokenNumber: 99,
      chiefComplaint: 'Fever and severe cough for 3 days',
      patient: {
        id: 'patient-456',
        abhaId: '91-8829-1029-44',
        firstName: 'Rahul',
        lastName: 'Sharma',
        patientProfile: {
          gender: 'Male',
          dateOfBirth: '1990-05-12',
          bloodGroup: 'B+',
          height: 175,
          weight: 78,
          allergies: 'Penicillin, Peanuts',
          chronicConditions: 'Type-2 Diabetes'
        }
      }
    };
    setSelectedAppt(demoAppt);
    setShowCoPilot(true);
  };

  // Consent & Vault State
  const [consents, setConsents] = useState<any[]>([]);
  const [patientIdSearch, setPatientIdSearch] = useState('');
  const [patientRecords, setPatientRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptRes, rxRes, consentRes] = await Promise.all([
        appointmentAPI.getMyAppointments(),
        prescriptionAPI.getMyPrescriptions(),
        healthRecordAPI.getMyConsents(),
      ]);
      const allAppts = apptRes.data.data || [];
      setAppointments(allAppts);
      setPrescriptions(rxRes.data.data || []);
      setConsents(consentRes.data.data || []);

      // Build today's OPD queue
      const today = new Date().toISOString().split('T')[0];
      const todayQueue = allAppts.filter((a: any) =>
        a.scheduledDate === today && ['SCHEDULED', 'IN_QUEUE', 'IN_PROGRESS'].includes(a.status)
      ).sort((a: any, b: any) => (a.tokenNumber || 0) - (b.tokenNumber || 0));
      setOpdQueue(todayQueue);
    } catch (err) {
      console.error('Failed to fetch:', err);
      // Fallback mock data for demo/bypass-login mode
      const today = new Date().toISOString().split('T')[0];
      const mockAppts = [
        {
          id: 'mock-1',
          patientId: 'patient-1',
          doctorId: 'doctor-1',
          scheduledDate: today,
          scheduledTime: '10:30 AM',
          type: 'OPD',
          status: 'IN_QUEUE',
          tokenNumber: 4,
          chiefComplaint: 'Chest tightness, palpitations & mild dizziness',
          patient: {
            id: 'patient-1',
            firstName: 'Rahul',
            lastName: 'Kumar',
            abhaId: 'ABHA-91-1234-5678',
            patientProfile: {
              gender: 'MALE',
              dateOfBirth: '1990-05-15',
              bloodGroup: 'B+',
              allergies: 'Penicillin, Sulfa Drugs',
              chronicConditions: 'Hypertension, Type 2 Diabetes'
            }
          }
        },
        {
          id: 'mock-2',
          patientId: 'patient-2',
          doctorId: 'doctor-1',
          scheduledDate: today,
          scheduledTime: '11:15 AM',
          type: 'OPD',
          status: 'IN_QUEUE',
          tokenNumber: 5,
          chiefComplaint: 'High Fever, joint pain, and severe headache',
          patient: {
            id: 'patient-2',
            firstName: 'Ananya',
            lastName: 'Sharma',
            abhaId: 'ABHA-91-9876-5432',
            patientProfile: {
              gender: 'FEMALE',
              dateOfBirth: '1994-08-22',
              bloodGroup: 'O+',
              allergies: 'None',
              chronicConditions: 'None'
            }
          }
        },
        {
          id: 'mock-3',
          patientId: 'patient-3',
          doctorId: 'doctor-1',
          scheduledDate: today,
          scheduledTime: '12:00 PM',
          type: 'OPD',
          status: 'IN_QUEUE',
          tokenNumber: 6,
          chiefComplaint: 'Right knee joint stiffness and pain',
          patient: {
            id: 'patient-3',
            firstName: 'Vikas',
            lastName: 'Malhotra',
            abhaId: 'ABHA-91-5544-3322',
            patientProfile: {
              gender: 'MALE',
              dateOfBirth: '1982-11-04',
              bloodGroup: 'AB+',
              allergies: 'NSAID',
              chronicConditions: 'Asthma'
            }
          }
        }
      ];
      setAppointments(mockAppts);
      setOpdQueue(mockAppts);
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

  const startConsultation = (appt: any) => {
    handleStatusUpdate(appt.id, 'IN_PROGRESS');
    setSelectedAppt(appt);
    setShowCoPilot(true);
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      SCHEDULED: 'badge-scheduled', IN_QUEUE: 'badge-in-queue',
      IN_PROGRESS: 'badge-in-progress', COMPLETED: 'badge-completed', CANCELLED: 'badge-cancelled',
    };
    return map[status] || 'badge-scheduled';
  };

  const getDifferentialDiagnosis = (complaint: string) => {
    if (!complaint) return ['Viral Pharyngitis', 'Allergic Rhinitis'];
    const lower = complaint.toLowerCase();
    if (lower.includes('fever') && lower.includes('cough')) return ['Viral URI', 'Bronchitis', 'COVID-19'];
    if (lower.includes('stomach') || lower.includes('pain')) return ['Acute Gastritis', 'Appendicitis', 'Food Poisoning'];
    if (lower.includes('headache')) return ['Tension Headache', 'Migraine', 'Sinusitis'];
    return ['Viral Syndrome', 'Fatigue', 'Dehydration'];
  };

  const handleRequestConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestError('');
    setRequestSuccess('');
    try {
      await healthRecordAPI.requestConsent({
        patientId: patientIdSearch,
        purpose: 'Comprehensive diagnostic review',
        recordTypes: ['LAB_REPORT', 'PRESCRIPTION', 'DISCHARGE_SUMMARY', 'VACCINATION'],
        duration: '1_DAY'
      });
      setRequestSuccess('Consent request sent successfully!');
      fetchData();
    } catch (err: any) {
      setRequestError(err.response?.data?.message || 'Failed to request consent. Check Patient ID.');
    }
  };

  const loadPatientRecords = async (patientId: string) => {
    try {
      const res = await healthRecordAPI.getPatientRecords(patientId);
      setPatientRecords(res.data.data || []);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to fetch records. Consent might be expired.');
    }
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
    { key: 'vault', label: 'Patient Vault Access', icon: Shield },
  ];

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="animate-in">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {greeting}, <span style={{ color: 'var(--primary-400)' }}>Dr. {user?.lastName}</span> 👨‍⚕️
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            {user?.doctorProfile?.specialization || 'Doctor'} · {user?.doctorProfile?.hospitalAffiliation || ''}
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={openDemoCoPilot}
          style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 14px rgba(6, 182, 212, 0.4)' }}
        >
          <Brain size={20} style={{ marginRight: '8px' }} />
          Test AI Co-Pilot Desk
        </button>
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
                    
                    {/* Differential Diagnosis Assist */}
                    <div style={{ marginTop: '14px', background: 'rgba(6, 182, 212, 0.08)', padding: '10px 14px', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--primary-400)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-400)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        <Brain size={14} /> AI Differential Diagnosis Assist
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {getDifferentialDiagnosis(inProgress.chiefComplaint).map((dx, idx) => (
                          <span key={idx} style={{ background: 'var(--bg-input)', fontSize: '0.8rem', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                            {dx}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => { setSelectedAppt(inProgress); setShowCoPilot(true); }}>
                      <Stethoscope size={14} /> Open AI Co-Pilot
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
                <button className="btn btn-primary" onClick={openDemoCoPilot} style={{ marginTop: '16px' }}>
                  <Stethoscope size={16} /> Open Demo AI Co-Pilot
                </button>
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
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-primary btn-sm" onClick={() => startConsultation(appt)} style={{ background: 'var(--primary-500)' }}>
                            <Brain size={14} /> AI Co-Pilot
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleStatusUpdate(appt.id, 'IN_PROGRESS')}>
                            <Play size={14} /> Normal
                          </button>
                        </div>
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
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-primary btn-sm" onClick={() => { setSelectedAppt(appt); setShowCoPilot(true); }}>
                              <Brain size={12} /> AI Co-Pilot
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => openPrescription(appt)}>
                              <Pill size={12} /> Rx
                            </button>
                          </div>
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

        {activeTab === 'vault' && (
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={20} /> Request Vault Access</h3>
            
            <div className="glass-card" style={{ padding: '20px', marginBottom: '30px' }}>
              <form onSubmit={handleRequestConsent} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label>Patient ID (ABHA)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter Patient ID (e.g. cmr3r5...)"
                    value={patientIdSearch}
                    onChange={e => setPatientIdSearch(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
                  <Search size={16} /> Request Consent
                </button>
              </form>
              {requestError && <div style={{ color: 'var(--risk-critical)', fontSize: '0.85rem', marginTop: '8px' }}>{requestError}</div>}
              {requestSuccess && <div style={{ color: 'var(--emerald-500)', fontSize: '0.85rem', marginTop: '8px' }}>{requestSuccess}</div>}
            </div>

            <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>My Active Consents</h3>
            <div className="dashboard-grid dashboard-grid-2">
              {consents.length === 0 ? (
                <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                  <p className="empty-state-title">No consent requests.</p>
                </div>
              ) : (
                consents.map(consent => (
                  <div key={consent.id} className="glass-card-static" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{consent.patient?.firstName} {consent.patient?.lastName}</div>
                      <span className={`badge ${consent.status === 'GRANTED' ? 'badge-completed' : consent.status === 'PENDING' ? 'badge-in-progress' : 'badge-cancelled'}`}>
                        {consent.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '12px' }}>
                      Patient ABHA ID: {consent.patient?.abhaId || consent.patientId.substring(0,8)}
                    </div>
                    {consent.status === 'GRANTED' && (
                      <button className="btn btn-accent btn-sm" onClick={() => loadPatientRecords(consent.patientId)} style={{ width: '100%' }}>
                        View Health Records
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {patientRecords.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>Health Records (Granted Access)</h3>
                <div className="dashboard-grid dashboard-grid-3">
                  {patientRecords.map(record => (
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
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vault Document Viewer Modal (Shared with Patient) */}
      {selectedRecord && (
        <DocumentViewer 
          record={selectedRecord} 
          user={selectedPatient || { firstName: selectedRecord.patientName }} 
          onClose={() => setSelectedRecord(null)} 
        />
      )}


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

      {/* AI Co-Pilot Desk */}
      {showCoPilot && selectedAppt && (
        <AICoPilotDesk 
          appointment={selectedAppt}
          onClose={() => setShowCoPilot(false)}
          onComplete={() => {
            setShowCoPilot(false);
            handleStatusUpdate(selectedAppt.id, 'COMPLETED');
            fetchData();
          }}
        />
      )}
    </div>
  );
}

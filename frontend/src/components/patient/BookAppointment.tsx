// MedLink India — Book Appointment Component
import { useState } from 'react';
import { appointmentAPI } from '../../services/api';
import { Calendar, Clock, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  onSuccess: () => void;
}

export default function BookAppointment({ onSuccess }: Props) {
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Smart Booking Workflow State
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedDisease, setSelectedDisease] = useState('');
  
  const [form, setForm] = useState({
    doctorId: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '10:00',
    type: 'OPD',
    chiefComplaint: '',
  });

  const DISEASE_SPECIALTY_MAP: Record<string, { specialty: string, label: string, emoji: string }> = {
    'chest_pain': { specialty: 'Cardiologist', label: 'Chest Pain / Heart Issue', emoji: '🫀' },
    'fever_cold': { specialty: 'General Physician', label: 'Fever / Cough / Cold', emoji: '🤒' },
    'stomach_pain': { specialty: 'Gastroenterologist', label: 'Stomach Pain / Acidity', emoji: '🤰' },
    'headache': { specialty: 'Neurologist', label: 'Severe Headache / Dizziness', emoji: '🧠' },
    'skin_rash': { specialty: 'Dermatologist', label: 'Skin Rash / Allergy', emoji: '🩸' },
    'joint_pain': { specialty: 'Orthopedic', label: 'Joint Pain / Back Ache', emoji: '🦴' },
    'eye_issue': { specialty: 'Ophthalmologist', label: 'Eye Irritation / Vision', emoji: '👁️' },
    'other': { specialty: '', label: 'Other Issues', emoji: '❓' }
  };

  const handleDiseaseSelect = async () => {
    if (!selectedDisease) {
      setError('Please select your symptoms/disease to find the right doctor.');
      return;
    }
    setError('');
    setStep(2);
    setFetchingDoctors(true);
    
    // Auto-fill chief complaint based on selection
    setForm(prev => ({
      ...prev,
      chiefComplaint: DISEASE_SPECIALTY_MAP[selectedDisease].label
    }));

    try {
      const specialty = DISEASE_SPECIALTY_MAP[selectedDisease].specialty;
      const res = await appointmentAPI.getAvailableDoctors(specialty ? { specialization: specialty } : undefined);
      setDoctors(res.data.data || []);
      
      // If there's only 1 doctor, auto-select them
      if (res.data.data?.length === 1) {
        setForm(prev => ({ ...prev, doctorId: res.data.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load doctors:', err);
      setError('Failed to find doctors for this specialty.');
    } finally {
      setFetchingDoctors(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.doctorId) {
      setError('Please select a doctor.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await appointmentAPI.create(form);
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
        <h3 style={{ fontWeight: 700, color: 'var(--risk-low)' }}>{t('bookingSuccess')}</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>{t('tokenNotice')}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* ──────────────── STEP 1: Symptom Triage ──────────────── */}
      {step === 1 && (
        <div className="animate-in">
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>Step 1: What are your symptoms?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>We will find the right specialist for you.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {Object.entries(DISEASE_SPECIALTY_MAP).map(([key, data]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDisease(key)}
                style={{
                  padding: '14px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: selectedDisease === key ? '2px solid var(--primary-500)' : '1px solid var(--border-glass)',
                  background: selectedDisease === key ? 'rgba(6, 182, 212, 0.08)' : 'var(--bg-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  color: 'var(--text-primary)'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{data.emoji}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>{data.label}</span>
              </button>
            ))}
          </div>
          
          {error && <div style={{ color: 'var(--risk-critical)', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</div>}
          
          <button onClick={handleDiseaseSelect} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Find Doctors <Send size={16} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      )}


      {/* ──────────────── STEP 2: Doctor Selection & Booking ──────────────── */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="animate-in animate-in-slide" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Step 2: Choose your Doctor</h3>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>
              ← Back
            </button>
          </div>

          <div className="glass-card-static" style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>✅</span>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recommended Specialty</div>
              <div style={{ fontWeight: 700, color: 'var(--emerald-400)', fontSize: '0.9rem' }}>{DISEASE_SPECIALTY_MAP[selectedDisease]?.specialty || 'General Practitioner'}</div>
            </div>
          </div>

          {/* Doctor Selection */}
          <div className="input-group">
            <label>{t('selectDoctor')}</label>
            {fetchingDoctors ? (
              <div style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('loading')}</div>
            ) : doctors.length === 0 ? (
              <div style={{ padding: '12px', color: 'var(--risk-high)', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-sm)' }}>
                No {DISEASE_SPECIALTY_MAP[selectedDisease]?.specialty} found. Please go back and select 'Other Issues' to see all doctors.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {doctors.map(doc => (
                  <div 
                    key={doc.id} 
                    onClick={() => setForm({ ...form, doctorId: doc.id })}
                    className="glass-card"
                    style={{ 
                      padding: '14px', 
                      display: 'flex', 
                      gap: '12px', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      border: form.doctorId === doc.id ? '2px solid var(--primary-500)' : '1px solid var(--border-glass)',
                      background: form.doctorId === doc.id ? 'rgba(6, 182, 212, 0.05)' : 'transparent'
                    }}
                  >
                    <div style={{
                      width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, var(--primary-600), var(--accent-500))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, color: 'white', fontSize: '0.85rem'
                    }}>
                      {doc.firstName[0]}{doc.lastName[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dr. {doc.firstName} {doc.lastName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {doc.doctorProfile?.specialization} · {doc.doctorProfile?.experience} yrs · ⭐ {doc.doctorProfile?.rating}
                      </div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontWeight: 800, color: 'var(--accent-400)' }}>
                      ₹{doc.doctorProfile?.consultationFee}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="input-group">
              <label><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />{t('appointmentDate')}</label>
              <input
                type="date"
                className="input"
                value={form.scheduledDate}
                onChange={e => setForm({ ...form, scheduledDate: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />{t('appointmentTime')}</label>
              <input
                type="time"
                className="input"
                value={form.scheduledTime}
                onChange={e => setForm({ ...form, scheduledTime: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Appointment Type */}
          <div className="input-group">
            <label>{t('type')}</label>
            <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="OPD">🏥 OPD Visit</option>
              <option value="TELECONSULT">💻 Teleconsultation</option>
              <option value="HOME_VISIT">🏠 Home Visit</option>
              <option value="FOLLOW_UP">🔁 Follow-up</option>
            </select>
          </div>

          {/* Chief Complaint */}
          <div className="input-group">
            <label>{t('chiefComplaintLabel')}</label>
            <textarea
              className="input"
              placeholder="Describe your symptoms or reason for visit..."
              value={form.chiefComplaint}
              onChange={e => setForm({ ...form, chiefComplaint: e.target.value })}
              rows={2}
            />
          </div>

          {error && <div style={{ color: 'var(--risk-critical)', fontSize: '0.85rem' }}>{error}</div>}

          <button type="submit" className="btn btn-accent btn-lg" disabled={loading || !form.doctorId} style={{ width: '100%' }}>
            {loading ? <div className="spinner" /> : <><Send size={16} /> {t('bookAppointmentBtn')}</>}
          </button>
        </form>
      )}
    </div>
  );
}

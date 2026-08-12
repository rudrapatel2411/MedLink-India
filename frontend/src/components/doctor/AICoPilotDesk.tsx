import { useState } from 'react';
import { Brain, Activity, HeartPulse, Video, X, AlertTriangle } from 'lucide-react';
import TeleconsultationView from './TeleconsultationView';
import CreatePrescription from './CreatePrescription';

interface Props {
  appointment: any;
  onClose: () => void;
  onComplete: () => void;
}

export default function AICoPilotDesk({ appointment, onClose, onComplete }: Props) {
  const patient = appointment.patient;
  const profile = patient?.patientProfile;
  
  const [showTeleconsult, setShowTeleconsult] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [symptomsInput, setSymptomsInput] = useState(appointment.chiefComplaint || '');

  // Risk calculation mock
  const determineRisk = () => {
    if (profile?.chronicConditions?.toLowerCase().includes('diabetes')) return { level: 'High', color: 'var(--rose-500)' };
    if (profile?.bloodGroup) return { level: 'Moderate', color: 'var(--amber-500)' };
    return { level: 'Low', color: 'var(--emerald-500)' };
  };
  const risk = determineRisk();

  const handleRunAI = () => {
    if (!symptomsInput.trim()) return;
    setAiLoading(true);
    // Simulate AI processing delay
    setTimeout(() => {
      // Basic mock rules based on symptoms
      let conditions = ['Viral Infection', 'Seasonal Flu'];
      let tests = ['Complete Blood Count (CBC)'];
      let warnings = ['Monitor temperature closely'];

      if (symptomsInput.toLowerCase().includes('fever') || symptomsInput.toLowerCase().includes('cough')) {
        conditions = ['Upper Respiratory Tract Infection', 'Influenza'];
        tests = ['CBC', 'Chest X-Ray'];
        warnings = ['High contagiousness. Advise isolation.'];
      }
      if (profile?.chronicConditions?.toLowerCase().includes('diabetes')) {
        warnings.push('Patient is diabetic. Avoid high-sugar syrups.');
        tests.push('HbA1c', 'Fasting Blood Sugar');
      }
      if (profile?.allergies) {
        warnings.push(`KNOWN ALLERGY: ${profile.allergies}. Cross-check prescriptions!`);
      }

      setAiSuggestions({ conditions, tests, warnings });
      setAiLoading(false);
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'var(--bg-primary)', zIndex: 9000, display: 'flex', flexDirection: 'column'
    }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{patient.firstName} {patient.lastName}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({profile?.gender?.charAt(0) || 'U'}, {profile?.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : '?'})</span>
          </div>
          <div style={{ padding: '4px 10px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--primary-500)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>
            ABHA: {patient.abhaId || patient.id.substring(0,8).toUpperCase()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: `${risk.color}15`, color: risk.color, borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, border: `1px solid ${risk.color}40` }}>
            <Activity size={12} /> {risk.level} Risk
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-primary btn-sm" onClick={() => setShowTeleconsult(true)}>
            <Video size={16} /> Teleconsult
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} /> Close
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel: Vitals & AI Co-Pilot */}
        <div style={{ width: '400px', borderRight: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          
          {/* Vitals History */}
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-glass)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HeartPulse size={16} /> Vitals & Profile
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Blood Group</div>
                <div style={{ fontWeight: 700, color: 'var(--rose-500)' }}>{profile?.bloodGroup || 'Unknown'}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Height / Weight</div>
                <div style={{ fontWeight: 700 }}>{profile?.height || '--'} cm / {profile?.weight || '--'} kg</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>KNOWN ALLERGIES</div>
                <div style={{ fontWeight: 700, color: 'var(--risk-critical)', fontSize: '0.9rem' }}>
                  {profile?.allergies || 'None recorded'}
                </div>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CHRONIC CONDITIONS</div>
                <div style={{ fontWeight: 700, color: 'var(--amber-600)', fontSize: '0.9rem' }}>
                  {profile?.chronicConditions || 'None recorded'}
                </div>
              </div>
            </div>
          </div>

          {/* AI Diagnostic Co-Pilot */}
          <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Brain size={16} /> AI Differential Diagnosis
            </h3>
            
            <div style={{ marginBottom: '12px' }}>
              <textarea 
                className="input" 
                placeholder="Enter symptoms or clinical observations..." 
                rows={3}
                value={symptomsInput}
                onChange={e => setSymptomsInput(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleRunAI} disabled={aiLoading || !symptomsInput.trim()} style={{ width: '100%', marginBottom: '20px' }}>
              {aiLoading ? <div className="spinner" /> : <><Brain size={14}/> Run AI Analysis</>}
            </button>

            {aiSuggestions && (
              <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--primary-500)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>POSSIBLE CONDITIONS</div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {aiSuggestions.conditions.map((c: string, i: number) => <li key={i}>{c}</li>)}
                  </ul>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--emerald-500)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>RECOMMENDED TESTS</div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {aiSuggestions.tests.map((t: string, i: number) => <li key={i}>{t}</li>)}
                  </ul>
                </div>

                {aiSuggestions.warnings.length > 0 && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--risk-critical)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={12}/> CLINICAL WARNINGS
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {aiSuggestions.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Prescription Engine */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: 'var(--bg-secondary)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-primary)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-glass)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Write Prescription</h2>
            <CreatePrescription 
              patient={patient}
              appointmentId={appointment.id}
              initialDiagnosis={aiSuggestions?.conditions?.[0] || appointment.chiefComplaint || ''}
              onSuccess={onComplete}
            />
          </div>
        </div>
      </div>

      {/* Teleconsultation Overlay */}
      {showTeleconsult && (
        <TeleconsultationView patientName={`${patient.firstName} ${patient.lastName}`} onEndCall={() => setShowTeleconsult(false)} />
      )}
    </div>
  );
}

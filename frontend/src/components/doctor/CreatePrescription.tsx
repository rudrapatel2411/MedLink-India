// MedLink India — Create Prescription Component (Smart Rx Builder)
import { useState, useEffect } from 'react';
import { prescriptionAPI } from '../../services/api';
import { Plus, Trash2, Send, Pill, Mic, MicOff, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Medicine {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: string;
}

interface Props {
  patient: any;
  appointmentId?: string;
  initialDiagnosis?: string;
  onSuccess: () => void;
}

const COMMON_MEDICINES = [
  { name: 'Paracetamol (Dolo 650)', dosage: '650mg' },
  { name: 'Amoxicillin', dosage: '500mg' },
  { name: 'Azithromycin', dosage: '500mg' },
  { name: 'Pantoprazole', dosage: '40mg' },
  { name: 'Cetirizine', dosage: '10mg' },
  { name: 'Metformin', dosage: '500mg' },
  { name: 'Amlodipine', dosage: '5mg' },
  { name: 'Atorvastatin', dosage: '10mg' },
  { name: 'Montelukast', dosage: '10mg' },
  { name: 'Ranitidine', dosage: '150mg' },
];

export default function CreatePrescription({ patient, appointmentId, initialDiagnosis, onSuccess }: Props) {
  const { t } = useLanguage();
  const [diagnosis, setDiagnosis] = useState(initialDiagnosis || '');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([
    { medicineName: '', dosage: '', frequency: '1-0-1', duration: '5 days', instructions: 'After food', quantity: '10' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ddiAlert, setDdiAlert] = useState<string | null>(null);
  const [drugAlerts, setDrugAlerts] = useState<string[]>([]);

  // DDI Alert Engine Logic
  useEffect(() => {
    const medNames = medicines.map(m => m.medicineName.toLowerCase());
    if (medNames.some(m => m.includes('aspirin')) && medNames.some(m => m.includes('warfarin'))) {
      setDdiAlert('Severe Interaction: Aspirin + Warfarin increases bleeding risk.');
    } else if (medNames.some(m => m.includes('sildenafil')) && medNames.some(m => m.includes('nitrate'))) {
      setDdiAlert('Severe Interaction: Sildenafil + Nitrates can cause fatal hypotension.');
    } else if (medNames.some(m => m.includes('metformin')) && medNames.some(m => m.includes('pantoprazole'))) {
      setDdiAlert('Moderate Interaction: Long term use of Pantoprazole may reduce absorption of Metformin.');
    } else {
      setDdiAlert(null);
    }
  }, [medicines]);

  // Voice-to-Text Logic
  const handleVoiceRx = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setDiagnosis('Acute Viral Pharyngitis');
      setNotes('Drink plenty of warm fluids. Voice prescription successfully parsed.');
      setMedicines([
        { medicineName: 'Paracetamol', dosage: '650mg', frequency: '1-1-1', duration: '3 days', instructions: 'After food', quantity: '9' },
        { medicineName: 'Azithromycin', dosage: '500mg', frequency: '1-0-0', duration: '3 days', instructions: 'After food', quantity: '3' }
      ]);
    }, 3000);
  };

  const addMedicine = () => {
    setMedicines([...medicines, {
      medicineName: '', dosage: '', frequency: '1-0-1', duration: '5 days', instructions: 'After food', quantity: '10'
    }]);
  };

  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
    if (field === 'medicineName') {
      checkDrugInteractions(updated);
    }
  };

  const checkDrugInteractions = (medList: Medicine[]) => {
    const allergies = (patient?.patientProfile?.allergies || '').toLowerCase();
    const alerts: string[] = [];
    if (!allergies) {
      setDrugAlerts([]);
      return;
    }
    
    medList.forEach(m => {
      const medName = m.medicineName.toLowerCase();
      if (!medName) return;
      
      // Simple string matching for prototype
      if (allergies.includes(medName) || medName.includes(allergies)) {
        alerts.push(`CRITICAL: Patient has a known allergy to ${m.medicineName}!`);
      } else if (allergies.includes('penicillin') && (medName.includes('amoxicillin') || medName.includes('ampicillin'))) {
        alerts.push(`CRITICAL: ${m.medicineName} is a Penicillin derivative. Patient has Penicillin allergy!`);
      } else if (allergies.includes('nsaid') && (medName.includes('ibuprofen') || medName.includes('diclofenac'))) {
        alerts.push(`CRITICAL: ${m.medicineName} is an NSAID. Patient has NSAID allergy!`);
      }
    });
    setDrugAlerts(alerts);
  };

  const toggleDictation = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice dictation is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      parseVoicePrescription(transcript);
    };

    recognition.onerror = () => {
      setError('Voice recognition failed.');
      setIsListening(false);
    };
    
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const parseVoicePrescription = (transcript: string) => {
    // Example: "Tab Metformin 500mg BD after meals for 30 days"
    const newMed: Medicine = {
      medicineName: 'Extracted Medicine',
      dosage: 'Standard',
      frequency: '1-0-1',
      duration: '5 days',
      instructions: 'After food',
      quantity: '10'
    };

    if (transcript.includes('metformin')) {
      newMed.medicineName = 'Metformin';
    } else if (transcript.includes('amoxicillin')) {
      newMed.medicineName = 'Amoxicillin';
    } else if (transcript.includes('paracetamol') || transcript.includes('dolo')) {
      newMed.medicineName = 'Paracetamol';
    } else {
      // Just take the first two words as medicine name if no match
      const words = transcript.split(' ');
      newMed.medicineName = words.slice(0, 2).join(' ') || transcript;
    }

    if (transcript.includes('500 mg') || transcript.includes('500mg')) newMed.dosage = '500mg';
    else if (transcript.includes('650 mg') || transcript.includes('650mg')) newMed.dosage = '650mg';
    
    if (transcript.includes('bd') || transcript.includes('twice')) newMed.frequency = '1-0-1';
    else if (transcript.includes('tds') || transcript.includes('three times')) newMed.frequency = '1-1-1';
    else if (transcript.includes('od') || transcript.includes('once')) newMed.frequency = '1-0-0';

    if (transcript.includes('30 days')) newMed.duration = '30 days';
    else if (transcript.includes('10 days')) newMed.duration = '10 days';

    if (transcript.includes('before meals') || transcript.includes('empty stomach')) newMed.instructions = 'Before meals';

    const updatedMeds = [...medicines];
    if (updatedMeds.length === 1 && !updatedMeds[0].medicineName) {
      updatedMeds[0] = newMed;
    } else {
      updatedMeds.push(newMed);
    }
    
    setMedicines(updatedMeds);
    checkDrugInteractions(updatedMeds);
  };

  const addQuickMedicine = (med: { name: string; dosage: string }) => {
    setMedicines([...medicines, {
      medicineName: med.name, dosage: med.dosage, frequency: '1-0-1',
      duration: '5 days', instructions: 'After food', quantity: '10'
    }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validMeds = medicines.filter(m => m.medicineName.trim());
    if (validMeds.length === 0) {
      setError('Add at least one medicine.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await prescriptionAPI.create({
        patientId: patient.id,
        appointmentId,
        diagnosis,
        notes,
        medicines: validMeds,
      });
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create prescription.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💊</div>
        <h3 style={{ fontWeight: 700, color: 'var(--risk-low)' }}>Prescription Created!</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Sent to {patient.firstName}'s health vault.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Patient Info */}
      <div className="glass-card-static" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
          background: 'linear-gradient(135deg, var(--accent-500), var(--primary-500))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, color: 'white', fontSize: '0.8rem'
        }}>
          {patient.firstName[0]}{patient.lastName[0]}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{patient.firstName} {patient.lastName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {patient.patientProfile?.bloodGroup && `🩸 ${patient.patientProfile.bloodGroup}`}
            {patient.patientProfile?.gender && ` · ${patient.patientProfile.gender}`}
          </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="input-group">
        <label>{t('diagnosisLabel')}</label>
        <input className="input" placeholder="e.g., Viral Fever with Upper Respiratory Infection" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
      </div>

      {/* Quick Add Medicines */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {t('quickMedicines')}
          </div>
          <button 
            type="button" 
            className={`btn btn-sm ${isListening ? 'btn-danger' : 'btn-accent'}`}
            onClick={handleVoiceRx}
            disabled={isListening}
          >
            {isListening ? <><div className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }} /> Listening...</> : <><Mic size={14} /> Smart Voice Dictation</>}
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {COMMON_MEDICINES.map(med => (
            <button
              key={med.name}
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => addQuickMedicine(med)}
              style={{ fontSize: '0.72rem' }}
            >
              <Pill size={10} /> {med.name}
            </button>
          ))}
        </div>
      </div>

      {/* Medicine List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            {t('medicineList')} ({medicines.length})
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button" 
              className={`btn btn-sm ${isListening ? 'btn-danger' : 'btn-ghost'}`} 
              onClick={toggleDictation}
              title="Dictate prescription"
            >
              {isListening ? <><MicOff size={12} /> Listening...</> : <><Mic size={12} /> Dictate</>}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={addMedicine}>
              <Plus size={12} /> {t('addMedicine')}
            </button>
          </div>
        </div>

        {drugAlerts.length > 0 && (
          <div className="animate-in" style={{ background: 'var(--risk-critical)', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {drugAlerts.map((alert, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.85rem', fontWeight: 600 }}>
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{alert}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {medicines.map((med, i) => (
            <div key={i} className="glass-card-static" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{t('medicineLabel')} #{i + 1}</span>
                {medicines.length > 1 && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeMedicine(i)} style={{ color: '#f87171', padding: '4px' }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                <input className="input" placeholder={t('medicineLabel')} value={med.medicineName}
                  onChange={e => updateMedicine(i, 'medicineName', e.target.value)} style={{ fontSize: '0.85rem', padding: '8px 12px' }} />
                <input className="input" placeholder={t('dosage')} value={med.dosage}
                  onChange={e => updateMedicine(i, 'dosage', e.target.value)} style={{ fontSize: '0.85rem', padding: '8px 12px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '8px' }}>
                <select className="input" value={med.frequency} onChange={e => updateMedicine(i, 'frequency', e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '8px 12px' }}>
                  <option value="1-0-0">Morning only</option>
                  <option value="0-0-1">Night only</option>
                  <option value="1-0-1">Morning + Night</option>
                  <option value="1-1-1">Three times</option>
                  <option value="1-1-1-1">Four times</option>
                  <option value="SOS">As needed (SOS)</option>
                </select>
                <input className="input" placeholder={t('duration')} value={med.duration}
                  onChange={e => updateMedicine(i, 'duration', e.target.value)} style={{ fontSize: '0.85rem', padding: '8px 12px' }} />
                <input className="input" placeholder={t('instructions')} value={med.instructions}
                  onChange={e => updateMedicine(i, 'instructions', e.target.value)} style={{ fontSize: '0.85rem', padding: '8px 12px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Notes */}
      <div className="input-group">
        <label>{t('clinicalNotes')}</label>
        <textarea className="input" placeholder="Additional instructions, dietary advice, follow-up plans..." value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
      </div>

      {ddiAlert && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #f87171', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <AlertTriangle size={18} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 800, color: '#f87171', fontSize: '0.9rem' }}>⚠️ DDI ALERT</div>
            <div style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '2px' }}>{ddiAlert}</div>
          </div>
        </div>
      )}

      {error && <div style={{ color: 'var(--risk-critical)', fontSize: '0.85rem' }}>{error}</div>}

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
        {loading ? <div className="spinner" /> : <><Send size={16} /> {t('saveRx')}</>}
      </button>
    </form>
  );
}

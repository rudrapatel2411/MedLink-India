// MedLink India — Create Prescription Component (Smart Rx Builder)
import { useState } from 'react';
import { prescriptionAPI } from '../../services/api';
import { Plus, Trash2, Send, Pill } from 'lucide-react';
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

export default function CreatePrescription({ patient, appointmentId, onSuccess }: Props) {
  const { t } = useLanguage();
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([
    { medicineName: '', dosage: '', frequency: '1-0-1', duration: '5 days', instructions: 'After food', quantity: '10' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
          {t('quickMedicines')}
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
          <button type="button" className="btn btn-ghost btn-sm" onClick={addMedicine}>
            <Plus size={12} /> {t('addMedicine')}
          </button>
        </div>

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

      {error && <div style={{ color: 'var(--risk-critical)', fontSize: '0.85rem' }}>{error}</div>}

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
        {loading ? <div className="spinner" /> : <><Send size={16} /> {t('saveRx')}</>}
      </button>
    </form>
  );
}

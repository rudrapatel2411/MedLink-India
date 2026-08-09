// MedLink India — Book Appointment Component
import { useState, useEffect } from 'react';
import { appointmentAPI } from '../../services/api';
import { Calendar, Clock, Send } from 'lucide-react';

interface Props {
  onSuccess: () => void;
}

export default function BookAppointment({ onSuccess }: Props) {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    doctorId: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '10:00',
    type: 'OPD',
    chiefComplaint: '',
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await appointmentAPI.getAvailableDoctors();
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error('Failed to load doctors:', err);
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
        <h3 style={{ fontWeight: 700, color: 'var(--risk-low)' }}>Appointment Booked!</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>You'll receive your token number shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Doctor Selection */}
      <div className="input-group">
        <label>Select Doctor</label>
        {fetchingDoctors ? (
          <div style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading doctors...</div>
        ) : (
          <select
            className="input"
            value={form.doctorId}
            onChange={e => setForm({ ...form, doctorId: e.target.value })}
            required
          >
            <option value="">Choose a doctor...</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>
                Dr. {doc.firstName} {doc.lastName} — {doc.doctorProfile?.specialization || 'General'} (₹{doc.doctorProfile?.consultationFee || 'N/A'})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Doctor Card Preview */}
      {form.doctorId && (() => {
        const doc = doctors.find(d => d.id === form.doctorId);
        if (!doc) return null;
        return (
          <div className="glass-card-static" style={{ padding: '14px', display: 'flex', gap: '12px', alignItems: 'center' }}>
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
        );
      })()}

      {/* Date & Time */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="input-group">
          <label><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />Date</label>
          <input
            type="date"
            className="input"
            value={form.scheduledDate}
            onChange={e => setForm({ ...form, scheduledDate: e.target.value })}
            required
          />
        </div>
        <div className="input-group">
          <label><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />Time</label>
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
        <label>Appointment Type</label>
        <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="OPD">🏥 OPD Visit</option>
          <option value="TELECONSULT">💻 Teleconsultation</option>
          <option value="HOME_VISIT">🏠 Home Visit</option>
          <option value="FOLLOW_UP">🔁 Follow-up</option>
        </select>
      </div>

      {/* Chief Complaint */}
      <div className="input-group">
        <label>Chief Complaint / Reason</label>
        <textarea
          className="input"
          placeholder="Describe your symptoms or reason for visit..."
          value={form.chiefComplaint}
          onChange={e => setForm({ ...form, chiefComplaint: e.target.value })}
          rows={3}
        />
      </div>

      {error && <div style={{ color: 'var(--risk-critical)', fontSize: '0.85rem' }}>{error}</div>}

      <button type="submit" className="btn btn-accent btn-lg" disabled={loading} style={{ width: '100%' }}>
        {loading ? <div className="spinner" /> : <><Send size={16} /> Confirm Booking</>}
      </button>
    </form>
  );
}

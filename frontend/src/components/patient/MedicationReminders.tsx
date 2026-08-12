import { useState, useEffect } from 'react';
import { Pill, CheckCircle2, Clock, Bell } from 'lucide-react';

interface Props {
  prescriptions: any[];
}

export default function MedicationReminders({ prescriptions }: Props) {
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    // Extract active medicines
    const activeRx = prescriptions.filter(p => p.status === 'ACTIVE');
    const meds: any[] = [];
    
    activeRx.forEach(rx => {
      rx.medicines?.forEach((med: any) => {
        // Mock parsing the frequency (e.g., "1-0-1", "OD", "BD")
        const freq = med.frequency.toUpperCase();
        if (freq.includes('1-0-1') || freq.includes('BD') || freq.includes('TWICE')) {
          meds.push({ ...med, time: 'Morning (09:00 AM)', timeSlot: 'morning' });
          meds.push({ ...med, time: 'Night (09:00 PM)', timeSlot: 'night' });
        } else if (freq.includes('1-1-1') || freq.includes('TDS')) {
          meds.push({ ...med, time: 'Morning (09:00 AM)', timeSlot: 'morning' });
          meds.push({ ...med, time: 'Afternoon (01:00 PM)', timeSlot: 'afternoon' });
          meds.push({ ...med, time: 'Night (09:00 PM)', timeSlot: 'night' });
        } else {
          // Default to Morning
          meds.push({ ...med, time: 'Morning (09:00 AM)', timeSlot: 'morning' });
        }
      });
    });

    setReminders(meds);
  }, [prescriptions]);

  const takeMedicine = (id: string, timeSlot: string) => {
    setReminders(reminders.filter(r => !(r.id === id && r.timeSlot === timeSlot)));
  };

  if (reminders.length === 0) return null;

  return (
    <div className="glass-card-static" style={{ padding: '20px' }}>
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} style={{ color: 'var(--amber-500)' }} />
          Today's Medication Schedule
        </h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {reminders.map((r, i) => (
          <div key={`${r.id}-${r.timeSlot}-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber-500)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pill size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.medicineName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Clock size={12} /> {r.time} · Dosage: {r.dosage}
                </div>
              </div>
            </div>
            <button 
              className="btn btn-sm" 
              style={{ background: 'var(--emerald-50)', color: 'var(--emerald-600)', border: '1px solid var(--emerald-200)' }}
              onClick={() => takeMedicine(r.id, r.timeSlot)}
            >
              <CheckCircle2 size={16} /> Mark Taken
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

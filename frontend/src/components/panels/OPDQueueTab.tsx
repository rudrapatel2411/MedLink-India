import { useState, useEffect } from 'react';
import { appointmentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, CheckCircle2, FastForward } from 'lucide-react';

export default function OPDQueueTab() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await appointmentAPI.getAvailableDoctors();
      const docs = res.data.data || [];
      setDoctors(docs);
      if (docs.length > 0) {
        setSelectedDoctorId(docs[0].id);
        fetchQueue(docs[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchQueue = async (docId: string) => {
    setLoading(true);
    try {
      const res = await appointmentAPI.getOpdQueue(docId);
      setQueue(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedDoctorId(val);
    if (val) fetchQueue(val);
  };

  const advanceToken = async (apptId: string) => {
    try {
      await appointmentAPI.updateStatus(apptId, { status: 'COMPLETED' });
      // The backend could auto-advance the next, but here we just refresh
      fetchQueue(selectedDoctorId);
    } catch (e) {
      console.error(e);
    }
  };

  const markInProgress = async (apptId: string) => {
    try {
      await appointmentAPI.updateStatus(apptId, { status: 'IN_PROGRESS' });
      fetchQueue(selectedDoctorId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Dynamic OPD Queue Management</h3>
        <select className="input" style={{ maxWidth: '300px' }} value={selectedDoctorId} onChange={handleDoctorChange}>
          {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner" /></div>
      ) : (
        <div className="glass-card-static" style={{ overflow: 'auto' }}>
          {queue.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-title">No patients in the OPD queue for this doctor today.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Token #</th>
                  <th>Patient Name</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map(appt => (
                  <tr key={appt.id} style={{ background: appt.status === 'IN_PROGRESS' ? 'rgba(6, 182, 212, 0.1)' : 'transparent' }}>
                    <td style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-400)' }}>{appt.tokenNumber}</td>
                    <td style={{ fontWeight: 600 }}>{appt.patient?.firstName} {appt.patient?.lastName}</td>
                    <td>{appt.scheduledTime}</td>
                    <td>
                      <span className={`badge ${appt.status === 'IN_PROGRESS' ? 'badge-in-progress' : 'badge-scheduled'}`}>
                        {appt.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {appt.status === 'SCHEDULED' && (
                        <button className="btn btn-sm btn-ghost" onClick={() => markInProgress(appt.id)}>
                          <FastForward size={14} /> Call Patient
                        </button>
                      )}
                      {appt.status === 'IN_PROGRESS' && (
                        <button className="btn btn-sm btn-primary" onClick={() => advanceToken(appt.id)}>
                          <CheckCircle2 size={14} /> Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

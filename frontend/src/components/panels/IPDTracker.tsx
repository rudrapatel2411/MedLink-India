import { useState, useEffect } from 'react';
import { ipdAPI, hospitalAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Activity, Plus, Edit3, ClipboardList, RefreshCw } from 'lucide-react';

export default function IPDTracker() {
  const { t } = useLanguage();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const [ipdBeds, setIpdBeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBed, setSelectedBed] = useState<any>(null);
  
  const [logForm, setLogForm] = useState({ nurseName: '', vitals: '', notes: '' });
  const [roundForm, setRoundForm] = useState({ doctorName: '', notes: '', diagnosis: '' });
  const [billForm, setBillForm] = useState({ totalAmount: '', status: 'PENDING', items: '' });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await hospitalAPI.getHospitals();
      const hosp = res.data.data || [];
      setHospitals(hosp);
      if (hosp.length > 0) {
        setSelectedHospitalId(hosp[0].id);
        fetchIPD(hosp[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchIPD = async (hospId: string) => {
    setLoading(true);
    try {
      const res = await ipdAPI.getHospitalIPD(hospId);
      setIpdBeds(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleHospitalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedHospitalId(val);
    if (val) fetchIPD(val);
  };

  const submitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBed) return;
    try {
      await ipdAPI.addNursingLog(selectedBed.id, logForm);
      setLogForm({ nurseName: '', vitals: '', notes: '' });
      fetchIPD(selectedHospitalId);
      setSelectedBed(null);
    } catch (e) {
      console.error(e);
    }
  };

  const submitRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBed) return;
    try {
      await ipdAPI.addDoctorRound(selectedBed.id, roundForm);
      setRoundForm({ doctorName: '', notes: '', diagnosis: '' });
      fetchIPD(selectedHospitalId);
      setSelectedBed(null);
    } catch (e) {
      console.error(e);
    }
  };

  const submitBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBed) return;
    try {
      const breakdown = billForm.items.split(',').map(i => ({ item: i.trim() }));
      await ipdAPI.generateBill(selectedBed.id, {
        totalAmount: parseFloat(billForm.totalAmount),
        status: billForm.status,
        breakdown
      });
      setBillForm({ totalAmount: '', status: 'PENDING', items: '' });
      fetchIPD(selectedHospitalId);
      setSelectedBed(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>IPD Tracker (In-Patient Department)</h3>
        <select className="input" style={{ maxWidth: '300px' }} value={selectedHospitalId} onChange={handleHospitalChange}>
          {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner" /></div>
      ) : (
        <div className="dashboard-grid dashboard-grid-3">
          {ipdBeds.length === 0 && <div className="glass-card" style={{ padding: '20px', gridColumn: '1/-1' }}>No active IPD patients in this hospital.</div>}
          {ipdBeds.map(bed => (
            <div key={bed.id} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="badge badge-scheduled">{bed.bedType} - Bed {bed.bedNumber}</span>
                <span className="badge badge-in-progress">{bed.status}</span>
              </div>
              <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '5px' }}>{bed.patientName}</h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                Admitted: {new Date(bed.allocatedAt).toLocaleString('en-IN')}
              </div>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="btn btn-sm btn-ghost" onClick={() => setSelectedBed({ ...bed, action: 'LOG' })}>
                  <Activity size={14}/> Nurse Log
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => setSelectedBed({ ...bed, action: 'ROUND' })}>
                  <Edit3 size={14}/> Dr. Round
                </button>
                <button className="btn btn-sm btn-primary" onClick={() => setSelectedBed({ ...bed, action: 'BILL' })}>
                  <ClipboardList size={14}/> Billing
                </button>
              </div>

              {/* Mini history preview */}
              <div style={{ marginTop: '15px', borderTop: '1px solid var(--border-glass)', paddingTop: '10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>Recent Activity</div>
                {bed.nursingLogs.length > 0 && (
                  <div style={{ fontSize: '0.8rem' }}>🩺 {bed.nursingLogs[0].nurseName}: {bed.nursingLogs[0].notes}</div>
                )}
                {bed.doctorRounds.length > 0 && (
                  <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>👨‍⚕️ {bed.doctorRounds[0].doctorName}: {bed.doctorRounds[0].notes}</div>
                )}
                {bed.bill && (
                  <div style={{ fontSize: '0.8rem', marginTop: '4px', color: 'var(--primary-400)', fontWeight: 600 }}>
                    💳 Bill: ₹{bed.bill.totalAmount} ({bed.bill.status})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBed?.action === 'LOG' && (
        <div className="modal-overlay" onClick={() => setSelectedBed(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Add Nursing Log - {selectedBed.patientName}</h3>
            <form onSubmit={submitLog} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input className="input" placeholder="Nurse Name" required value={logForm.nurseName} onChange={e => setLogForm({...logForm, nurseName: e.target.value})} />
              <input className="input" placeholder="Vitals (e.g. BP: 120/80, HR: 72)" value={logForm.vitals} onChange={e => setLogForm({...logForm, vitals: e.target.value})} />
              <textarea className="input" placeholder="Notes / Care provided" rows={3} required value={logForm.notes} onChange={e => setLogForm({...logForm, notes: e.target.value})} />
              <button type="submit" className="btn btn-primary">Save Log</button>
            </form>
          </div>
        </div>
      )}

      {selectedBed?.action === 'ROUND' && (
        <div className="modal-overlay" onClick={() => setSelectedBed(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Add Doctor Round - {selectedBed.patientName}</h3>
            <form onSubmit={submitRound} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input className="input" placeholder="Doctor Name" required value={roundForm.doctorName} onChange={e => setRoundForm({...roundForm, doctorName: e.target.value})} />
              <input className="input" placeholder="Diagnosis Updates" value={roundForm.diagnosis} onChange={e => setRoundForm({...roundForm, diagnosis: e.target.value})} />
              <textarea className="input" placeholder="Examination Notes" rows={3} required value={roundForm.notes} onChange={e => setRoundForm({...roundForm, notes: e.target.value})} />
              <button type="submit" className="btn btn-primary">Save Round</button>
            </form>
          </div>
        </div>
      )}

      {selectedBed?.action === 'BILL' && (
        <div className="modal-overlay" onClick={() => setSelectedBed(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>IPD Billing - {selectedBed.patientName}</h3>
            <form onSubmit={submitBill} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input className="input" type="number" placeholder="Total Amount (₹)" required value={billForm.totalAmount} onChange={e => setBillForm({...billForm, totalAmount: e.target.value})} />
              <input className="input" placeholder="Breakdown Items (comma separated)" required value={billForm.items} onChange={e => setBillForm({...billForm, items: e.target.value})} />
              <select className="input" value={billForm.status} onChange={e => setBillForm({...billForm, status: e.target.value})}>
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
              </select>
              <button type="submit" className="btn btn-primary">Update Bill</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

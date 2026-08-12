import { useState, useEffect } from 'react';
import { MapPin, Phone, RefreshCw } from 'lucide-react';
import { hospitalAPI } from '../../services/api';

export default function HospitalTracker() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchHospitals = async () => {
    try {
      const res = await hospitalAPI.getHospitals();
      setHospitals(res.data.data);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
    const interval = setInterval(fetchHospitals, 30000); // 30 sec auto-refresh
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'GREEN': return 'var(--emerald-500)';
      case 'AMBER': return 'var(--yellow-500)';
      case 'RED': return 'var(--rose-500)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="glass-card p-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Real-Time Hospital Bed Tracker</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Live availability of Normal, Oxygen, and ICU beds in your area.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {loading ? <div className="spinner" /> : <span>Auto-syncing (Updated {lastRefreshed.toLocaleTimeString()})</span>}
          <button className="btn btn-ghost btn-sm" onClick={fetchHospitals} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {hospitals.map(h => (
          <div key={h.id} className="glass-card-static" style={{ padding: '20px', borderLeft: `4px solid ${getStatusColor(h.emergencyStatus)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{h.name}</h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14}/> {h.city}, {h.state}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14}/> {h.phone}</span>
                </div>
              </div>
              <div style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, border: `1px solid ${getStatusColor(h.emergencyStatus)}`, color: getStatusColor(h.emergencyStatus), background: `${getStatusColor(h.emergencyStatus)}15` }}>
                {h.emergencyStatus} STATUS
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '20px' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL BEDS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{h.totalBeds}</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--emerald-600)', fontWeight: 600 }}>AVAILABLE (NORMAL)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald-600)' }}>{h.availableBeds}</div>
              </div>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--sky-600)', fontWeight: 600 }}>OXYGEN BEDS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--sky-600)' }}>{h.oxygenBedsAvailable}</div>
              </div>
              <div style={{ background: 'rgba(225, 29, 72, 0.1)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid rgba(225, 29, 72, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--rose-600)', fontWeight: 600 }}>ICU BEDS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rose-600)' }}>{h.icuBedsAvailable}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

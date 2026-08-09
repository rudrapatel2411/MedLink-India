// MedLink India — Ambulance Fleet Control Panel
import { useState, useEffect } from 'react';
import { hospitalAPI } from '../../services/api';
import { Navigation, CheckCircle2 } from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

export default function AmbulanceDashboard() {
  const { t } = useLanguage();
  const [fleet, setFleet] = useState<any[]>([]);
  const [activeSOS, setActiveSOS] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fleetRes, sosRes] = await Promise.all([
        hospitalAPI.getAmbulances(),
        hospitalAPI.getActiveSOS(),
      ]);
      setFleet(fleetRes.data.data || []);
      setActiveSOS(sosRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch ambulance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (sosId: string, newStatus: string) => {
    try {
      await hospitalAPI.updateSOSStatus(sosId, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /><span>Connecting to Ambulance Fleet GPS...</span></div>;

  return (
    <div>
      <div style={{ marginBottom: '24px' }} className="animate-in">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('ambulanceTitle')}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t('ambulanceSubtitle')}</p>
      </div>

      {/* Active Emergency Dispatch Calls */}
      <div className="section-header">
        <h3 className="section-title">🚨 Active Emergency Dispatch Dispatch Calls</h3>
      </div>
      {activeSOS.length === 0 ? (
        <div className="glass-card-static empty-state" style={{ marginBottom: '28px' }}>
          <div className="empty-state-icon">🚑</div>
          <p className="empty-state-title">No active dispatch emergency calls</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          {activeSOS.map(sos => (
            <div key={sos.id} className="glass-card-static" style={{ padding: '20px', borderLeft: '4px solid var(--risk-critical)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-risk-critical">{sos.status}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 GPS: {sos.latitude}, {sos.longitude}</span>
                  </div>
                  <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '6px' }}>{sos.patientName} ({sos.patientPhone})</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>{sos.address}</p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Assigned Vehicle: <span style={{ color: 'var(--primary-400)', fontWeight: 700 }}>{sos.assignedAmbulanceNo || 'Auto-dispatching'}</span>
                    {' · '}Hospital Destination: <span style={{ color: 'var(--accent-400)', fontWeight: 700 }}>{sos.assignedHospitalName || 'Triage in progress'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {sos.status === 'ACTIVE' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleStatusToggle(sos.id, 'DISPATCHED')}>
                      <Navigation size={14} /> Dispatch Ambulance
                    </button>
                  )}
                  {sos.status === 'DISPATCHED' && (
                    <button className="btn btn-accent btn-sm" onClick={() => handleStatusToggle(sos.id, 'ARRIVED')}>
                      <CheckCircle2 size={14} /> Mark Arrived at Scene
                    </button>
                  )}
                  {sos.status === 'ARRIVED' && (
                    <button className="btn btn-ghost btn-sm" onClick={() => handleStatusToggle(sos.id, 'RESOLVED')}>
                      Patient Handed to ER
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fleet Status */}
      <div className="section-header">
        <h3 className="section-title">📡 Active Ambulance Fleet Status</h3>
      </div>
      <div className="dashboard-grid dashboard-grid-2">
        {fleet.map(amb => (
          <div key={amb.id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: amb.isAvailable ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  🚑
                </div>
                <div>
                  <h4 style={{ fontWeight: 800 }}>{amb.vehicleNo}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Driver: {amb.driverName} (📞 {amb.driverPhone})</p>
                </div>
              </div>
              <span className={`badge ${amb.isAvailable ? 'badge-completed' : 'badge-risk-critical'}`}>
                {amb.status}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-input)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              Hospital Base: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{amb.hospitalName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Heart, Users, Activity, Target } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function NGODashboard() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching NGO specific data
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /><span>Loading NGO Analytics...</span></div>;

  const activeCampaigns = [
    { id: 1, name: 'Malaria Eradication Drive', location: 'North Delhi', volunteers: 45, funds: '₹ 1,20,000', status: 'ACTIVE' },
    { id: 2, name: 'Blood Donation Camp', location: 'Sector 14', volunteers: 12, funds: '₹ 15,000', status: 'ACTIVE' },
    { id: 3, name: 'Free Cardiac Screening', location: 'Connaught Place', volunteers: 20, funds: '₹ 45,000', status: 'UPCOMING' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }} className="animate-in">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>NGO Worker Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Community Outreach & Volunteer Deployment Panel</p>
        </div>
        <button className="btn btn-primary">
          <Heart size={16} /> Start New Campaign
        </button>
      </div>

      <div className="dashboard-grid dashboard-grid-3" style={{ marginBottom: '28px' }}>
        <div className="glass-card stat-card stat-rose">
          <div className="stat-card-header">
            <span className="stat-card-label">Active Volunteers</span>
            <div className="stat-card-icon"><Users size={18} /></div>
          </div>
          <div className="stat-card-value">1,240</div>
        </div>
        <div className="glass-card stat-card stat-cyan">
          <div className="stat-card-header">
            <span className="stat-card-label">Outreach Camps</span>
            <div className="stat-card-icon"><Target size={18} /></div>
          </div>
          <div className="stat-card-value">18</div>
        </div>
        <div className="glass-card stat-card stat-emerald">
          <div className="stat-card-header">
            <span className="stat-card-label">Donations Utilized</span>
            <div className="stat-card-icon"><Activity size={18} /></div>
          </div>
          <div className="stat-card-value">₹ 8.5L</div>
        </div>
      </div>

      <div className="section-header">
        <h3 className="section-title">🌍 Active Community Campaigns</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activeCampaigns.map(camp => (
          <div key={camp.id} className="glass-card-static" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{camp.name}</h4>
                <span className={`badge ${camp.status === 'ACTIVE' ? 'badge-completed' : 'badge-scheduled'}`}>{camp.status}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>📍 {camp.location}</p>
            </div>
            <div style={{ display: 'flex', gap: '20px', textAlign: 'right' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Volunteers</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{camp.volunteers}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Funds Allocated</div>
                <div style={{ fontWeight: 700, color: 'var(--emerald-500)' }}>{camp.funds}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

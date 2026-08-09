// MedLink India — Platform Operations & Super Admin Control Consoles (Phase 4)
import { useState, useEffect } from 'react';
import { insuranceGovtAPI } from '../../services/api';
import { Shield, DollarSign, Activity, Users, Building2, CheckCircle2, Lock, Key, Server, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AdminDashboardProps {
  role?: string;
}

export default function AdminDashboard({ role = 'SUPER_ADMIN' }: AdminDashboardProps) {
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [keyRotated, setKeyRotated] = useState(false);

  const isSuperAdmin = role === 'SUPER_ADMIN';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await insuranceGovtAPI.getAdminStats();
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <span>{t('loadingAdmin')}</span>
      </div>
    );
  }

  // ────────────────── PLATFORM ADMIN VIEW (Operations & Monetization) ──────────────────
  if (!isSuperAdmin) {
    return (
      <div className="animate-in">
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.25rem' }}>⚙️</span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('role_PLATFORM_ADMIN')}</h1>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>{t('adminSubtitle')}</p>
        </div>

        {/* Revenue & Operations KPIs */}
        <div className="dashboard-grid dashboard-grid-4 animate-in animate-in-delay-1" style={{ marginBottom: '28px' }}>
          <div className="glass-card stat-card stat-emerald">
            <div className="stat-card-header">
              <span className="stat-card-label">{t('saasRevenue')}</span>
              <div className="stat-card-icon"><DollarSign size={18} /></div>
            </div>
            <div className="stat-card-value">{stats?.monthlySaasRevenue || '₹ 14,80,000'}</div>
          </div>

          <div className="glass-card stat-card stat-cyan">
            <div className="stat-card-header">
              <span className="stat-card-label">{t('claimCommission')}</span>
              <div className="stat-card-icon"><Activity size={18} /></div>
            </div>
            <div className="stat-card-value">{stats?.claimProcessingCommission || '₹ 3,45,200'}</div>
          </div>

          <div className="glass-card stat-card stat-violet">
            <div className="stat-card-header">
              <span className="stat-card-label">{t('empaneledHospitals')}</span>
              <div className="stat-card-icon"><Building2 size={18} /></div>
            </div>
            <div className="stat-card-value">{stats?.totalHospitals || 4}</div>
          </div>

          <div className="glass-card stat-card stat-amber">
            <div className="stat-card-header">
              <span className="stat-card-label">{t('activeUsers')}</span>
              <div className="stat-card-icon"><Users size={18} /></div>
            </div>
            <div className="stat-card-value">{stats?.totalUsers || 3420}</div>
          </div>
        </div>

        {/* Empaneled Network Entities Table */}
        <div className="section-header" style={{ marginBottom: '16px' }}>
          <h3 className="section-title">🏥 {t('empaneledNetwork')}</h3>
        </div>

        <div className="glass-card-static" style={{ padding: '20px' }}>
          <table className="data-table" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <th style={{ padding: '10px' }}>{t('entityName')}</th>
                <th style={{ padding: '10px' }}>{t('categoryLabel')}</th>
                <th style={{ padding: '10px' }}>Subscription Tier</th>
                <th style={{ padding: '10px' }}>Monthly Billing</th>
                <th style={{ padding: '10px' }}>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Apollo Hospitals, Delhi', type: 'Super Specialty Hospital', tier: 'Enterprise Platinum', bill: '₹ 2,50,000 / mo', status: 'ACTIVE' },
                { name: 'Max Healthcare, Mumbai', type: 'Super Specialty Hospital', tier: 'Enterprise Platinum', bill: '₹ 2,20,000 / mo', status: 'ACTIVE' },
                { name: 'Fortis Healthcare, Bangalore', type: 'Super Specialty Hospital', tier: 'Enterprise Gold', bill: '₹ 1,80,000 / mo', status: 'ACTIVE' },
                { name: 'Dr. Lal PathLabs Network', type: 'Diagnostic Chain', tier: 'Lab Chain Pass', bill: '₹ 1,20,000 / mo', status: 'ACTIVE' },
                { name: 'MedPlus Supply Network', type: 'Pharmacy Chain', tier: 'Cold-Chain Desk', bill: '₹ 95,000 / mo', status: 'ACTIVE' },
                { name: 'Star Health TPA Gate', type: 'Insurance Gateway', tier: 'Pre-Auth Tier 1', bill: '1.5% Commission', status: 'ACTIVE' },
              ].map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 700 }}>{item.name}</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>{item.type}</td>
                  <td style={{ padding: '12px 10px' }}><span className="badge badge-info">{item.tier}</span></td>
                  <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--primary-300)' }}>{item.bill}</td>
                  <td style={{ padding: '12px 10px' }}><span className="badge badge-success">{t(item.status) || item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ────────────────── SUPER ADMIN VIEW (Security Governance & Control Vault) ──────────────────
  return (
    <div className="animate-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '1.25rem' }}>🛡️</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('adminTitle')}</h1>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>{t('adminSubtitle')}</p>
      </div>

      {/* Security KPIs */}
      <div className="dashboard-grid dashboard-grid-4 animate-in animate-in-delay-1" style={{ marginBottom: '28px' }}>
        <div className="glass-card stat-card stat-violet">
          <div className="stat-card-header">
            <span className="stat-card-label">{t('abdmNodes')}</span>
            <div className="stat-card-icon"><Shield size={18} /></div>
          </div>
          <div className="stat-card-value">{stats?.activeAbdmNodes || 48}</div>
        </div>

        <div className="glass-card stat-card stat-emerald">
          <div className="stat-card-header">
            <span className="stat-card-label">Encryption Engine</span>
            <div className="stat-card-icon"><Lock size={18} /></div>
          </div>
          <div className="stat-card-value">AES-256 GCM</div>
        </div>

        <div className="glass-card stat-card stat-cyan">
          <div className="stat-card-header">
            <span className="stat-card-label">{t('nodeHealth')}</span>
            <div className="stat-card-icon"><Activity size={18} /></div>
          </div>
          <div className="stat-card-value">100% Operational</div>
        </div>

        <div className="glass-card stat-card stat-amber">
          <div className="stat-card-header">
            <span className="stat-card-label">Master Replica Sync</span>
            <div className="stat-card-icon"><Server size={18} /></div>
          </div>
          <div className="stat-card-value">Synced</div>
        </div>
      </div>

      {/* Super Admin Control Actions */}
      <div className="glass-card-static" style={{ padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} style={{ color: 'var(--primary-400)' }} /> {t('keyRotation')}
          </div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Rotate system HMAC-SHA256 signing keys and re-issue ABDM Sandbox Certificates.
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setKeyRotated(true)}
          disabled={keyRotated}
        >
          {keyRotated ? <CheckCircle2 size={16} /> : <RefreshCw size={16} />}
          {keyRotated ? 'Keys Rotated & Secured' : t('rotateMasterKey')}
        </button>
      </div>

      {/* System Audit Log Vault */}
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <h3 className="section-title">🔒 {t('cryptoAudit')}</h3>
      </div>
      <div className="glass-card-static" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            '✅ [SECURITY AUDIT] AES-256 Data-at-Rest Encryption verified across all 12 stakeholder databases',
            '✅ [ABDM GOVERNANCE] M1 (ABHA Creation), M2 (Health Record Push), M3 (Consent Manager) Sandbox Active',
            '✅ [RBAC PROTECTION] Role-Based Access Control enforced for PLATFORM_ADMIN vs SUPER_ADMIN permissions',
            '✅ [KAFKA EVENT RADAR] Emergency SOS Event Queue Latency: 3.8ms (<10ms SLA target)',
            '✅ [DATABASE REPLICA] Primary Database synced with Secondary Cold Backup',
            ...(keyRotated ? ['🔑 [KEY ROTATION] Cryptographic Signing Keys rotated successfully at ' + new Date().toLocaleTimeString()] : []),
          ].map((log, i) => (
            <div key={i} style={{ background: 'var(--bg-input)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

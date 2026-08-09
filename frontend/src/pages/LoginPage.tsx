// MedLink India — Login Page with 1-Click Quick Demo Buttons for All Stakeholder Panels
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../utils/translations';
import { LogIn, Eye, EyeOff, Globe } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async (demoEmail: string) => {
    setError('');
    setLoading(true);
    setEmail(demoEmail);
    setPassword('12345');
    try {
      await login(demoEmail, '12345');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: `🧑 ${t('role_PATIENT')}`, email: 'patient@gmail.com' },
    { label: `👨‍⚕️ ${t('role_DOCTOR')}`, email: 'doctor@gmail.com' },
    { label: `🏥 ${t('role_HOSPITAL_ADMIN')}`, email: 'hospital@gmail.com' },
    { label: `🧪 ${t('role_LAB_TECHNICIAN')}`, email: 'lab@gmail.com' },
    { label: `💊 ${t('role_PHARMACIST')}`, email: 'pharmacy@gmail.com' },
    { label: `🚑 ${t('role_AMBULANCE_DRIVER')}`, email: 'ambulance@gmail.com' },
    { label: `🩸 ${t('role_BLOOD_BANK_MANAGER')}`, email: 'bloodbank@gmail.com' },
    { label: `📜 ${t('role_INSURANCE_TPA')}`, email: 'insurance@gmail.com' },
    { label: `🏛️ ${t('role_GOVT_OFFICIAL')}`, email: 'govt@gmail.com' },
    { label: `🛡️ ${t('role_SUPER_ADMIN')}`, email: 'admin@medlink.in' },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card glass-card-static animate-in" style={{ maxWidth: '440px', position: 'relative' }}>
        {/* Top Language Switcher */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Globe size={14} style={{ color: 'var(--primary-400)' }} />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            style={{
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px 6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="en">🌐 English</option>
            <option value="hi">🇮🇳 हिंदी</option>
            <option value="gu">🇮🇳 ગુજરાતી</option>
          </select>
        </div>

        <div className="auth-logo">
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🏥</div>
          <h1>{t('brandName')}</h1>
          <p>{t('tagline')}</p>
        </div>

        {error && (
          <div className="toast-error" style={{ position: 'relative', top: 'auto', right: 'auto', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{t('emailAddress')}</label>
            <input
              type="email"
              className="input"
              placeholder={t('enterEmail')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>{t('password')}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder={t('enterPassword')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
            {loading ? <div className="spinner" /> : <><LogIn size={18} /> {t('signIn')}</>}
          </button>
        </form>

        <div className="auth-footer">
          {t('dontHaveAccount')} <Link to="/register">{t('register')}</Link>
        </div>

        {/* Quick Demo Login Grid */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--primary-400)', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800 }}>
            {t('directPanelLogin')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.75rem', padding: '6px 10px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                onClick={() => quickDemoLogin(acc.email)}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

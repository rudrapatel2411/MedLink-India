// MedLink India — Register Page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../utils/translations';
import { UserPlus, Eye, EyeOff, Globe } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '', role: 'PATIENT'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || t('registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card-static animate-in" style={{ maxWidth: '500px', position: 'relative' }}>
        {/* Language Switcher Header */}
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
          <h1>{t('createYourAccount')}</h1>
          <p>{t('brandName')} {t('tagline')}</p>
        </div>

        {error && (
          <div className="toast-error" style={{ position: 'relative', top: 'auto', right: 'auto', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label>{t('firstName')}</label>
              <input className="input" name="firstName" placeholder="Rahul" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>{t('lastName')}</label>
              <input className="input" name="lastName" placeholder="Kumar" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label>{t('emailAddress')}</label>
            <input type="email" className="input" name="email" placeholder="rahul@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>{t('phoneOptional')}</label>
            <input className="input" name="phone" placeholder="+91-9876543210" value={form.phone} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>{t('iAmA')}</label>
            <select className="input" name="role" value={form.role} onChange={handleChange}>
              <option value="PATIENT">🧑 {t('role_PATIENT')}</option>
              <option value="DOCTOR">👨‍⚕️ {t('role_DOCTOR')}</option>
              <option value="HOSPITAL_ADMIN">🏥 {t('role_HOSPITAL_ADMIN')}</option>
              <option value="LAB_TECHNICIAN">🧪 {t('role_LAB_TECHNICIAN')}</option>
              <option value="PHARMACIST">💊 {t('role_PHARMACIST')}</option>
              <option value="AMBULANCE_DRIVER">🚑 {t('role_AMBULANCE_DRIVER')}</option>
              <option value="BLOOD_BANK_MANAGER">🩸 {t('role_BLOOD_BANK_MANAGER')}</option>
              <option value="INSURANCE_TPA">📜 {t('role_INSURANCE_TPA')}</option>
              <option value="GOVT_OFFICIAL">🏛️ {t('role_GOVT_OFFICIAL')}</option>
              <option value="NGO_WORKER">🤝 {t('role_NGO_WORKER')}</option>
              <option value="PLATFORM_ADMIN">⚙️ {t('role_PLATFORM_ADMIN')}</option>
            </select>
          </div>

          <div className="input-group">
            <label>{t('password')}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                name="password"
                placeholder={t('minPassword')}
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
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
            {loading ? <div className="spinner" /> : <><UserPlus size={18} /> {t('register')}</>}
          </button>
        </form>

        <div className="auth-footer">
          {t('alreadyHaveAccount')} <Link to="/login">{t('signIn')}</Link>
        </div>
      </div>
    </div>
  );
}

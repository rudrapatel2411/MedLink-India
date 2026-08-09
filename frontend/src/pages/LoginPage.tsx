// MedLink India — Login Page with 1-Click Quick Demo Buttons for All Stakeholder Panels
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
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
      navigate('/app');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
      navigate('/app');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: 'Patient / Citizen',       email: 'patient@gmail.com'   },
    { label: 'Doctor / Practitioner',   email: 'doctor@gmail.com'    },
    { label: 'Hospital Administrator',  email: 'hospital@gmail.com'  },
    { label: 'Lab Technician',          email: 'lab@gmail.com'       },
    { label: 'Pharmacist',              email: 'pharmacy@gmail.com'  },
    { label: 'Ambulance Driver',        email: 'ambulance@gmail.com' },
    { label: 'Blood Bank Manager',      email: 'bloodbank@gmail.com' },
    { label: 'Insurance TPA',           email: 'insurance@gmail.com' },
    { label: 'Government Health',       email: 'govt@gmail.com'      },
    { label: 'Super Admin Console',     email: 'admin@medlink.in'    },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card glass-card-static animate-in" style={{ maxWidth: '440px' }}>
        <div className="auth-logo">
          <div style={{ width: '48px', height: '48px', background: 'var(--primary-subtle)', border: '1px solid var(--primary-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <h1>MedLink India</h1>
          <p>Healthcare Operating System</p>
        </div>

        {error && (
          <div className="toast-error" style={{ position: 'relative', top: 'auto', right: 'auto', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              className="input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Enter your password"
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
            {loading ? <div className="spinner" /> : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create Account</Link>
        </div>

        {/* Quick Demo Login Grid */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--primary)', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
            Quick Demo Login
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.75rem', padding: '6px 10px' }}
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

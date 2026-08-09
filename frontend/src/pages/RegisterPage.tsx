// MedLink India — Register Page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
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
      navigate('/app');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card-static animate-in" style={{ maxWidth: '500px' }}>
        <div className="auth-logo">
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🏥</div>
          <h1>Create Account</h1>
          <p>Join MedLink India Healthcare Network</p>
        </div>

        {error && (
          <div className="toast-error" style={{ position: 'relative', top: 'auto', right: 'auto', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label>First Name</label>
              <input className="input" name="firstName" placeholder="Rahul" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input className="input" name="lastName" placeholder="Kumar" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" className="input" name="email" placeholder="rahul@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Phone (Optional)</label>
            <input className="input" name="phone" placeholder="+91-9876543210" value={form.phone} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>I am a</label>
            <select className="input" name="role" value={form.role} onChange={handleChange}>
              <option value="PATIENT">🧑 Patient / Citizen</option>
              <option value="DOCTOR">👨‍⚕️ Doctor / Practitioner</option>
              <option value="HOSPITAL_ADMIN">🏥 Hospital Administrator</option>
              <option value="LAB_TECHNICIAN">🧪 Lab Technician</option>
              <option value="PHARMACIST">💊 Pharmacist</option>
              <option value="AMBULANCE_DRIVER">🚑 Ambulance Driver</option>
              <option value="BLOOD_BANK_MANAGER">🩸 Blood Bank Manager</option>
              <option value="INSURANCE_TPA">📜 Insurance TPA</option>
              <option value="GOVT_OFFICIAL">🏛️ Government Health Official</option>
              <option value="NGO_WORKER">🤝 NGO & Rural Worker</option>
              <option value="PLATFORM_ADMIN">⚙️ Platform Admin</option>
            </select>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                name="password"
                placeholder="Minimum 6 characters"
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
            {loading ? <div className="spinner" /> : <><UserPlus size={18} /> Create Account</>}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

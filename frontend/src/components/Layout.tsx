// MedLink India — Layout with Multi-Language Selector & Live Socket.io Toast Notifications
import { type ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../utils/translations';
import { LogOut, User, Globe, Bell, X } from 'lucide-react';
import { getSocket } from '../services/socket';

interface LayoutProps {
  children: ReactNode;
  activeRole: string;
  onRoleChange: (role: string) => void;
}

interface NotificationToast {
  id: string;
  title: string;
  message: string;
  type: 'danger' | 'success' | 'warning' | 'info';
}

const ROLES = [
  { key: 'PATIENT', labelKey: 'role_PATIENT', emoji: '🧑' },
  { key: 'DOCTOR', labelKey: 'role_DOCTOR', emoji: '👨‍⚕️' },
  { key: 'HOSPITAL_ADMIN', labelKey: 'role_HOSPITAL_ADMIN', emoji: '🏥' },
  { key: 'LAB_TECHNICIAN', labelKey: 'role_LAB_TECHNICIAN', emoji: '🧪' },
  { key: 'PHARMACIST', labelKey: 'role_PHARMACIST', emoji: '💊' },
  { key: 'AMBULANCE_DRIVER', labelKey: 'role_AMBULANCE_DRIVER', emoji: '🚑' },
  { key: 'BLOOD_BANK_MANAGER', labelKey: 'role_BLOOD_BANK_MANAGER', emoji: '🩸' },
  { key: 'INSURANCE_TPA', labelKey: 'role_INSURANCE_TPA', emoji: '📜' },
  { key: 'GOVT_OFFICIAL', labelKey: 'role_GOVT_OFFICIAL', emoji: '🏛️' },
  { key: 'NGO_WORKER', labelKey: 'role_NGO_WORKER', emoji: '🤝' },
  { key: 'PLATFORM_ADMIN', labelKey: 'role_PLATFORM_ADMIN', emoji: '⚙️' },
  { key: 'SUPER_ADMIN', labelKey: 'role_SUPER_ADMIN', emoji: '🛡️' },
];

export default function Layout({ children, activeRole, onRoleChange }: LayoutProps) {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  useEffect(() => {
    const socket = getSocket();

    const addToast = (title: string, message: string, type: 'danger' | 'success' | 'warning' | 'info') => {
      const newToast: NotificationToast = {
        id: Math.random().toString(),
        title,
        message,
        type,
      };
      setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

      // Auto dismiss after 8 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 8000);
    };

    socket.on('emergency:sos', (data: any) => {
      addToast(data.title || '🚨 EMERGENCY SOS', data.message, 'danger');
    });

    socket.on('blood:sos', (data: any) => {
      addToast(data.title || '🩸 URGENT BLOOD SOS', data.message, 'danger');
    });

    socket.on('prescription:created', (data: any) => {
      addToast(data.title || '👨‍⚕️ PRESCRIPTION CREATED', data.message, 'success');
    });

    socket.on('lab:report', (data: any) => {
      addToast(data.title || '🧪 LAB REPORT READY', data.message, data.isCritical ? 'danger' : 'info');
    });

    socket.on('pharmacy:order', (data: any) => {
      addToast(data.title || '💊 PHARMACY ORDER DISPATCHED', data.message, 'success');
    });

    socket.on('insurance:claim', (data: any) => {
      addToast(data.title || '📜 INSURANCE PRE-AUTH APPROVED', data.message, 'success');
    });

    socket.on('govt:outbreak', (data: any) => {
      addToast(data.title || '🏛️ PUBLIC HEALTH EPIDEMIC ALERT', data.message, 'warning');
    });

    return () => {
      socket.off('emergency:sos');
      socket.off('blood:sos');
      socket.off('prescription:created');
      socket.off('lab:report');
      socket.off('pharmacy:order');
      socket.off('insurance:claim');
      socket.off('govt:outbreak');
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'ML';
  const activeRoleObj = ROLES.find((r) => r.key === activeRole) || ROLES[0];

  return (
    <div className="app-layout">
      {/* Live Socket.io Toast Notifications Container */}
      <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '380px', width: '100%', pointerEvents: 'none' }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-card ${toast.type === 'danger' ? 'toast-error' : toast.type === 'warning' ? 'toast-warning' : 'toast-success'}`}
            style={{ pointerEvents: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '2px' }}>{toast.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{toast.message}</div>
            </div>
            <button onClick={() => removeToast(toast.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="/" className="navbar-brand" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            <div className="logo-icon">🏥</div>
            <span>MedLink <span style={{ color: 'var(--primary-400)', fontWeight: 400 }}>India</span></span>
          </a>

          {/* Role Indicator Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(6, 182, 212, 0.08)', padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
            <span>{activeRoleObj.emoji}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-300)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t(activeRoleObj.labelKey)}
            </span>
          </div>

          <div className="navbar-actions">
            {/* Live Socket Bell Indicator */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginRight: '6px' }}>
              <Bell size={18} style={{ color: toasts.length > 0 ? '#f87171' : 'var(--text-muted)' }} />
              {toasts.length > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px' }}>
              <Globe size={16} style={{ color: 'var(--primary-400)' }} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                style={{
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="en">🌐 English</option>
                <option value="hi">🇮🇳 हिंदी (Hindi)</option>
                <option value="gu">🇮🇳 ગુજરાતી (Gujarati)</option>
              </select>
            </div>

            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '4px' }}>
              {user?.email}
            </span>
            <div style={{ position: 'relative' }}>
              <div className="user-avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
                {initials}
              </div>
              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: '8px',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-md)', padding: '8px', minWidth: '180px',
                    boxShadow: 'var(--shadow-lg)', zIndex: 150
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-glass)', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user?.firstName} {user?.lastName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role}</div>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                    onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                  >
                    <User size={14} /> {t('profile')}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start', color: '#f87171', marginTop: '4px' }}
                    onClick={handleLogout}
                  >
                    <LogOut size={14} /> {t('logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 12-Role Switcher Bar */}
      <div className="role-switcher">
        <div className="role-switcher-inner">
          {ROLES.map((role) => (
            <button
              key={role.key}
              className={`role-tab ${activeRole === role.key ? 'active' : ''}`}
              onClick={() => onRoleChange(role.key)}
            >
              <span className="tab-icon">{role.emoji}</span>
              {t(role.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

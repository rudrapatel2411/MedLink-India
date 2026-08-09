// MedLink India — Coming Soon Placeholder (for Phase 2-4 stakeholder panels)
import { Construction, ArrowRight } from 'lucide-react';

interface Props {
  roleName: string;
  description: string;
  phase: string;
  features: string[];
  emoji: string;
}

export default function ComingSoon({ roleName, description, phase, features, emoji }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="glass-card-static animate-in" style={{ padding: '48px', textAlign: 'center', maxWidth: '560px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>{emoji}</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
          {roleName} Panel
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{description}</p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 'var(--radius-full)', color: 'var(--risk-medium)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '24px' }}>
          <Construction size={14} /> Coming in {phase}
        </div>

        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
            Planned Features
          </div>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid var(--border-glass)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <ArrowRight size={12} style={{ color: 'var(--primary-400)', flexShrink: 0 }} /> {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

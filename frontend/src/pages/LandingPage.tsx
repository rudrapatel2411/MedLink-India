// MedLink India — Landing Page
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Stethoscope, Building2, FlaskConical, Pill,
  Ambulance, FileText, Landmark,
  FolderOpen, Siren, BedDouble, Zap,
  ArrowRight, ChevronRight,
} from 'lucide-react';
import './LandingPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 22 } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

const ROLES = [
  { key: 'patient',   Icon: User,         label: 'Patient',     title: 'Your complete health record, always with you',       desc: 'Book appointments, view prescriptions, trigger emergency SOS, and access your ABHA-linked health vault — all in one place.' },
  { key: 'doctor',    Icon: Stethoscope,  label: 'Doctor',      title: 'Your patient queue, digitised',                      desc: 'Review queued patients, write digital prescriptions, access full health histories, and order lab tests from a single dashboard.' },
  { key: 'hospital',  Icon: Building2,    label: 'Hospital',    title: 'Real-time bed availability and ER dispatch',          desc: 'Monitor occupancy across wards, manage incoming SOS cases, and coordinate with ambulances and ICU in real time.' },
  { key: 'lab',       Icon: FlaskConical, label: 'Lab',         title: 'Zero-paper lab reporting',                           desc: 'Receive test orders from doctors, upload results directly to patient records, and flag critical values instantly.' },
  { key: 'pharmacy',  Icon: Pill,         label: 'Pharmacy',    title: 'Digital prescriptions, zero errors',                 desc: 'Receive and verify digital prescriptions, manage inventory, and dispatch orders with complete audit trails.' },
  { key: 'ambulance', Icon: Ambulance,    label: 'Ambulance',   title: 'GPS dispatch with hospital pre-notification',         desc: 'Accept SOS calls, navigate to patients with live location, and notify the destination hospital before arrival.' },
  { key: 'insurance', Icon: FileText,     label: 'Insurance',   title: 'Automated pre-authorisation',                        desc: 'Review pre-auth requests linked to digital records, approve claims faster with verified documentation.' },
  { key: 'govt',      Icon: Landmark,     label: 'Government',  title: 'Population health at a glance',                      desc: 'Monitor outbreak patterns, track resource allocation across facilities, and coordinate NGO and government health responses.' },
];

const FEATURES = [
  { Icon: FolderOpen, title: 'Centralised Health Vault',    desc: 'Every prescription, lab result, and diagnosis in one ABHA-linked record — shareable with any provider, always yours.' },
  { Icon: Siren,      title: 'One-tap SOS Dispatch',        desc: 'A single button sends GPS location, blood group, and case details to the nearest ambulance and ER simultaneously.' },
  { Icon: BedDouble,  title: 'Live Bed Availability',       desc: 'Hospitals publish real-time bed counts across wards. Ambulances see which ER has capacity before arrival.' },
  { Icon: Zap,        title: 'Instant Insurance Clearance', desc: 'Pre-authorisation requests are auto-generated from digital records — no fax, no manual forms.' },
];

const SOS_STEPS = [
  { Icon: Siren,      label: 'Patient triggers SOS',   sub: 'GPS + blood group sent instantly',   critical: true },
  { Icon: Ambulance,  label: 'Ambulance dispatched',   sub: 'Nearest unit accepts in seconds',    critical: false },
  { Icon: Building2,  label: 'Hospital notified',      sub: 'ER team and blood bank alerted',     critical: false },
  { Icon: BedDouble,  label: 'Bed reserved',           sub: 'Patient arrives to a prepared bay',  critical: false },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('patient');
  const activeRoleData = ROLES.find(r => r.key === activeRole) || ROLES[0];

  return (
    <div className="lp">
      {/* ── Navbar ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <a href="/" className="lp-nav-brand">
            <div className="lp-nav-logo">
              <Building2 size={16} strokeWidth={2} />
            </div>
            MedLink <span style={{ color: 'var(--primary)', marginLeft: '3px' }}>India</span>
          </a>
          <div className="lp-nav-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <motion.section className="lp-hero" variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp} className="lp-eyebrow">
          Built for India's healthcare ecosystem
        </motion.div>

        <motion.h1 variants={fadeUp} className="lp-hero-h1">
          One system connecting every part of <em>Indian healthcare</em>
        </motion.h1>

        <motion.p variants={fadeUp} className="lp-hero-sub">
          From the patient booking an appointment to the ambulance arriving at the ER — MedLink India connects all 12 stakeholders on one real-time platform.
        </motion.p>

        <motion.div variants={fadeUp} className="lp-hero-ctas">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
            Get Started
            <ChevronRight size={18} />
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/login')}>
            Sign In to Dashboard
          </button>
        </motion.div>
      </motion.section>

      {/* ── Role Selector Strip ── */}
      <section className="lp-roles">
        <div className="lp-roles-inner">
          <p className="lp-roles-label">I am a...</p>
          <div className="lp-role-tabs">
            {ROLES.map(role => {
              const RoleIcon = role.Icon;
              return (
                <button
                  key={role.key}
                  className={`lp-role-tab ${activeRole === role.key ? 'active' : ''}`}
                  onClick={() => setActiveRole(role.key)}
                >
                  <RoleIcon size={14} strokeWidth={2} />
                  {role.label}
                </button>
              );
            })}
          </div>
          <motion.div
            key={activeRole}
            className="lp-role-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3>{activeRoleData.title}</h3>
            <p>{activeRoleData.desc}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-features">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <motion.p variants={fadeUp} className="lp-section-label">Core Capabilities</motion.p>
          <motion.h2 variants={fadeUp} className="lp-section-title">
            Real infrastructure, not a directory
          </motion.h2>
          <motion.p variants={fadeUp} className="lp-section-sub">
            Each feature solves a specific gap in India's fragmented healthcare delivery chain.
          </motion.p>
          <div className="lp-features-grid">
            {FEATURES.map((f, i) => {
              const FIcon = f.Icon;
              return (
                <motion.div key={i} variants={fadeUp} className="lp-feature-card">
                  <div className="lp-feature-icon">
                    <FIcon size={20} strokeWidth={1.75} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ── SOS Loop Diagram ── */}
      <section className="lp-sos">
        <div className="lp-sos-inner">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
            <motion.p variants={fadeUp} className="lp-section-label">How It Works</motion.p>
            <motion.h2 variants={fadeUp} className="lp-section-title">
              A 4-step loop that saves lives
            </motion.h2>
            <motion.p variants={fadeUp} className="lp-section-sub">
              From an emergency trigger to a reserved ER bed — every step automated, every stakeholder notified.
            </motion.p>
            <motion.div variants={stagger} className="lp-sos-steps">
              {SOS_STEPS.map((step, i) => {
                const SIcon = step.Icon;
                return (
                  <>
                    <motion.div key={step.label} variants={fadeUp} className={`lp-sos-step ${step.critical ? 'critical' : ''}`}>
                      <div className="lp-sos-icon">
                        <SIcon size={22} strokeWidth={1.75} />
                      </div>
                      <h4>{step.label}</h4>
                      <p>{step.sub}</p>
                    </motion.div>
                    {i < SOS_STEPS.length - 1 && (
                      <div className="lp-sos-arrow">
                        <ArrowRight size={18} />
                      </div>
                    )}
                  </>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="lp-cta">
        <motion.div
          className="lp-cta-box"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.h2 variants={fadeUp}>Ready to connect your practice?</motion.h2>
          <motion.p variants={fadeUp}>
            Join hospitals, clinics, labs, and pharmacies already running on MedLink India.
          </motion.p>
          <motion.div variants={fadeUp} className="lp-cta-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              I'm a Patient
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/register')}>
              I'm a Healthcare Provider
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <Building2 size={16} />
            MedLink India
          </div>
          <span className="lp-footer-copy">© 2025 MedLink India. Healthcare OS for Bharat.</span>
          <div className="lp-footer-links">
            <a href="/login">Patient Login</a>
            <a href="/login">Provider Login</a>
            <a href="/register">Register</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

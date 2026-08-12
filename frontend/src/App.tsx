// MedLink India — Main Application Entry (Full Multi-Lingual 12-Panel Ecosystem)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './components/patient/PatientDashboard';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import HospitalDashboard from './components/panels/HospitalDashboard';
import AmbulanceDashboard from './components/panels/AmbulanceDashboard';
import BloodBankDashboard from './components/panels/BloodBankDashboard';
import LabDashboard from './components/panels/LabDashboard';
import PharmacyDashboard from './components/panels/PharmacyDashboard';
import InsuranceDashboard from './components/panels/InsuranceDashboard';
import GovtDashboard from './components/panels/GovtDashboard';
import NGODashboard from './components/panels/NGODashboard';
import AdminDashboard from './components/panels/AdminDashboard';

// Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="page-loader"><div className="spinner" /><span>Loading MedLink India Ecosystem...</span></div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Main Dashboard Router — switches between all 12 stakeholder panels dynamically
function Dashboard() {
  const { user } = useAuth();
  const [activeRole, setActiveRole] = useState<string>(user?.role || 'PATIENT');

  useEffect(() => {
    if (user?.role) {
      setActiveRole(user.role);
    }
  }, [user?.role]);

  const renderPanel = () => {
    switch (activeRole) {
      case 'PATIENT':
        return <PatientDashboard />;
      case 'DOCTOR':
        return <DoctorDashboard />;
      case 'HOSPITAL_ADMIN':
        return <HospitalDashboard />;
      case 'LAB_TECHNICIAN':
        return <LabDashboard />;
      case 'PHARMACIST':
        return <PharmacyDashboard />;
      case 'AMBULANCE_DRIVER':
        return <AmbulanceDashboard />;
      case 'BLOOD_BANK_MANAGER':
        return <BloodBankDashboard />;
      case 'INSURANCE_TPA':
        return <InsuranceDashboard />;
      case 'GOVT_OFFICIAL':
        return <GovtDashboard />;
      case 'NGO_WORKER':
        return <NGODashboard />;
      case 'PLATFORM_ADMIN':
      case 'SUPER_ADMIN':
        return <AdminDashboard role={activeRole} />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <Layout activeRole={activeRole} onRoleChange={setActiveRole}>
      {renderPanel()}
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;

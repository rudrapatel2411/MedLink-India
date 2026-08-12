import { useState } from 'react';
import { X, Save, Shield, Activity, Droplet } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onClose: () => void;
}

export default function HealthProfileEditor({ onClose }: Props) {
  const { user, refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({
    bloodGroup: user?.patientProfile?.bloodGroup || '',
    height: user?.patientProfile?.height || '',
    weight: user?.patientProfile?.weight || '',
    allergies: user?.patientProfile?.allergies ? JSON.parse(user.patientProfile.allergies).join(', ') : '',
    chronicConditions: user?.patientProfile?.chronicConditions ? JSON.parse(user.patientProfile.chronicConditions).join(', ') : '',
    emergencyContact: user?.patientProfile?.emergencyContact ? JSON.parse(user.patientProfile.emergencyContact).phone : '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        bloodGroup: formData.bloodGroup,
        height: formData.height,
        weight: formData.weight,
        allergies: formData.allergies ? formData.allergies.split(',').map((s: string) => s.trim()) : [],
        chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map((s: string) => s.trim()) : [],
        emergencyContact: formData.emergencyContact ? { name: 'Emergency', phone: formData.emergencyContact } : null,
      };
      
      await authAPI.updatePatientProfile(payload);
      await refreshUser();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={24} style={{ color: 'var(--primary-500)' }} />
            <h2 className="modal-title">Complete Your Health Profile</h2>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="label">
                <Droplet size={14} style={{ display: 'inline', marginRight: '4px', color: 'var(--rose-500)' }}/> 
                Blood Group
              </label>
              <select className="input" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">Height (cm)</label>
              <input type="number" className="input" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} placeholder="e.g. 175" />
            </div>
            <div className="form-group">
              <label className="label">Weight (kg)</label>
              <input type="number" className="input" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="e.g. 70" />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="label">Chronic Conditions</label>
            <input 
              type="text" 
              className="input" 
              value={formData.chronicConditions} 
              onChange={e => setFormData({...formData, chronicConditions: e.target.value})} 
              placeholder="e.g. Diabetes, Hypertension (comma separated)" 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="label">Active Allergies</label>
            <input 
              type="text" 
              className="input" 
              value={formData.allergies} 
              onChange={e => setFormData({...formData, allergies: e.target.value})} 
              placeholder="e.g. Penicillin, Peanuts (comma separated)" 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="label">
              <Shield size={14} style={{ display: 'inline', marginRight: '4px' }}/> 
              Emergency Contact (Phone)
            </label>
            <input 
              type="tel" 
              className="input" 
              value={formData.emergencyContact} 
              onChange={e => setFormData({...formData, emergencyContact: e.target.value})} 
              placeholder="e.g. 9876543210" 
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <div className="spinner" /> : <><Save size={16} /> Save Profile</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

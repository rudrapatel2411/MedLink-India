// MedLink India — AI Symptom Checker Component
import { useState } from 'react';
import { symptomAPI } from '../../services/api';
import { Brain, Plus, Stethoscope } from 'lucide-react';

const COMMON_SYMPTOMS = [
  'Fever', 'Headache', 'Cough', 'Chest Pain', 'Breathing Difficulty',
  'Stomach Pain', 'Vomiting', 'Diarrhea', 'Joint Pain', 'Back Pain',
  'Skin Rash', 'Fatigue', 'Eye Pain', 'Tooth Pain', 'Anxiety',
  'Numbness', 'High Fever', 'Depression', 'Seizure', 'Blood in Stool',
  'Weight Loss', 'Urinary Problems',
];

export default function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleCheck = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await symptomAPI.check({ symptoms: selectedSymptoms });
      setResult(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      LOW: 'var(--risk-low)', MEDIUM: 'var(--risk-medium)',
      HIGH: 'var(--risk-high)', CRITICAL: 'var(--risk-critical)',
    };
    return colors[level] || 'var(--text-muted)';
  };

  return (
    <div>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
        Select your symptoms below for an AI-assisted preliminary risk assessment.
      </p>

      {/* Selected Symptoms */}
      {selectedSymptoms.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {selectedSymptoms.map(s => (
            <span key={s} className="symptom-tag">
              {s}
              <button className="remove-btn" onClick={() => removeSymptom(s)}>✕</button>
            </span>
          ))}
        </div>
      )}

      {/* Custom Symptom Input */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          className="input"
          placeholder="Type a symptom..."
          value={customSymptom}
          onChange={e => setCustomSymptom(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCustomSymptom()}
        />
        <button className="btn btn-ghost" onClick={addCustomSymptom}><Plus size={16} /></button>
      </div>

      {/* Common Symptoms Grid */}
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
        Common Symptoms
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
        {COMMON_SYMPTOMS.map(s => (
          <button
            key={s}
            className={`btn btn-sm ${selectedSymptoms.includes(s) ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => selectedSymptoms.includes(s) ? removeSymptom(s) : addSymptom(s)}
            style={{ fontSize: '0.75rem' }}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <div style={{ color: 'var(--risk-critical)', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</div>}

      <button
        className="btn btn-primary btn-lg"
        style={{ width: '100%' }}
        onClick={handleCheck}
        disabled={loading || selectedSymptoms.length === 0}
      >
        {loading ? <div className="spinner" /> : <><Brain size={18} /> Analyze Symptoms ({selectedSymptoms.length})</>}
      </button>

      {/* Result */}
      {result && (
        <div className={`triage-result risk-${result.riskLevel}`}>
          <div className="triage-header">
            <div className="triage-score">{result.urgencyScore}/10</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: getRiskColor(result.riskLevel) }}>
                {result.riskLevel} RISK
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Urgency Score</div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>Recommended Action</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{result.suggestedAction}</p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
              <Stethoscope size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Suggested Specialist
            </div>
            <span className="badge badge-scheduled">{result.suggestedSpecialty}</span>
          </div>

          {result.possibleConditions?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>Possible Conditions</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {result.possibleConditions.map((c: string) => (
                  <span key={c} className="badge badge-in-queue">{c}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
            ⚠️ {result.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
}

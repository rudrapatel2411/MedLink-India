import { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, Settings, Users } from 'lucide-react';

interface Props {
  patientName: string;
  onEndCall: () => void;
}

export default function TeleconsultationView({ patientName, onEndCall }: Props) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCallDuration(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0, 0, 0, 0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)' }}>
        <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '6px 12px', background: 'var(--risk-critical)', borderRadius: '4px', fontWeight: 700, fontSize: '0.8rem', animation: 'pulse 2s infinite' }}>
            🔴 LIVE
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{patientName}</span>
          <span style={{ color: 'var(--text-muted)' }}>| {formatTime(callDuration)}</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', color: 'white' }}>
          <Users size={20} />
          <Settings size={20} />
        </div>
      </div>

      {/* Main Video Area */}
      <div style={{ flex: 1, display: 'flex', gap: '16px', padding: '16px', justifyContent: 'center' }}>
        {/* Main Feed (Patient or Screen Share) */}
        <div style={{
          flex: 1, maxWidth: isScreenSharing ? '1200px' : '800px', background: '#1a1a1a', borderRadius: '12px', 
          position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #333', transition: 'all 0.3s ease'
        }}>
          {isScreenSharing ? (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
              <MonitorUp size={64} style={{ marginBottom: '16px', color: 'var(--primary-500)' }} />
              <h2 style={{ color: 'white' }}>You are sharing your screen (DICOM Viewer)</h2>
              <p>Patients can see your diagnostic reports.</p>
            </div>
          ) : (
            <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(45deg, #2a2a2a, #1a1a1a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Simulated Patient Video */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '120px', height: '120px', background: '#444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 16px auto', color: '#888' }}>
                  {patientName[0]}
                </div>
                <div style={{ color: 'white', fontSize: '1.1rem' }}>{patientName}</div>
                <div style={{ color: '#888', fontSize: '0.85rem' }}>Network: Good</div>
              </div>
            </div>
          )}
        </div>

        {/* Self View */}
        <div style={{
          width: '240px', height: '180px', background: '#222', borderRadius: '12px', 
          border: '1px solid #444', position: 'absolute', bottom: '100px', right: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
        }}>
          {isVideoOff ? (
            <div style={{ color: '#666', textAlign: 'center' }}>
              <VideoOff size={32} style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '0.8rem' }}>Video Off</div>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '0.9rem' }}>
              Doctor Camera
            </div>
          )}
          {isMuted && (
            <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', padding: '4px', borderRadius: '50%', color: '#ef4444' }}>
              <MicOff size={14} />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', gap: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          style={{ width: '56px', height: '56px', borderRadius: '50%', border: 'none', background: isMuted ? '#ef4444' : '#333', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <button 
          onClick={() => setIsVideoOff(!isVideoOff)}
          style={{ width: '56px', height: '56px', borderRadius: '50%', border: 'none', background: isVideoOff ? '#ef4444' : '#333', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>
        <button 
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          style={{ width: '56px', height: '56px', borderRadius: '50%', border: 'none', background: isScreenSharing ? 'var(--primary-600)' : '#333', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
          title="Share Screen / DICOM"
        >
          <MonitorUp size={24} />
        </button>
        <button 
          onClick={onEndCall}
          style={{ width: '64px', height: '56px', borderRadius: '28px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', transition: '0.2s' }}
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
}

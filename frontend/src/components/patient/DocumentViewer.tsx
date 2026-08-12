import { X } from 'lucide-react';

interface Props {
  record: any;
  user: any;
  onClose: () => void;
}

export default function DocumentViewer({ record, user, onClose }: Props) {
  const metadata = record.metadata ? JSON.parse(record.metadata) : null;
  const patientName = user?.firstName ? `${user.firstName} ${user.lastName}` : (record.patientName || 'Patient Name');
  const patientId = user?.abhaId || (user?.id ? user.id.substring(0, 8).toUpperCase() : 'PT-8921X');
  const issueDate = new Date(record.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal" 
        style={{ 
          maxWidth: '800px', 
          background: 'var(--bg-primary)', 
          padding: 0,
          overflow: 'hidden'
        }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-glass)', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Document Viewer</span>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        
        <div style={{ padding: '30px', background: '#e2e8f0', display: 'flex', justifyContent: 'center', overflowY: 'auto', maxHeight: '80vh' }}>
          
          {/* THE PAPER DOCUMENT */}
          <div style={{
            width: '100%',
            maxWidth: '700px',
            background: 'white',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
            borderRadius: '4px',
            padding: '40px',
            position: 'relative',
            color: '#1e293b',
            fontFamily: '"Times New Roman", Times, serif',
            minHeight: '800px',
          }}>
            
            {/* Watermark */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)',
              fontSize: '8rem', color: 'rgba(0,0,0,0.02)', fontWeight: 900, pointerEvents: 'none',
              whiteSpace: 'nowrap', userSelect: 'none', zIndex: 0
            }}>
              {record.recordType.replace('_', ' ')}
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              
              {/* LETTERHEAD HEADER */}
              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '50px', height: '50px', background: '#0ea5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 800 }}>🏥</div>
                  <div>
                    <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>Apollo Hospitals</h1>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Indraprastha, New Delhi, 110076</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Tel: +91-11-26925858 | www.apollohospitals.com</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                    {record.recordType.replace('_', ' ')}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '4px' }}>Date: {issueDate}</div>
                  <div style={{ fontSize: '0.9rem', color: '#475569' }}>Ref ID: {record.id.substring(0,8).toUpperCase()}</div>
                </div>
              </div>

              {/* PATIENT DETAILS GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '30px', border: '1px solid #cbd5e1', padding: '16px', borderRadius: '4px', background: '#f8fafc' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Patient Name</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{patientName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Patient ID (ABHA)</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{patientId}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Clinical Notes</div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#334155' }}>{record.description || 'No additional notes provided.'}</div>
                </div>
              </div>

              {/* DYNAMIC DOCUMENT CONTENT */}
              <div style={{ minHeight: '350px' }}>
                
                {record.recordType === 'LAB_REPORT' && metadata && (
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid #94a3b8', paddingBottom: '6px', color: '#0f172a' }}>Biochemistry Analysis</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                      <thead>
                        <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                          <th style={{ textAlign: 'left', padding: '12px', color: '#334155', fontWeight: 700 }}>Test Parameter</th>
                          <th style={{ textAlign: 'left', padding: '12px', color: '#334155', fontWeight: 700 }}>Observed Value</th>
                          <th style={{ textAlign: 'left', padding: '12px', color: '#334155', fontWeight: 700 }}>Reference Interval</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(metadata).map(([key, val]: any, i) => {
                          const isHigh = typeof val === 'number' && val > 150; // Just a mock simulation of high values
                          return (
                            <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '12px', fontWeight: 600, textTransform: 'capitalize', color: '#1e293b' }}>{key.replace(/_/g, ' ')}</td>
                              <td style={{ padding: '12px', fontWeight: 800, color: isHigh ? '#dc2626' : '#1e293b' }}>
                                {val} {isHigh && <span style={{ color: '#dc2626', fontSize: '0.8rem', marginLeft: '4px' }}>(High)</span>}
                              </td>
                              <td style={{ padding: '12px', color: '#64748b', fontSize: '0.85rem' }}>Standard limits</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {record.recordType === 'PRESCRIPTION' && metadata && (
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: '-20px', fontSize: '4rem', opacity: 0.05, fontWeight: 900, fontFamily: 'serif' }}>Rx</div>
                    <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '16px', paddingBottom: '6px', color: '#0f172a', paddingLeft: '40px' }}>Prescribed Medications</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                      {(metadata.medicines || []).map((med: any, i: number) => (
                        <div key={i} style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '16px' }}>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', width: '25px' }}>{i + 1}.</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{med.medicineName || med.name}</div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '8px', fontSize: '0.9rem', color: '#334155' }}>
                                <div><span style={{ color: '#64748b' }}>Dosage:</span> <strong>{med.dosage}</strong></div>
                                <div><span style={{ color: '#64748b' }}>Frequency:</span> <strong>{med.frequency}</strong></div>
                                <div><span style={{ color: '#64748b' }}>Duration:</span> <strong>{med.duration}</strong></div>
                              </div>
                              {med.instructions && (
                                <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#475569', fontStyle: 'italic' }}>
                                  * Instruction: {med.instructions}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {record.recordType === 'VACCINATION' && (
                  <div style={{ textAlign: 'center', padding: '40px 20px', border: '4px double #cbd5e1', margin: '20px', background: '#f8fafc' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛡️</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0', textTransform: 'uppercase' }}>Certificate of Vaccination</h2>
                    <p style={{ fontSize: '1.1rem', color: '#334155', lineHeight: '1.6' }}>
                      This is to certify that <strong>{patientName}</strong> has been administered the vaccine as per standard health protocols.
                    </p>
                    <div style={{ marginTop: '30px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', padding: '12px', background: '#e2e8f0', display: 'inline-block', borderRadius: '4px' }}>
                      FULLY VACCINATED
                    </div>
                  </div>
                )}

                {['OTHER', 'DISCHARGE_SUMMARY'].includes(record.recordType) && (
                  <div style={{ padding: '20px', lineHeight: '1.8', fontSize: '1rem', color: '#334155' }}>
                    <p>This document contains clinical information regarding the patient's visit and subsequent discharge or procedural summary.</p>
                    <p>Condition upon discharge was noted as stable. The patient has been advised to follow up in OPD after 7 days if symptoms persist.</p>
                    <p>Medications to be continued as per the attached prescription sheet.</p>
                  </div>
                )}
                
              </div>

              {/* FOOTER & SIGNATURE */}
              <div style={{ marginTop: '60px', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  * This is an electronically generated document from MedLink Health Vault.<br/>
                  Valid without physical signature under IT Act 2000.
                </div>
                <div style={{ textAlign: 'center' }}>
                  {/* Signature graphic simulation */}
                  <div style={{ fontFamily: '"Brush Script MT", cursive, sans-serif', fontSize: '2.5rem', color: '#1d4ed8', transform: 'rotate(-5deg)', marginBottom: '8px', opacity: 0.8 }}>
                    Dr. Signature
                  </div>
                  <div style={{ borderTop: '1px solid #0f172a', paddingTop: '4px', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                    Authorized Signatory
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Reg No: MED-89201</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

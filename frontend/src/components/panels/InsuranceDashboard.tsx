// MedLink India — Insurance TPA & Auto-Claim Panel (Phase 4)
import { useState, useEffect } from "react";
import { insuranceGovtAPI } from "../../services/api";
import {
  Plus,
  Send,
  FileText,
  ShieldAlert,
  Network,
  BarChart2,
  Activity,
  CheckCircle2,
} from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";

export default function InsuranceDashboard() {
  const { t } = useLanguage();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("claims");
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimForm, setClaimForm] = useState({
    patientName: "Rahul Kumar",
    hospitalName: "Apollo Hospitals, Delhi",
    policyNumber: "STAR-HEALTH-991204",
    claimAmount: "35000",
    diagnosisCode: "ICD-10-I10 (Acute Angina)",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await insuranceGovtAPI.getClaims();
      setClaims(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch claims:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await insuranceGovtAPI.submitClaim(claimForm);
      setShowClaimModal(false);
      fetchData();
    } catch (err) {
      console.error("Claim submission failed:", err);
    }
  };

  if (loading)
    return (
      <div className="page-loader">
        <div className="spinner" />
        <span>{t("loadingInsurance")}</span>
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
        className="animate-in"
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>
            {t("insuranceTitle")} (TPA)
          </h1>
          <p style={{ color: "var(--text-muted)" }}>{t("insuranceSubtitle")}</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowClaimModal(true)}
        >
          <Plus size={16} /> {t("submitClaim")}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          borderBottom: "1px solid var(--border-glass)",
          paddingBottom: "4px",
        }}
        className="animate-in animate-in-delay-1"
      >
        {[
          {
            key: "claims",
            label: "Paperless Claims (AI Rule Engine)",
            icon: FileText,
          },
          {
            key: "emergency",
            label: "SOS Fast-Track Pre-Auth",
            icon: ShieldAlert,
          },
          { key: "network", label: "Network Empanelment", icon: Network },
          {
            key: "analytics",
            label: "Settlement & Analytics",
            icon: BarChart2,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 18px",
                border: "none",
                borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                background:
                  activeTab === tab.key
                    ? "rgba(6, 182, 212, 0.08)"
                    : "transparent",
                color:
                  activeTab === tab.key
                    ? "var(--text-accent)"
                    : "var(--text-muted)",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                borderBottom:
                  activeTab === tab.key
                    ? "2px solid var(--accent-500)"
                    : "2px solid transparent",
                transition: "all var(--transition-fast)",
              }}
            >
              <Icon size={16} /> {tab.label}
              {tab.key === "emergency" && (
                <span
                  style={{
                    background: "var(--risk-critical)",
                    color: "white",
                    borderRadius: "var(--radius-full)",
                    padding: "2px 8px",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                  }}
                >
                  1
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Claims Tab (Phase 2 & 4) */}
      {activeTab === "claims" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">📄 {t("claimAuditLogs")}</h3>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="glass-card-static"
                style={{ padding: "20px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <h4 style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                        {claim.claimNumber}
                      </h4>
                      <span className="badge badge-completed">
                        {t(claim.status) || claim.status}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                        marginTop: "4px",
                      }}
                    >
                      {t("patientName")}:{" "}
                      <span
                        style={{
                          color: "var(--text-primary)",
                          fontWeight: 600,
                        }}
                      >
                        {claim.patientName}
                      </span>{" "}
                      · {t("hospital")}: {claim.hospitalName} ·{" "}
                      {t("policyNoLabel")}:{" "}
                      <code style={{ color: "var(--primary-400)" }}>
                        {claim.policyNumber}
                      </code>
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      {t("diagnosisCodeLabel")}: {claim.diagnosisCode}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 900,
                        color: "var(--accent-400)",
                      }}
                    >
                      ₹{claim.claimAmount}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {t("cashlessApproved")}
                    </div>
                  </div>
                </div>

                {/* Audit Logs */}
                <div
                  style={{
                    background: "var(--bg-input)",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    🤖 Smart Rule-Engine Checks (Automated AI Audit)
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {claim.auditLogs?.map((log: any, i: number) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "0.8rem",
                          paddingBottom: "4px",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <span style={{ color: "var(--text-secondary)" }}>
                          {log.action}
                        </span>
                        <span
                          style={{
                            color:
                              log.result === "PASS" ||
                              log.result === "APPROVED_WITHIN_LIMIT"
                                ? "var(--emerald-500)"
                                : "var(--text-primary)",
                            fontWeight: 600,
                          }}
                        >
                          {log.result}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Fast-Track Tab (Phase 3) */}
      {activeTab === "emergency" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">
              🚨 SOS Fast-Track Pre-Authorization
            </h3>
          </div>
          <div
            className="glass-card-static"
            style={{
              padding: "20px",
              borderLeft: "4px solid var(--risk-critical)",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <span className="badge badge-risk-critical">
                  URGENT SOS ADMISSION
                </span>
                <span style={{ fontWeight: 800 }}>
                  Apollo Hospitals (Trauma Bay)
                </span>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Priority Kafka Channel
              </span>
            </div>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                  }}
                >
                  Patient: Rahul Kumar (Policy: STAR-991204)
                </p>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "var(--risk-critical)",
                  }}
                >
                  Auto-Approved{" "}
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--emerald-500)",
                      fontWeight: 600,
                    }}
                  >
                    (Within limit ₹5,00,000)
                  </span>
                </div>
              </div>
              <div>
                <button
                  className="btn btn-ghost"
                  style={{
                    border: "1px solid var(--emerald-500)",
                    color: "var(--emerald-500)",
                  }}
                >
                  <CheckCircle2 size={14} /> Pre-Auth Granted
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network Empanelment Tab (Phase 1) */}
      {activeTab === "network" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">🏥 Hospital Network Empanelment</h3>
          </div>
          <div className="dashboard-grid dashboard-grid-2">
            <div className="glass-card-static" style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <h4 style={{ fontWeight: 800 }}>Apollo Hospitals, Delhi</h4>
                <span className="badge badge-completed">Empanelled</span>
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "16px",
                }}
              >
                Direct API Integration Active. Billing Software synced.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--primary-400)",
                    fontWeight: 700,
                  }}
                >
                  24 Active Claims Processed Today
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  View All
                </div>
              </div>
              <div
                style={{
                  maxHeight: "130px",
                  overflowY: "auto",
                  borderTop: "1px solid var(--border-glass)",
                  paddingTop: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  paddingRight: "4px",
                }}
                className="custom-scrollbar"
              >
                {[
                  { id: "CLM-APL-8902", amt: 45000, status: "Settled" },
                  { id: "CLM-APL-8903", amt: 12500, status: "Settled" },
                  { id: "CLM-APL-8904", amt: 89000, status: "Processing" },
                  { id: "CLM-APL-8905", amt: 3200, status: "Settled" },
                  { id: "CLM-APL-8906", amt: 140000, status: "Settled" },
                ].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.75rem",
                      padding: "6px 10px",
                      background: "rgba(0,0,0,0.2)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid rgba(255,255,255,0.03)",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          color: "var(--text-secondary)",
                          fontFamily: "monospace",
                        }}
                      >
                        {c.id}
                      </span>
                      <span
                        style={{
                          color:
                            c.status === "Settled"
                              ? "var(--emerald-500)"
                              : "var(--amber-400)",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                        }}
                      >
                        {c.status}
                      </span>
                    </div>
                    <span style={{ color: "white", fontWeight: 700 }}>
                      ₹{c.amt.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    textAlign: "center",
                    marginTop: "4px",
                    fontStyle: "italic",
                  }}
                >
                  + 19 more claims auto-processed...
                </div>
              </div>
            </div>
            <div className="glass-card-static" style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <h4 style={{ fontWeight: 800 }}>Fortis Escorts, Jaipur</h4>
                <span className="badge badge-completed">Empanelled</span>
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "16px",
                }}
              >
                Direct API Integration Active. Billing Software synced.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--primary-400)",
                    fontWeight: 700,
                  }}
                >
                  12 Active Claims Processed Today
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  View All
                </div>
              </div>
              <div
                style={{
                  maxHeight: "130px",
                  overflowY: "auto",
                  borderTop: "1px solid var(--border-glass)",
                  paddingTop: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  paddingRight: "4px",
                }}
                className="custom-scrollbar"
              >
                {[
                  { id: "CLM-FTS-4410", amt: 22000, status: "Settled" },
                  { id: "CLM-FTS-4411", amt: 5600, status: "Settled" },
                  { id: "CLM-FTS-4412", amt: 125000, status: "Settled" },
                  { id: "CLM-FTS-4413", amt: 4500, status: "Processing" },
                ].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.75rem",
                      padding: "6px 10px",
                      background: "rgba(0,0,0,0.2)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid rgba(255,255,255,0.03)",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          color: "var(--text-secondary)",
                          fontFamily: "monospace",
                        }}
                      >
                        {c.id}
                      </span>
                      <span
                        style={{
                          color:
                            c.status === "Settled"
                              ? "var(--emerald-500)"
                              : "var(--amber-400)",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                        }}
                      >
                        {c.status}
                      </span>
                    </div>
                    <span style={{ color: "white", fontWeight: 700 }}>
                      ₹{c.amt.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    textAlign: "center",
                    marginTop: "4px",
                    fontStyle: "italic",
                  }}
                >
                  + 8 more claims auto-processed...
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab (Phase 5) */}
      {activeTab === "analytics" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">
              📊 Settlement & Rejection-Rate Analytics
            </h3>
          </div>

          <div
            className="dashboard-grid dashboard-grid-3"
            style={{ marginBottom: "24px" }}
          >
            <div className="glass-card stat-card stat-cyan">
              <div className="stat-card-header">
                <span className="stat-card-label">Claim Approval Rate</span>
                <div className="stat-card-icon">
                  <Activity size={18} />
                </div>
              </div>
              <div className="stat-card-value">99.1%</div>
            </div>
            <div className="glass-card stat-card stat-emerald">
              <div className="stat-card-header">
                <span className="stat-card-label">Total Settlements Today</span>
                <div className="stat-card-icon">
                  <FileText size={18} />
                </div>
              </div>
              <div className="stat-card-value">₹4.2 Cr</div>
            </div>
            <div className="glass-card stat-card stat-amber">
              <div className="stat-card-header">
                <span className="stat-card-label">Rejection Rate</span>
                <div className="stat-card-icon">
                  <ShieldAlert size={18} />
                </div>
              </div>
              <div
                className="stat-card-value"
                style={{ color: "var(--emerald-500)" }}
              >
                0.9% (Target Met)
              </div>
            </div>
          </div>

          <div
            className="glass-card-static"
            style={{ padding: "20px", border: "1px dashed var(--primary-400)" }}
          >
            <h4 style={{ fontWeight: 700, marginBottom: "12px" }}>
              Digital Processing Fee & Compliance Sync
            </h4>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                marginBottom: "16px",
              }}
            >
              Per-claim digital processing fees are automatically debited and
              settled. Analytics are pushed to the Enterprise Analytics module
              for regulatory compliance auditing.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                className="animate-ping"
                style={{
                  width: "8px",
                  height: "8px",
                  background: "var(--emerald-500)",
                  borderRadius: "50%",
                }}
              ></div>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--emerald-400)",
                }}
              >
                Enterprise Analytics DB Connected
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="modal-overlay" onClick={() => setShowClaimModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, marginBottom: "16px" }}>
              {t("submitClaimTitle")}
            </h3>
            <form
              onSubmit={handleSubmitClaim}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div className="input-group">
                <label>{t("patientName")}</label>
                <input
                  className="input"
                  value={claimForm.patientName}
                  onChange={(e) =>
                    setClaimForm({ ...claimForm, patientName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="input-group">
                <label>{t("hospital")}</label>
                <input
                  className="input"
                  value={claimForm.hospitalName}
                  onChange={(e) =>
                    setClaimForm({ ...claimForm, hospitalName: e.target.value })
                  }
                  required
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div className="input-group">
                  <label>{t("policyNoLabel")}</label>
                  <input
                    className="input"
                    value={claimForm.policyNumber}
                    onChange={(e) =>
                      setClaimForm({
                        ...claimForm,
                        policyNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label>{t("claimAmountLabel")}</label>
                  <input
                    className="input"
                    type="number"
                    value={claimForm.claimAmount}
                    onChange={(e) =>
                      setClaimForm({
                        ...claimForm,
                        claimAmount: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>{t("diagnosisCodeLabel")}</label>
                <input
                  className="input"
                  value={claimForm.diagnosisCode}
                  onChange={(e) =>
                    setClaimForm({
                      ...claimForm,
                      diagnosisCode: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowClaimModal(false)}
                  style={{ flex: 1 }}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <Send size={16} /> {t("submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

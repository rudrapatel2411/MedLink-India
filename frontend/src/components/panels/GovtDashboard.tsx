// MedLink India — Government Health & Epidemic Analytics Panel (Phase 4)
import { useState, useEffect } from "react";
import { insuranceGovtAPI } from "../../services/api";
import {
  Plus,
  Map,
  Activity,
  ShieldAlert,
  FileText,
  Database,
  Send,
  CheckCircle2,
} from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";

export default function GovtDashboard() {
  const { t } = useLanguage();
  const [outbreaks, setOutbreaks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("heatmap");
  const [showReportModal, setShowReportModal] = useState(false);
  const [outbreakForm, setOutbreakForm] = useState({
    district: "North Delhi",
    state: "Delhi",
    diseaseName: "DENGUE",
    activeCases: "45",
    riskLevel: "HIGH",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await insuranceGovtAPI.getOutbreaks();
      setOutbreaks(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch outbreaks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportOutbreak = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await insuranceGovtAPI.reportOutbreak(outbreakForm);
      setShowReportModal(false);
      fetchData();
    } catch (err) {
      console.error("Outbreak report failed:", err);
    }
  };

  if (loading)
    return (
      <div className="page-loader">
        <div className="spinner" />
        <span>{t("loadingGovt")}</span>
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
            {t("govtTitle")} (Public Health)
          </h1>
          <p style={{ color: "var(--text-muted)" }}>{t("govtSubtitle")}</p>
        </div>
        <button
          className="btn btn-danger"
          onClick={() => setShowReportModal(true)}
        >
          <Plus size={16} /> {t("reportOutbreak")}
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
          { key: "heatmap", label: "Epidemic Heatmap", icon: Map },
          {
            key: "emergency",
            label: "Resource Reallocation",
            icon: ShieldAlert,
          },
          { key: "datafeed", label: "FHIR/ABDM Sync Feed", icon: Database },
          {
            key: "analytics",
            label: "Policy & Pharma Analytics",
            icon: Activity,
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

      {/* Epidemic Heatmap Tab (Phase 2) */}
      {activeTab === "heatmap" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">
              📍 {t("epidemicHeatmap")} & Resource Allocation Index
            </h3>
          </div>
          <div className="dashboard-grid dashboard-grid-2">
            {outbreaks.map((o) => (
              <div
                key={o.id}
                className="glass-card"
                style={{
                  padding: "20px",
                  borderLeft:
                    o.riskLevel === "HIGH" || o.riskLevel === "SEVERE"
                      ? "4px solid var(--risk-critical)"
                      : "4px solid var(--risk-medium)",
                }}
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
                        gap: "8px",
                      }}
                    >
                      <h4 style={{ fontWeight: 800, fontSize: "1.2rem" }}>
                        {o.district}, {o.state}
                      </h4>
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--primary-400)",
                        fontWeight: 700,
                        marginTop: "2px",
                      }}
                    >
                      🦠 {o.diseaseName}
                    </div>
                  </div>
                  <span
                    className={`badge ${o.riskLevel === "HIGH" || o.riskLevel === "SEVERE" ? "badge-risk-critical" : "badge-risk-medium"}`}
                  >
                    {t(o.riskLevel) || o.riskLevel} {t("riskLevel")}
                  </span>
                </div>

                <div
                  style={{
                    background: "var(--bg-input)",
                    padding: "14px",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      {t("activeReportedCases")}
                    </div>
                    <div
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: 900,
                        color: "var(--text-primary)",
                      }}
                    >
                      {o.activeCases}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      textAlign: "right",
                    }}
                  >
                    <span
                      style={{ fontWeight: 700, color: "var(--primary-400)" }}
                    >
                      Resource Allocation Index:
                    </span>
                    <br />
                    <span style={{ color: "var(--text-primary)" }}>
                      Needed: {Math.ceil(o.activeCases / 5)} Staff,{" "}
                      {Math.ceil(o.activeCases / 2)} Beds
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Reallocation Tab (Phase 3) */}
      {activeTab === "emergency" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">
              🚨 SOS Spikes & Resource Reallocation
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
                  HOSPITAL LOAD SPIKE
                </span>
                <span style={{ fontWeight: 800 }}>North Delhi District</span>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Kafka Signal Triggered
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
                  Dengue Outbreak Stress Detected
                </p>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "var(--risk-critical)",
                  }}
                >
                  +45 Active Cases{" "}
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                    }}
                  >
                    (Bed Deficit: 12)
                  </span>
                </div>
              </div>
              <div>
                <button
                  className="btn btn-danger"
                  style={{ background: "var(--risk-critical)" }}
                >
                  <Send size={14} /> Reallocate 20 Beds & Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FHIR/ABDM Sync Feed Tab (Phase 4) */}
      {activeTab === "datafeed" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">
              🔄 Continuous Anonymized Data Feed
            </h3>
          </div>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginBottom: "16px",
            }}
          >
            Aggregated health signals are being pulled from Patient, Hospital,
            Lab, and Ambulance modules. All PII (Personally Identifiable
            Information) is cryptographically stripped before ingestion.
          </p>
          <div
            style={{
              background: "#0D1117",
              padding: "16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(255,255,255,0.05)",
              height: "250px",
              overflowY: "auto",
              fontFamily: "monospace",
              fontSize: "0.75rem",
            }}
            className="custom-scrollbar"
          >
            <div
              style={{
                color: "var(--primary-400)",
                marginBottom: "8px",
                fontWeight: 700,
              }}
            >
              [ABDM Sync Engine - Live Kafka Consumer]
            </div>
            <div
              style={{ color: "var(--text-secondary)", marginBottom: "4px" }}
            >{`> [14:45:01] INGEST: 14 new IPD admissions (Respiratory). PII Stripped.`}</div>
            <div
              style={{ color: "var(--text-secondary)", marginBottom: "4px" }}
            >{`> [14:45:10] LAB: 5 positive Dengue reports (Sector 4). Aggregating...`}</div>
            <div
              style={{ color: "var(--emerald-400)", marginBottom: "4px" }}
            >{`> [14:45:12] ENGINE: Regional Heatmap updated successfully.`}</div>
            <div
              style={{ color: "var(--text-secondary)", marginBottom: "4px" }}
            >{`> [14:45:30] PHARMACY: Spike in Paracetamol sales detected (+45%).`}</div>
            <div
              style={{
                color: "var(--text-secondary)",
                marginBottom: "4px",
                opacity: 0.5,
              }}
              className="animate-pulse"
            >{`> Listening for new streams...`}</div>
          </div>
        </div>
      )}

      {/* Policy & Analytics Tab (Phase 1 & 5) */}
      {activeTab === "analytics" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">
              📊 Policy Planning & Pharma Licensing
            </h3>
          </div>

          <div
            className="dashboard-grid dashboard-grid-3"
            style={{ marginBottom: "24px" }}
          >
            <div className="glass-card stat-card stat-cyan">
              <div className="stat-card-header">
                <span className="stat-card-label">Active Outbreaks</span>
                <div className="stat-card-icon">
                  <ShieldAlert size={18} />
                </div>
              </div>
              <div className="stat-card-value">12 Zones</div>
            </div>
            <div className="glass-card stat-card stat-emerald">
              <div className="stat-card-header">
                <span className="stat-card-label">Pharma Data Licensing</span>
                <div className="stat-card-icon">
                  <Activity size={18} />
                </div>
              </div>
              <div className="stat-card-value">
                ₹2.4 Cr{" "}
                <span style={{ fontSize: "0.7rem", fontWeight: 400 }}>
                  (Monthly)
                </span>
              </div>
            </div>
            <div className="glass-card stat-card stat-amber">
              <div className="stat-card-header">
                <span className="stat-card-label">NGO Portal Access</span>
                <div className="stat-card-icon">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div
                className="stat-card-value"
                style={{ color: "var(--emerald-500)" }}
              >
                14 Active
              </div>
            </div>
          </div>

          <div
            className="glass-card-static"
            style={{ padding: "20px", border: "1px dashed var(--primary-400)" }}
          >
            <h4 style={{ fontWeight: 700, marginBottom: "12px" }}>
              Enterprise Analytics & Data-Sharing Agreements
            </h4>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                marginBottom: "16px",
              }}
            >
              Aggregated, anonymized health data is packaged into
              policy-planning reports. This data is also licensed to Pharma R&D
              under strict RBAC compliance protocols, creating a sustainable
              revenue stream.
            </p>
            <button className="btn btn-primary btn-sm">
              <FileText size={14} /> Generate Resource Allocation Output
            </button>
          </div>
        </div>
      )}

      {/* Outbreak Modal */}
      {showReportModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowReportModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, marginBottom: "16px" }}>
              {t("reportOutbreakTitle")}
            </h3>
            <form
              onSubmit={handleReportOutbreak}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div className="input-group">
                  <label>{t("district")}</label>
                  <input
                    className="input"
                    value={outbreakForm.district}
                    onChange={(e) =>
                      setOutbreakForm({
                        ...outbreakForm,
                        district: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label>{t("state")}</label>
                  <input
                    className="input"
                    value={outbreakForm.state}
                    onChange={(e) =>
                      setOutbreakForm({
                        ...outbreakForm,
                        state: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div className="input-group">
                  <label>{t("diseaseNameLabel")}</label>
                  <select
                    className="input"
                    value={outbreakForm.diseaseName}
                    onChange={(e) =>
                      setOutbreakForm({
                        ...outbreakForm,
                        diseaseName: e.target.value,
                      })
                    }
                  >
                    <option value="DENGUE">Dengue</option>
                    <option value="MALARIA">Malaria</option>
                    <option value="CHOLERA">Cholera</option>
                    <option value="COVID19">COVID-19</option>
                    <option value="TYPHOID">Typhoid</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>{t("activeReportedCases")}</label>
                  <input
                    className="input"
                    type="number"
                    value={outbreakForm.activeCases}
                    onChange={(e) =>
                      setOutbreakForm({
                        ...outbreakForm,
                        activeCases: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>{t("riskLevelLabel")}</label>
                <select
                  className="input"
                  value={outbreakForm.riskLevel}
                  onChange={(e) =>
                    setOutbreakForm({
                      ...outbreakForm,
                      riskLevel: e.target.value,
                    })
                  }
                >
                  <option value="MODERATE">🟡 MODERATE</option>
                  <option value="HIGH">🟠 HIGH</option>
                  <option value="SEVERE">🔴 SEVERE</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowReportModal(false)}
                  style={{ flex: 1 }}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                  style={{ flex: 1 }}
                >
                  {t("submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

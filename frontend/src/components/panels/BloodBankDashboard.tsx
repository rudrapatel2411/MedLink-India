// MedLink India — Blood Bank Network Control Panel
import { useState, useEffect } from "react";
import { hospitalAPI } from "../../services/api";
import {
  Droplets,
  Send,
  ShieldAlert,
  Heart,
  BarChart2,
  Activity,
} from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";

export default function BloodBankDashboard() {
  const { t } = useLanguage();
  const [bloodBanks, setBloodBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inventory");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    patientName: "",
    bloodBankId: "",
    bloodGroup: "O-",
    unitsNeeded: "2",
    urgency: "CRITICAL",
  });
  const [requestSuccess, setRequestSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await hospitalAPI.getBloodBanks();
      const banks = res.data.data || [];
      setBloodBanks(banks);
      if (banks.length > 0) {
        setRequestForm((prev) => ({ ...prev, bloodBankId: banks[0].id }));
      }
    } catch (err) {
      console.error("Failed to fetch blood banks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBlood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hospitalAPI.requestBlood(requestForm);
      setRequestSuccess(
        `🚨 Urgent ${requestForm.unitsNeeded} ${t("unitsCount")} of ${requestForm.bloodGroup} Blood Request Dispatched!`,
      );
      setTimeout(() => {
        setShowRequestModal(false);
        setRequestSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Blood request failed:", err);
    }
  };

  if (loading)
    return (
      <div className="page-loader">
        <div className="spinner" />
        <span>{t("loading")}</span>
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
            {t("bloodTitle")} (Blood Network)
          </h1>
          <p style={{ color: "var(--text-muted)" }}>{t("bloodSubtitle")}</p>
        </div>
        <button
          className="btn btn-danger"
          onClick={() => setShowRequestModal(true)}
        >
          <Droplets size={16} /> {t("urgentBloodSos")}
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
          { key: "inventory", label: "Live Blood Inventory", icon: Droplets },
          { key: "emergency", label: "SOS Dispatch Queue", icon: ShieldAlert },
          { key: "drives", label: "Donation Drives", icon: Heart },
          {
            key: "analytics",
            label: "Compliance & Analytics",
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
                  2
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Inventory Tab */}
      {activeTab === "inventory" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">🩸 Centralized Stock Visibility</h3>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {bloodBanks.map((bank) => (
              <div
                key={bank.id}
                className="glass-card-static"
                style={{ padding: "24px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: "1.2rem" }}>
                      {bank.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      📍 {bank.address}, {bank.city} · 📞 {bank.phone}
                    </p>
                  </div>
                  <span className="badge badge-completed">
                    {t("liveSyncActive")}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                    gap: "10px",
                  }}
                >
                  {Object.entries(bank.stock || {}).map(
                    ([group, count]: [string, any]) => (
                      <div
                        key={group}
                        style={{
                          background:
                            group.includes("-") || count < 5
                              ? "rgba(239, 68, 68, 0.12)"
                              : "rgba(6, 182, 212, 0.08)",
                          border: `1px solid ${group.includes("-") || count < 5 ? "rgba(239, 68, 68, 0.3)" : "var(--border-glass)"}`,
                          padding: "12px",
                          borderRadius: "var(--radius-md)",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "var(--text-muted)",
                          }}
                        >
                          {group}
                        </div>
                        <div
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 900,
                            color:
                              group.includes("-") || count < 5
                                ? "#f87171"
                                : "var(--text-primary)",
                            marginTop: "2px",
                          }}
                        >
                          {count}{" "}
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 400,
                              color: "var(--text-muted)",
                            }}
                          >
                            {t("unitsCount")}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Tab */}
      {activeTab === "emergency" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">
              🚨 Active Hospital & Ambulance Requests
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
                <span className="badge badge-risk-critical">ACTIVE SOS</span>
                <span style={{ fontWeight: 800 }}>
                  City Hospital ER (Trauma Unit)
                </span>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                2 mins ago
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
                  Requested Blood Group:
                </p>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "var(--risk-critical)",
                  }}
                >
                  O-{" "}
                  <span
                    style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}
                  >
                    (4 Units)
                  </span>
                </div>
              </div>
              <div>
                <button
                  className="btn btn-danger"
                  style={{ background: "var(--risk-critical)" }}
                >
                  <Send size={14} /> Dispatch & Sync to Kafka
                </button>
              </div>
            </div>
          </div>

          <div
            className="glass-card-static"
            style={{
              padding: "20px",
              borderLeft: "4px solid var(--emerald-500)",
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
                <span className="badge badge-completed">DISPATCHED</span>
                <span style={{ fontWeight: 800 }}>
                  ALS-04 Ambulance (En route)
                </span>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                14 mins ago
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
                  Dispatched Units:
                </p>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "var(--emerald-500)",
                  }}
                >
                  B+{" "}
                  <span
                    style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}
                  >
                    (2 Units)
                  </span>
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                  }}
                >
                  Live tracked via Kafka
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drives Tab */}
      {activeTab === "drives" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">🩸 Scheduled Donation Drives</h3>
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
                <h4 style={{ fontWeight: 800 }}>Lions Club Mega Drive</h4>
                <span className="badge badge-scheduled">Tomorrow, 10 AM</span>
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "16px",
                }}
              >
                Targeting 500+ units. Priority on O-ve and Plasma.
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <div
                  style={{
                    flex: 1,
                    background: "var(--bg-input)",
                    padding: "10px",
                    borderRadius: "var(--radius-sm)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: "var(--primary-400)",
                    }}
                  >
                    342
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Registered
                  </div>
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
                <h4 style={{ fontWeight: 800 }}>
                  Corporate Park Drive (Sector 4)
                </h4>
                <span className="badge badge-completed">Next Week</span>
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "16px",
                }}
              >
                Targeting IT professionals. Routine replenishment.
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <div
                  style={{
                    flex: 1,
                    background: "var(--bg-input)",
                    padding: "10px",
                    borderRadius: "var(--radius-sm)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: "var(--primary-400)",
                    }}
                  >
                    128
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Registered
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">
              📊 Wastage, Expiry & Compliance Sync
            </h3>
          </div>

          <div
            className="dashboard-grid dashboard-grid-3"
            style={{ marginBottom: "24px" }}
          >
            <div className="glass-card stat-card stat-cyan">
              <div className="stat-card-header">
                <span className="stat-card-label">
                  Overall Fulfillment Rate
                </span>
                <div className="stat-card-icon">
                  <Activity size={18} />
                </div>
              </div>
              <div className="stat-card-value">98.4%</div>
            </div>
            <div className="glass-card stat-card stat-emerald">
              <div className="stat-card-header">
                <span className="stat-card-label">
                  Total Monthly Collections
                </span>
                <div className="stat-card-icon">
                  <Droplets size={18} />
                </div>
              </div>
              <div className="stat-card-value">1,240 Units</div>
            </div>
            <div className="glass-card stat-card stat-amber">
              <div className="stat-card-header">
                <span className="stat-card-label">Wastage / Expiry Rate</span>
                <div className="stat-card-icon">
                  <ShieldAlert size={18} />
                </div>
              </div>
              <div className="stat-card-value">0.8%</div>
            </div>
          </div>

          <div
            className="glass-card-static"
            style={{ padding: "20px", border: "1px dashed var(--primary-400)" }}
          >
            <h4 style={{ fontWeight: 700, marginBottom: "12px" }}>
              Government Resource Planning Link
            </h4>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                marginBottom: "16px",
              }}
            >
              Enterprise Analytics module is actively syncing blood availability
              across states. This allows the Epidemic Control panel to route
              critical supplies during crises.
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
                Kafka Event Bus Connected
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Urgent Request Modal */}
      {showRequestModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRequestModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3
              style={{
                fontWeight: 800,
                marginBottom: "16px",
                color: "#f87171",
              }}
            >
              🚨 {t("requestBloodTitle")}
            </h3>
            {requestSuccess ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px 0",
                  color: "var(--risk-low)",
                  fontWeight: 700,
                }}
              >
                {requestSuccess}
              </div>
            ) : (
              <form
                onSubmit={handleRequestBlood}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <div className="input-group">
                  <label>{t("patientName")}</label>
                  <input
                    className="input"
                    placeholder="Rahul Kumar"
                    value={requestForm.patientName}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        patientName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label>{t("selectBloodBank")}</label>
                  <select
                    className="input"
                    value={requestForm.bloodBankId}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        bloodBankId: e.target.value,
                      })
                    }
                  >
                    {bloodBanks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.city})
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <div className="input-group">
                    <label>{t("bloodGroup")}</label>
                    <select
                      className="input"
                      value={requestForm.bloodGroup}
                      onChange={(e) =>
                        setRequestForm({
                          ...requestForm,
                          bloodGroup: e.target.value,
                        })
                      }
                    >
                      {[
                        "O-",
                        "O+",
                        "A+",
                        "A-",
                        "B+",
                        "B-",
                        "AB+",
                        "AB-",
                        "Plasma",
                        "Platelets",
                      ].map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>{t("unitsNeeded")}</label>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      max="10"
                      value={requestForm.unitsNeeded}
                      onChange={(e) =>
                        setRequestForm({
                          ...requestForm,
                          unitsNeeded: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowRequestModal(false)}
                    style={{ flex: 1 }}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    style={{ flex: 1 }}
                  >
                    <Send size={16} /> {t("dispatchBloodRequest")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

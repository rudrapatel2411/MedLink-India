// MedLink India — Ambulance Fleet Control Panel
import { useState, useEffect } from "react";
import { hospitalAPI } from "../../services/api";
import {
  Navigation,
  CheckCircle2,
  ShieldAlert,
  Truck,
  Map,
  BarChart2,
  Activity,
} from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";

export default function AmbulanceDashboard() {
  const { t } = useLanguage();
  const [fleet, setFleet] = useState<any[]>([]);
  const [activeSOS, setActiveSOS] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("emergency");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fleetRes, sosRes] = await Promise.all([
        hospitalAPI.getAmbulances(),
        hospitalAPI.getActiveSOS(),
      ]);
      setFleet(fleetRes.data.data || []);
      setActiveSOS(sosRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch ambulance data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (sosId: string, newStatus: string) => {
    try {
      await hospitalAPI.updateSOSStatus(sosId, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading)
    return (
      <div className="page-loader">
        <div className="spinner" />
        <span>{t("connectingGps")}</span>
      </div>
    );

  return (
    <div>
      <div style={{ marginBottom: "24px" }} className="animate-in">
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>
          {t("ambulanceTitle")}
        </h1>
        <p style={{ color: "var(--text-muted)" }}>{t("ambulanceSubtitle")}</p>
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
            key: "emergency",
            label: "SOS Emergency Dispatch",
            icon: ShieldAlert,
          },
          { key: "fleet", label: "Fleet Monitoring", icon: Truck },
          { key: "tracking", label: "Live GPS Tracking", icon: Map },
          { key: "billing", label: "Billing & Analytics", icon: BarChart2 },
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
              {tab.key === "emergency" && activeSOS.length > 0 && (
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
                  {activeSOS.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Emergency SOS Dispatch */}
      {activeTab === "emergency" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">🚨 {t("activeDispatchCalls")}</h3>
          </div>
          {activeSOS.length === 0 ? (
            <div
              className="glass-card-static empty-state"
              style={{ marginBottom: "28px" }}
            >
              <div className="empty-state-icon">🚑</div>
              <p className="empty-state-title">{t("noActiveCalls")}</p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "28px",
              }}
            >
              {activeSOS.map((sos) => (
                <div
                  key={sos.id}
                  className="glass-card-static"
                  style={{
                    padding: "20px",
                    borderLeft: "4px solid var(--risk-critical)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "12px",
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
                        <span className="badge badge-risk-critical">
                          {t(sos.status) || sos.status}
                        </span>
                        <span
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          📍 {t("gpsCoordinates")}: {sos.latitude},{" "}
                          {sos.longitude}
                        </span>
                      </div>
                      <h4
                        style={{
                          fontWeight: 800,
                          fontSize: "1.1rem",
                          marginTop: "6px",
                        }}
                      >
                        {sos.patientName} ({sos.patientPhone})
                      </h4>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.9rem",
                          marginTop: "2px",
                        }}
                      >
                        {sos.address}
                      </p>

                      <div
                        style={{
                          background: "rgba(6, 182, 212, 0.05)",
                          border: "1px solid var(--border-glass)",
                          borderRadius: "6px",
                          padding: "12px",
                          marginTop: "12px",
                          display: "flex",
                          gap: "20px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                              textTransform: "uppercase",
                              fontWeight: 700,
                            }}
                          >
                            Live Distance
                          </div>
                          <div
                            style={{
                              fontWeight: 800,
                              color: "var(--text-primary)",
                              fontSize: "1.1rem",
                            }}
                          >
                            2.4 km
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                              textTransform: "uppercase",
                              fontWeight: 700,
                            }}
                          >
                            ETA
                          </div>
                          <div
                            style={{
                              fontWeight: 800,
                              color: "var(--emerald-500)",
                              fontSize: "1.1rem",
                            }}
                          >
                            6 Mins
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                              textTransform: "uppercase",
                              fontWeight: 700,
                            }}
                          >
                            Vehicle
                          </div>
                          <div
                            style={{
                              fontWeight: 800,
                              color: "var(--primary-400)",
                            }}
                          >
                            {sos.assignedAmbulanceNo ||
                              "ALS-04 (Auto-dispatched)"}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          marginTop: "10px",
                        }}
                      >
                        {t("hospitalDestination")}:{" "}
                        <span
                          style={{
                            color: "var(--accent-400)",
                            fontWeight: 700,
                          }}
                        >
                          {sos.assignedHospitalName || "Triage in progress"}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      {sos.status === "ACTIVE" && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            handleStatusToggle(sos.id, "DISPATCHED")
                          }
                        >
                          <Navigation size={14} /> {t("dispatchAmbulance")}
                        </button>
                      )}
                      {sos.status === "DISPATCHED" && (
                        <button
                          className="btn btn-accent btn-sm"
                          onClick={() => handleStatusToggle(sos.id, "ARRIVED")}
                        >
                          <CheckCircle2 size={14} /> {t("markArrived")}
                        </button>
                      )}
                      {sos.status === "ARRIVED" && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleStatusToggle(sos.id, "RESOLVED")}
                        >
                          {t("patientHandedER")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fleet Status */}
      {activeTab === "fleet" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">📡 Fleet Standby & Queues</h3>
          </div>
          <div className="dashboard-grid dashboard-grid-2">
            {fleet.map((amb) => (
              <div
                key={amb.id}
                className="glass-card"
                style={{ padding: "20px" }}
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "var(--radius-md)",
                        background: amb.isAvailable
                          ? "rgba(34, 197, 94, 0.15)"
                          : "rgba(239, 68, 68, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                      }}
                    >
                      🚑
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 800 }}>{amb.vehicleNo}</h4>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Driver: {amb.driverName} (📞 {amb.driverPhone})
                      </p>
                    </div>
                  </div>
                  <span
                    className={`badge ${amb.isAvailable ? "badge-completed" : "badge-risk-critical"}`}
                  >
                    {t(amb.status) || amb.status}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    background: "var(--bg-input)",
                    padding: "10px",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {t("hospital")}:{" "}
                  <span
                    style={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    {amb.hospitalName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live GPS Tracking Stream */}
      {activeTab === "tracking" && (
        <div className="animate-in">
          <h3 style={{ fontWeight: 800, marginBottom: "16px" }}>
            📍 Continuous GPS Stream
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginBottom: "20px",
            }}
          >
            Live location stream is actively broadcasting to the Patient App,
            Hospital ER Panel, and Control Room via Apache Kafka.
          </p>
          <div
            className="glass-card-static"
            style={{
              height: "450px",
              display: "grid",
              gridTemplateColumns: "1fr 350px",
              gap: "20px",
              padding: "20px",
              background: "rgba(10, 15, 20, 0.7)",
              border: "1px solid var(--border-glass)",
            }}
          >
            {/* Radar Map View */}
            <div
              style={{
                position: "relative",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                background: "#050B14",
                border: "1px solid rgba(6, 182, 212, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Grid Background */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              ></div>

              {/* Radar Rings */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  border: "1px solid rgba(6, 182, 212, 0.15)",
                  borderRadius: "50%",
                  transform: "scale(0.8)",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  border: "1px solid rgba(6, 182, 212, 0.15)",
                  borderRadius: "50%",
                  transform: "scale(0.5)",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  border: "1px solid rgba(6, 182, 212, 0.15)",
                  borderRadius: "50%",
                  transform: "scale(0.2)",
                }}
              ></div>

              {/* Radar Sweep Animation (using CSS in a style block) */}
              <style>{`
                @keyframes radar-sweep {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                .radar-sweep {
                  position: absolute;
                  width: 50%;
                  height: 50%;
                  bottom: 50%;
                  right: 50%;
                  transform-origin: 100% 100%;
                  background: conic-gradient(from 180deg at 100% 100%, transparent 0deg, rgba(6, 182, 212, 0.4) 90deg);
                  animation: radar-sweep 4s linear infinite;
                  border-right: 2px solid rgba(6, 182, 212, 0.8);
                }
                @keyframes pulse-dot {
                  0% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.5); opacity: 0.5; }
                  100% { transform: scale(1); opacity: 1; }
                }
                .blip {
                  animation: pulse-dot 2s infinite;
                }
              `}</style>
              <div className="radar-sweep"></div>

              {/* Map Blips */}
              <div
                style={{
                  position: "absolute",
                  top: "35%",
                  left: "45%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  className="blip"
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "var(--primary-400)",
                    borderRadius: "50%",
                    boxShadow: "0 0 15px var(--primary-400)",
                  }}
                ></div>
                <div
                  style={{
                    background: "rgba(6, 182, 212, 0.15)",
                    border: "1px solid rgba(6, 182, 212, 0.3)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    color: "var(--primary-400)",
                    fontWeight: 700,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  ALS-04 (78 km/h)
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "65%",
                  left: "65%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  className="blip"
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "var(--emerald-400)",
                    borderRadius: "50%",
                    boxShadow: "0 0 15px var(--emerald-400)",
                    animationDelay: "1s",
                  }}
                ></div>
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    color: "var(--emerald-400)",
                    fontWeight: 700,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  BLS-12 (Idle)
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "45%",
                  left: "25%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  className="blip"
                  style={{
                    width: "14px",
                    height: "14px",
                    background: "var(--risk-critical)",
                    borderRadius: "50%",
                    boxShadow: "0 0 15px var(--risk-critical)",
                    animationDelay: "0.5s",
                  }}
                ></div>
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    color: "var(--risk-critical)",
                    fontWeight: 700,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  SOS Incident #892
                </div>
              </div>
            </div>

            {/* Live Telemetry Feed */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-glass)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--primary-400)",
                    textTransform: "uppercase",
                    fontWeight: 800,
                    marginBottom: "12px",
                    letterSpacing: "1px",
                  }}
                >
                  Active Unit Telemetry
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
                  >
                    Target ID
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    ALS-04
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
                  >
                    Current Speed
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--emerald-400)",
                    }}
                  >
                    78 km/h
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
                  >
                    Patient SpO2
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--risk-low)",
                    }}
                  >
                    94% (Stable)
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
                  >
                    ETA to Hospital
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--primary-400)",
                    }}
                  >
                    6 Mins
                  </span>
                </div>
              </div>

              {/* Kafka Terminal */}
              <div
                style={{
                  flex: 1,
                  background: "#0D1117",
                  padding: "12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    fontWeight: 800,
                    marginBottom: "10px",
                    letterSpacing: "1px",
                  }}
                >
                  Kafka Event Stream
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    color: "var(--emerald-400)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    overflowY: "auto",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>
                      [14:32:01]
                    </span>{" "}
                    GPS: ALS-04 approaching Zone B.
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>
                      [14:31:45]
                    </span>{" "}
                    Vitals: BP stabilized at 120/80.
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>
                      [14:31:10]
                    </span>{" "}
                    ER notified. Trauma Bay H1 prepped.
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>
                      [14:30:00]
                    </span>{" "}
                    ALS-04 dispatched to Incident #892.
                  </div>
                  <div className="animate-pulse">
                    <span style={{ color: "var(--text-muted)" }}>
                      [14:32:05]
                    </span>{" "}
                    Waiting for payload...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing & Analytics */}
      {activeTab === "billing" && (
        <div className="animate-in">
          <h3 style={{ fontWeight: 800, marginBottom: "16px" }}>
            📊 Settlement & Golden Hour Analytics
          </h3>

          <div
            className="dashboard-grid dashboard-grid-3"
            style={{ marginBottom: "24px" }}
          >
            <div className="glass-card stat-card stat-cyan">
              <div className="stat-card-header">
                <span className="stat-card-label">Avg. Response Time</span>
                <div className="stat-card-icon">
                  <Activity size={18} />
                </div>
              </div>
              <div className="stat-card-value">6m 12s</div>
            </div>
            <div className="glass-card stat-card stat-emerald">
              <div className="stat-card-header">
                <span className="stat-card-label">Insurance Settlements</span>
                <div className="stat-card-icon">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="stat-card-value">₹84,500</div>
            </div>
            <div className="glass-card stat-card stat-amber">
              <div className="stat-card-header">
                <span className="stat-card-label">Golden Hour Success</span>
                <div className="stat-card-icon">
                  <ShieldAlert size={18} />
                </div>
              </div>
              <div className="stat-card-value">94.2%</div>
            </div>
          </div>

          <div className="glass-card-static" style={{ padding: "20px" }}>
            <h4 style={{ fontWeight: 700, marginBottom: "12px" }}>
              Government Resource Planning Sync
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Response-time analytics and trip logs are securely pushed to the
              central Enterprise Analytics module. This data feeds directly into
              municipal traffic routing and healthcare resource planning.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

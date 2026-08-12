// MedLink India — E-Pharmacy & Supply Chain Control Panel (Phase 3)
import { useState, useEffect } from "react";
import { labPharmacyAPI } from "../../services/api";
import {
  ShoppingBag,
  Plus,
  Scan,
  UploadCloud,
  CheckCircle2,
  ShieldAlert,
  Truck,
  BarChart2,
  AlertTriangle,
  Activity,
} from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";

export default function PharmacyDashboard() {
  const { t } = useLanguage();
  const [inventory, setInventory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    patientName: "Rahul Kumar",
    patientPhone: "+91-9988776655",
    medicine: "Paracetamol (Dolo 650)",
    qty: "10",
    address: "42, MG Road, Connaught Place, New Delhi",
  });
  const [isParsing, setIsParsing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  const handleOcrUpload = () => {
    setIsParsing(true);
    setOcrProgress(0);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 25;
      setOcrProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setOrderForm((prev) => ({
            ...prev,
            patientName: "Aarti Sharma (Scanned)",
            patientPhone: "+91-9988112233",
            medicine:
              inventory.length > 0 ? inventory[0].medicineName : "Amoxicillin",
            qty: "15",
          }));
          setIsParsing(false);
          setOcrProgress(0);
        }, 600);
      }
    }, 400);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invRes, ordRes] = await Promise.all([
        labPharmacyAPI.getPharmacyInventory(),
        labPharmacyAPI.getPharmacyOrders(),
      ]);
      setInventory(invRes.data.data || []);
      setOrders(ordRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch pharmacy data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await labPharmacyAPI.createPharmacyOrder({
        patientName: orderForm.patientName,
        patientPhone: orderForm.patientPhone,
        medicines: [
          {
            name: orderForm.medicine,
            qty: parseInt(orderForm.qty),
            price: 32.5,
          },
        ],
        deliveryAddress: orderForm.address,
        totalAmount: 32.5 * parseInt(orderForm.qty),
      });
      setShowOrderModal(false);
      fetchData();
    } catch (err) {
      console.error("Order creation failed:", err);
    }
  };

  if (loading)
    return (
      <div className="page-loader">
        <div className="spinner" />
        <span>{t("loadingPharmacy")}</span>
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
            {t("pharmacyTitle")}
          </h1>
          <p style={{ color: "var(--text-muted)" }}>{t("pharmacySubtitle")}</p>
        </div>
        <button
          className="btn btn-accent"
          onClick={() => setShowOrderModal(true)}
        >
          <Plus size={16} /> {t("fulfillOrder")}
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
          { key: "orders", label: "Prescription Orders", icon: ShoppingBag },
          { key: "inventory", label: "Cold-Chain Inventory", icon: Truck },
          {
            key: "emergency",
            label: "SOS Emergency Dispatch",
            icon: ShieldAlert,
          },
          { key: "analytics", label: "Billing & Analytics", icon: BarChart2 },
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

      {/* Orders Section */}
      {activeTab === "orders" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">
              📦 {t("prescriptionOrders")} (OCR Verifications)
            </h3>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "28px",
            }}
          >
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="glass-card-static"
                style={{ padding: "18px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                      <h4 style={{ fontWeight: 800 }}>{ord.patientName}</h4>
                      <span className="badge badge-completed">
                        {t(ord.status) || ord.status}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      📍 {ord.deliveryAddress}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        marginTop: "6px",
                        flexWrap: "wrap",
                      }}
                    >
                      {ord.medicines?.map((m: any, idx: number) => (
                        <span
                          key={idx}
                          className="symptom-tag"
                          style={{ cursor: "default" }}
                        >
                          {m.name} (x{m.qty})
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 800,
                        color: "var(--accent-400)",
                      }}
                    >
                      ₹{ord.totalAmount}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {t("verifiedDispatched")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory & Expiry Tracker */}
      {activeTab === "inventory" && (
        <div className="animate-in">
          <div className="section-header">
            <h3 className="section-title">❄️ {t("coldChainInventory")}</h3>
          </div>
          <div className="glass-card-static" style={{ overflow: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("medicineLabel")}</th>
                  <th>Batch No</th>
                  <th>{t("categoryLabel")}</th>
                  <th>Stock Qty</th>
                  <th>Unit Price</th>
                  <th>Expiry Date</th>
                  <th>{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const daysLeft = Math.ceil(
                    (new Date(item.expiryDate).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24),
                  );
                  return (
                    <tr key={item.id}>
                      <td
                        style={{
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.medicineName}
                      </td>
                      <td>
                        <code
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-accent)",
                          }}
                        >
                          {item.batchNo}
                        </code>
                      </td>
                      <td>
                        <span className="badge badge-scheduled">
                          {item.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {item.quantity} {t("unitsCount")}
                      </td>
                      <td>₹{item.unitPrice}</td>
                      <td>{item.expiryDate}</td>
                      <td>
                        {daysLeft < 60 ? (
                          <span className="badge badge-risk-critical">
                            ⚠️ {t("expiringAlert")}
                          </span>
                        ) : (
                          <span className="badge badge-completed">
                            {t("inStock")}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Emergency SOS Section */}
      {activeTab === "emergency" && (
        <div className="animate-in">
          <h3 style={{ fontWeight: 800, marginBottom: "16px" }}>
            🚨 Priority Dispatch for Active SOS
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginBottom: "20px",
            }}
          >
            Emergency medicines requested by dispatched ambulances or trauma
            bays. Automatically prioritized via Kafka event bus.
          </p>
          <div
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
                marginBottom: "12px",
              }}
            >
              <div>
                <h4
                  style={{
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    color: "var(--risk-critical)",
                  }}
                >
                  ALS Ambulance #04 (Trauma Bay H1)
                </h4>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Status: On-Route to Patient Location
                </div>
              </div>
              <span className="badge badge-risk-critical">URGENT DISPATCH</span>
            </div>

            <div
              style={{
                background: "rgba(239, 68, 68, 0.05)",
                padding: "12px",
                borderRadius: "var(--radius-md)",
                marginBottom: "16px",
                display: "flex",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <AlertTriangle size={24} color="#ef4444" />
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#ef4444",
                  }}
                >
                  Requested Medicines:
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800 }}>
                  Epinephrine (x2), Normal Saline (x4), Fentanyl Citrate
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{
                width: "100%",
                background: "var(--risk-critical)",
                borderColor: "var(--risk-critical)",
              }}
            >
              Acknowledge & Dispatch Immediately via Drone/Runner
            </button>
          </div>
        </div>
      )}

      {/* Analytics & Billing Section */}
      {activeTab === "analytics" && (
        <div className="animate-in">
          <h3 style={{ fontWeight: 800, marginBottom: "16px" }}>
            📈 Pharmacy Billing & Compliance Analytics
          </h3>

          <div
            className="dashboard-grid dashboard-grid-3"
            style={{ marginBottom: "24px" }}
          >
            <div className="glass-card stat-card stat-cyan">
              <div className="stat-card-header">
                <span className="stat-card-label">Monthly Gross Volume</span>
                <div className="stat-card-icon">
                  <Activity size={18} />
                </div>
              </div>
              <div className="stat-card-value">₹4.2L</div>
            </div>
            <div className="glass-card stat-card stat-emerald">
              <div className="stat-card-header">
                <span className="stat-card-label">
                  Platform Commission (3%)
                </span>
                <div className="stat-card-icon">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="stat-card-value">₹12,600</div>
            </div>
            <div className="glass-card stat-card stat-amber">
              <div className="stat-card-header">
                <span className="stat-card-label">Cold-Chain Breaches</span>
                <div className="stat-card-icon">
                  <AlertTriangle size={18} />
                </div>
              </div>
              <div className="stat-card-value">0</div>
            </div>
          </div>

          <div className="glass-card-static" style={{ padding: "20px" }}>
            <h4 style={{ fontWeight: 700, marginBottom: "12px" }}>
              Inventory Synchronization Engine
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Your inventory levels are live-synced with the central Hospital
              database via Apache Kafka. Orders dispensed from here
              automatically update the Patient Vault as{" "}
              <strong>"FULFILLED"</strong> to prevent prescription reuse.
            </p>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, marginBottom: "16px" }}>
              {t("fulfillOrderTitle")}
            </h3>

            {/* OCR Upload Zone */}
            <div
              style={{
                border: "2px dashed var(--border-glass)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                textAlign: "center",
                marginBottom: "20px",
                background: isParsing
                  ? "rgba(6, 182, 212, 0.05)"
                  : "transparent",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onClick={!isParsing ? handleOcrUpload : undefined}
            >
              {isParsing ? (
                <div>
                  <Scan
                    size={24}
                    color="var(--primary-400)"
                    className="animate-pulse"
                    style={{ margin: "0 auto", marginBottom: "8px" }}
                  />
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--primary-400)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Extracting Text... {ocrProgress}%
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "4px",
                      background: "var(--bg-input)",
                      borderRadius: "4px",
                      marginTop: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${ocrProgress}%`,
                        height: "100%",
                        background: "var(--primary-400)",
                        transition: "width 0.3s",
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div>
                  <UploadCloud
                    size={24}
                    color="var(--text-muted)"
                    style={{ margin: "0 auto", marginBottom: "8px" }}
                  />
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                    Upload Scanned Rx
                  </div>
                  <div
                    style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                  >
                    AI will auto-fill the form details below
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleCreateOrder}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div className="input-group">
                <label>{t("patientName")}</label>
                <input
                  className="input"
                  value={orderForm.patientName}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, patientName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="input-group">
                <label>
                  {t("select")} {t("medicineLabel")}
                </label>
                <select
                  className="input"
                  value={orderForm.medicine}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, medicine: e.target.value })
                  }
                >
                  {inventory.map((i) => (
                    <option key={i.id} value={i.medicineName}>
                      {i.medicineName} (Stock: {i.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>{t("quantityLabel")}</label>
                <input
                  className="input"
                  type="number"
                  min="1"
                  max="50"
                  value={orderForm.qty}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, qty: e.target.value })
                  }
                  required
                />
              </div>
              <div className="input-group">
                <label>{t("deliveryAddressLabel")}</label>
                <textarea
                  className="input"
                  value={orderForm.address}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, address: e.target.value })
                  }
                  rows={2}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowOrderModal(false)}
                  style={{ flex: 1 }}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="btn btn-accent"
                  style={{ flex: 1 }}
                >
                  <ShoppingBag size={16} /> {t("submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

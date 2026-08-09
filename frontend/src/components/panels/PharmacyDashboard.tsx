// MedLink India — E-Pharmacy & Supply Chain Control Panel (Phase 3)
import { useState, useEffect } from 'react';
import { labPharmacyAPI } from '../../services/api';
import { ShoppingBag, Plus } from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

export default function PharmacyDashboard() {
  const { t } = useLanguage();
  const [inventory, setInventory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    patientName: 'Rahul Kumar',
    patientPhone: '+91-9988776655',
    medicine: 'Paracetamol (Dolo 650)',
    qty: '10',
    address: '42, MG Road, Connaught Place, New Delhi',
  });

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
      console.error('Failed to fetch pharmacy data:', err);
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
        medicines: [{ name: orderForm.medicine, qty: parseInt(orderForm.qty), price: 32.5 }],
        deliveryAddress: orderForm.address,
        totalAmount: 32.5 * parseInt(orderForm.qty),
      });
      setShowOrderModal(false);
      fetchData();
    } catch (err) {
      console.error('Order creation failed:', err);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /><span>{t('loadingPharmacy')}</span></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }} className="animate-in">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('pharmacyTitle')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('pharmacySubtitle')}</p>
        </div>
        <button className="btn btn-accent" onClick={() => setShowOrderModal(true)}>
          <Plus size={16} /> {t('fulfillOrder')}
        </button>
      </div>

      {/* Orders Section */}
      <div className="section-header">
        <h3 className="section-title">📦 {t('prescriptionOrders')}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {orders.map(ord => (
          <div key={ord.id} className="glass-card-static" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 style={{ fontWeight: 800 }}>{ord.patientName}</h4>
                  <span className="badge badge-completed">{t(ord.status) || ord.status}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>📍 {ord.deliveryAddress}</p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {ord.medicines?.map((m: any, idx: number) => (
                    <span key={idx} className="symptom-tag" style={{ cursor: 'default' }}>
                      {m.name} (x{m.qty})
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-400)' }}>₹{ord.totalAmount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('verifiedDispatched')}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory & Expiry Tracker */}
      <div className="section-header">
        <h3 className="section-title">📊 {t('coldChainInventory')}</h3>
      </div>
      <div className="glass-card-static" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('medicineLabel')}</th>
              <th>Batch No</th>
              <th>{t('categoryLabel')}</th>
              <th>Stock Qty</th>
              <th>Unit Price</th>
              <th>Expiry Date</th>
              <th>{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => {
              const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <tr key={item.id}>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.medicineName}</td>
                  <td><code style={{ fontSize: '0.8rem', color: 'var(--text-accent)' }}>{item.batchNo}</code></td>
                  <td><span className="badge badge-scheduled">{item.category}</span></td>
                  <td style={{ fontWeight: 700 }}>{item.quantity} {t('unitsCount')}</td>
                  <td>₹{item.unitPrice}</td>
                  <td>{item.expiryDate}</td>
                  <td>
                    {daysLeft < 60 ? (
                      <span className="badge badge-risk-critical">⚠️ {t('expiringAlert')}</span>
                    ) : (
                      <span className="badge badge-completed">{t('inStock')}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, marginBottom: '16px' }}>{t('fulfillOrderTitle')}</h3>
            <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label>{t('patientName')}</label>
                <input className="input" value={orderForm.patientName} onChange={e => setOrderForm({ ...orderForm, patientName: e.target.value })} required />
              </div>
              <div className="input-group">
                <label>{t('select')} {t('medicineLabel')}</label>
                <select className="input" value={orderForm.medicine} onChange={e => setOrderForm({ ...orderForm, medicine: e.target.value })}>
                  {inventory.map(i => (
                    <option key={i.id} value={i.medicineName}>{i.medicineName} (Stock: {i.quantity})</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>{t('quantityLabel')}</label>
                <input className="input" type="number" min="1" max="50" value={orderForm.qty} onChange={e => setOrderForm({ ...orderForm, qty: e.target.value })} required />
              </div>
              <div className="input-group">
                <label>{t('deliveryAddressLabel')}</label>
                <textarea className="input" value={orderForm.address} onChange={e => setOrderForm({ ...orderForm, address: e.target.value })} rows={2} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowOrderModal(false)} style={{ flex: 1 }}>{t('cancel')}</button>
                <button type="submit" className="btn btn-accent" style={{ flex: 1 }}><ShoppingBag size={16} /> {t('submit')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

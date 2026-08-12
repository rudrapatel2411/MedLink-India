// MedLink India — API Client (Axios Instance)
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medlink_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('medlink_token');
      localStorage.removeItem('medlink_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─────────────── AUTH APIs ───────────────
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  updatePatientProfile: (data: any) => api.put('/auth/patient-profile', data),
  updateDoctorProfile: (data: any) => api.put('/auth/doctor-profile', data),
};

// ─────────────── APPOINTMENT APIs ───────────────
export const appointmentAPI = {
  create: (data: any) => api.post('/appointments', data),
  getMyAppointments: (params?: any) => api.get('/appointments/my', { params }),
  getOpdQueue: (doctorId: string) => api.get(`/appointments/opd-queue/${doctorId}`),
  getById: (id: string) => api.get(`/appointments/${id}`),
  updateStatus: (id: string, data: any) => api.put(`/appointments/${id}/status`, data),
  getAvailableDoctors: (params?: any) => api.get('/appointments/doctors/available', { params }),
};

// ─────────────── PRESCRIPTION APIs ───────────────
export const prescriptionAPI = {
  create: (data: any) => api.post('/prescriptions', data),
  getMyPrescriptions: () => api.get('/prescriptions/my'),
  getById: (id: string) => api.get(`/prescriptions/${id}`),
  updateStatus: (id: string, data: any) => api.put(`/prescriptions/${id}/status`, data),
};

// ─────────────── HEALTH RECORD APIs ───────────────
export const healthRecordAPI = {
  create: (data: any) => api.post('/health-records', data),
  getMyRecords: (params?: any) => api.get('/health-records/my', { params }),
  deleteRecord: (id: string) => api.delete(`/health-records/${id}`),
  getPatientRecords: (patientId: string) => api.get(`/health-records/patient/${patientId}`),
  requestConsent: (data: any) => api.post('/health-records/consent/request', data),
  respondToConsent: (id: string, data: any) => api.put(`/health-records/consent/${id}/respond`, data),
  getMyConsents: () => api.get('/health-records/consent/my'),
};

// ─────────────── SYMPTOM TRIAGE APIs ───────────────
export const symptomAPI = {
  check: (data: { symptoms: string[] }) => api.post('/symptoms/check', data),
  getHistory: () => api.get('/symptoms/history'),
};

export const emergencyAPI = {
  getHospitals: () => api.get('/emergency/hospitals'),
};

// ─────────────── PHASE 2: HOSPITAL & EMERGENCY APIs ───────────────
export const hospitalAPI = {
  getHospitals: () => api.get('/hospitals'),
  updateBeds: (id: string, data: any) => api.put(`/hospitals/${id}/beds`, data),
  triggerSOS: (data: any) => api.post('/emergency/sos', data),
  getActiveSOS: () => api.get('/emergency/sos/active'),
  updateSOSStatus: (id: string, data: any) => api.put(`/emergency/sos/${id}/status`, data),
  getAmbulances: () => api.get('/ambulances'),
  getBloodBanks: () => api.get('/blood-banks'),
  requestBlood: (data: any) => api.post('/blood-banks/request', data),
};

// ─────────────── PHASE 3: LAB & PHARMACY APIs ───────────────
export const labPharmacyAPI = {
  getLabReports: () => api.get('/labs/reports'),
  createLabReport: (data: any) => api.post('/labs/reports', data),
  getPharmacyInventory: () => api.get('/pharmacy/inventory'),
  createPharmacyOrder: (data: any) => api.post('/pharmacy/orders', data),
  getPharmacyOrders: () => api.get('/pharmacy/orders'),
};

// ─────────────── PHASE 4: INSURANCE, GOVT & ADMIN APIs ───────────────
export const insuranceGovtAPI = {
  getClaims: () => api.get('/insurance/claims'),
  submitClaim: (data: any) => api.post('/insurance/claims', data),
  getOutbreaks: () => api.get('/govt/outbreaks'),
  reportOutbreak: (data: any) => api.post('/govt/outbreaks', data),
  getAdminStats: () => api.get('/admin/stats'),
};

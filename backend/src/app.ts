// MedLink India — Express Application Configuration
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { ApiError, ApiResponse } from './utils/ApiResponse';

// Load env vars
dotenv.config();

// Import Routes
import authRoutes from './routes/auth.routes';
import appointmentRoutes from './routes/appointment.routes';
import prescriptionRoutes from './routes/prescription.routes';
import healthRecordRoutes from './routes/healthRecord.routes';
import symptomRoutes from './routes/symptom.routes';
import hospitalEmergencyRoutes from './routes/hospitalEmergency.routes';
import labPharmacyRoutes from './routes/labPharmacy.routes';
import insuranceGovtRoutes from './routes/insuranceGovt.routes';

const app = express();

// ─────────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─────────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────────
const API_PREFIX = '/api/v1';

app.get(`${API_PREFIX}/health`, (_req, res) => {
  res.json(new ApiResponse(200, 'MedLink India Master API is running! 🏥', {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }));
});

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/appointments`, appointmentRoutes);
app.use(`${API_PREFIX}/prescriptions`, prescriptionRoutes);
app.use(`${API_PREFIX}/health-records`, healthRecordRoutes);
app.use(`${API_PREFIX}/symptoms`, symptomRoutes);

// Phase 2, 3, 4 Ecosystem Routes
app.use(API_PREFIX, hospitalEmergencyRoutes);
app.use(API_PREFIX, labPharmacyRoutes);
app.use(API_PREFIX, insuranceGovtRoutes);

// ─────────────────────────────────────────────────
// 404 HANDLER
// ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json(new ApiResponse(404, 'Route not found.'));
});

// ─────────────────────────────────────────────────
// GLOBAL ERROR HANDLER
// ─────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Invalid JSON payload in request body.',
    });
  }

  console.error('❌ Unhandled Error:', err);
  res.status(500).json({
    success: false,
    statusCode: 500,
    message: err.message || 'Internal server error.',
  });
});

export default app;

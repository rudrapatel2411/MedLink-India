// MedLink India — Health Record & Consent Routes
import { Router } from 'express';
import {
  createHealthRecord,
  getMyHealthRecords,
  deleteHealthRecord,
  getPatientRecords,
  requestConsent,
  respondToConsent,
  getMyConsents,
} from '../controllers/healthRecord.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// Health Records CRUD
router.post('/', createHealthRecord);
router.get('/my', getMyHealthRecords);
router.delete('/:id', deleteHealthRecord);
router.get('/patient/:patientId', authorize('DOCTOR'), getPatientRecords);

// Consent Management
router.post('/consent/request', authorize('DOCTOR'), requestConsent);
router.put('/consent/:id/respond', authorize('PATIENT'), respondToConsent);
router.get('/consent/my', getMyConsents);

export default router;

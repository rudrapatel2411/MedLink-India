// MedLink India — Prescription Routes
import { Router } from 'express';
import {
  createPrescription,
  getMyPrescriptions,
  getPrescriptionById,
  updatePrescriptionStatus,
} from '../controllers/prescription.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', authorize('DOCTOR'), createPrescription);
router.get('/my', getMyPrescriptions);
router.get('/:id', getPrescriptionById);
router.put('/:id/status', authorize('DOCTOR', 'PHARMACIST'), updatePrescriptionStatus);

export default router;

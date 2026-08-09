// MedLink India — Insurance, Govt Outbreaks & Admin Routes
import { Router } from 'express';
import {
  getInsuranceClaims,
  submitInsuranceClaim,
  getOutbreaks,
  reportOutbreak,
  getAdminStats,
} from '../controllers/insuranceGovt.controller';

const router = Router();

router.get('/insurance/claims', getInsuranceClaims);
router.post('/insurance/claims', submitInsuranceClaim);
router.get('/govt/outbreaks', getOutbreaks);
router.post('/govt/outbreaks', reportOutbreak);
router.get('/admin/stats', getAdminStats);

export default router;

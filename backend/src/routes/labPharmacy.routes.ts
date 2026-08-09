// MedLink India — Diagnostic Lab & E-Pharmacy Routes
import { Router } from 'express';
import {
  getLabReports,
  createLabReport,
  getPharmacyInventory,
  createPharmacyOrder,
  getPharmacyOrders,
} from '../controllers/labPharmacy.controller';

const router = Router();

router.get('/labs/reports', getLabReports);
router.post('/labs/reports', createLabReport);
router.get('/pharmacy/inventory', getPharmacyInventory);
router.post('/pharmacy/orders', createPharmacyOrder);
router.get('/pharmacy/orders', getPharmacyOrders);

export default router;

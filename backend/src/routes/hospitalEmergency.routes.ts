// MedLink India — Hospital & Emergency Routes
import { Router } from 'express';
import {
  getHospitals,
  updateHospitalBeds,
  triggerSOS,
  getActiveSOS,
  updateSOSStatus,
  getAmbulances,
  getBloodBanks,
  requestBlood,
} from '../controllers/hospitalEmergency.controller';

const router = Router();

router.get('/hospitals', getHospitals);
router.put('/hospitals/:id/beds', updateHospitalBeds);
router.post('/emergency/sos', triggerSOS);
router.get('/emergency/sos/active', getActiveSOS);
router.put('/emergency/sos/:id/status', updateSOSStatus);
router.get('/ambulances', getAmbulances);
router.get('/blood-banks', getBloodBanks);
router.post('/blood-banks/request', requestBlood);

export default router;

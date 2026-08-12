import { Router } from 'express';
import { getHospitalIPD, addNursingLog, addDoctorRound, generateBill } from '../controllers/ipd.controller';

const router = Router();

router.get('/ipd/:hospitalId', getHospitalIPD);
router.post('/ipd/:bedId/nursing-log', addNursingLog);
router.post('/ipd/:bedId/doctor-round', addDoctorRound);
router.post('/ipd/:bedId/bill', generateBill);

export default router;

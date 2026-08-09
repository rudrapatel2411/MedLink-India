// MedLink India — AI Symptom Triage Routes
import { Router } from 'express';
import { checkSymptoms, getSymptomHistory } from '../controllers/symptom.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/check', checkSymptoms);
router.get('/history', getSymptomHistory);

export default router;

// MedLink India — Auth Routes
import { Router } from 'express';
import { register, login, getMe, updateProfile, updatePatientProfile, updateDoctorProfile } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.put('/patient-profile', authenticate, updatePatientProfile);
router.put('/doctor-profile', authenticate, updateDoctorProfile);

export default router;

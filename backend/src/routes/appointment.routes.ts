// MedLink India — Appointment Routes
import { Router } from 'express';
import {
  createAppointment,
  getMyAppointments,
  getOpdQueue,
  getAppointmentById,
  updateAppointmentStatus,
  getAvailableDoctors,
} from '../controllers/appointment.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate); // All appointment routes require auth

router.post('/', authorize('PATIENT'), createAppointment);
router.get('/my', getMyAppointments);
router.get('/doctors/available', getAvailableDoctors);
router.get('/opd-queue/:doctorId', getOpdQueue);
router.get('/:id', getAppointmentById);
router.put('/:id/status', authorize('DOCTOR', 'HOSPITAL_ADMIN'), updateAppointmentStatus);

export default router;

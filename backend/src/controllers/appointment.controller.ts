// MedLink India — Appointment Controller (OPD Queue, Booking, Status)
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { ApiResponse, ApiError, asyncHandler } from '../utils/ApiResponse';
import { emitNotification } from '../socket';

/**
 * POST /api/v1/appointments
 * Book a new appointment (Patient books with a Doctor)
 */
export const createAppointment = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { doctorId, scheduledDate, scheduledTime, type, chiefComplaint } = req.body;

  if (!doctorId || !scheduledDate || !scheduledTime) {
    throw new ApiError(400, 'doctorId, scheduledDate, and scheduledTime are required.');
  }

  // Verify doctor exists
  const doctor = await prisma.user.findFirst({
    where: { id: doctorId, role: 'DOCTOR' },
  });
  if (!doctor) {
    throw new ApiError(404, 'Doctor not found.');
  }

  // Generate token number for the day
  const todayAppointments = await prisma.appointment.count({
    where: {
      doctorId,
      scheduledDate,
      status: { not: 'CANCELLED' },
    },
  });
  const tokenNumber = todayAppointments + 1;

  const appointment = await prisma.appointment.create({
    data: {
      patientId: req.user!.userId,
      doctorId,
      scheduledDate,
      scheduledTime,
      type: type || 'OPD',
      chiefComplaint,
      tokenNumber,
    },
    include: {
      patient: { select: { id: true, firstName: true, lastName: true, email: true } },
      doctor: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });

  // Emit notification to Doctor's OPD Queue
  emitNotification('appointment:booked', {
    title: '📅 NEW APPOINTMENT BOOKED',
    message: `Patient ${appointment.patient?.firstName} booked an appointment for ${scheduledTime}`,
    data: appointment,
  });

  res.status(201).json(
    new ApiResponse(201, 'Appointment booked successfully.', appointment)
  );
});

/**
 * GET /api/v1/appointments/my
 * Get all appointments for the logged-in user (patient or doctor)
 */
export const getMyAppointments = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const userId = req.user!.userId;
  const role = req.user!.role;
  const { status, date } = req.query;

  const whereClause: any = {};

  if (role === 'DOCTOR') {
    whereClause.doctorId = userId;
  } else {
    whereClause.patientId = userId;
  }

  if (status) whereClause.status = status as string;
  if (date) whereClause.scheduledDate = date as string;

  const appointments = await prisma.appointment.findMany({
    where: whereClause,
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true, email: true, phone: true, patientProfile: true },
      },
      doctor: {
        select: { id: true, firstName: true, lastName: true, email: true, doctorProfile: true },
      },
      prescriptions: { include: { medicines: true } },
    },
    orderBy: [{ scheduledDate: 'desc' }, { tokenNumber: 'asc' }],
  });

  res.json(new ApiResponse(200, 'Appointments fetched.', appointments));
});

/**
 * GET /api/v1/appointments/opd-queue/:doctorId
 * Get OPD queue for a specific doctor (today)
 */
export const getOpdQueue = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { doctorId } = req.params;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const queue = await prisma.appointment.findMany({
    where: {
      doctorId: doctorId as string,
      scheduledDate: today,
      status: { in: ['SCHEDULED', 'IN_QUEUE', 'IN_PROGRESS'] },
    },
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true, phone: true, patientProfile: true },
      },
    },
    orderBy: { tokenNumber: 'asc' },
  });

  res.json(new ApiResponse(200, 'OPD queue fetched.', queue));
});

/**
 * GET /api/v1/appointments/:id
 */
export const getAppointmentById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: req.params.id as string },
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true, email: true, phone: true, patientProfile: true },
      },
      doctor: {
        select: { id: true, firstName: true, lastName: true, email: true, doctorProfile: true },
      },
      prescriptions: { include: { medicines: true } },
    },
  });

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found.');
  }

  res.json(new ApiResponse(200, 'Appointment details fetched.', appointment));
});

/**
 * PUT /api/v1/appointments/:id/status
 * Update appointment status (Doctor moves patient through queue)
 */
export const updateAppointmentStatus = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { status, vitals, diagnosis, notes } = req.body;

  const validStatuses = ['SCHEDULED', 'IN_QUEUE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Allowed: ${validStatuses.join(', ')}`);
  }

  const appointment = await prisma.appointment.update({
    where: { id: req.params.id as string },
    data: {
      status,
      ...(vitals && { vitals: JSON.stringify(vitals) }),
      ...(diagnosis && { diagnosis }),
      ...(notes && { notes }),
    },
    include: {
      patient: { select: { id: true, firstName: true, lastName: true } },
      doctor: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  res.json(new ApiResponse(200, `Appointment status updated to ${status}.`, appointment));
});

/**
 * GET /api/v1/appointments/doctors/available
 * Get available doctors for appointment booking
 */
export const getAvailableDoctors = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { specialization } = req.query;

  const whereClause: any = {
    role: 'DOCTOR',
    isActive: true,
    doctorProfile: {
      isAvailableNow: true,
    },
  };

  if (specialization) {
    whereClause.doctorProfile.specialization = {
      contains: specialization as string,
    };
  }

  const doctors = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatar: true,
      doctorProfile: true,
    },
  });

  res.json(new ApiResponse(200, 'Available doctors fetched.', doctors));
});

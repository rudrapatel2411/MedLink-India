// MedLink India — Prescription Controller (Voice Rx Builder, Smart Prescriptions)
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { ApiResponse, ApiError, asyncHandler } from '../utils/ApiResponse';
import { emitNotification } from '../socket';

/**
 * POST /api/v1/prescriptions
 * Doctor creates a prescription for a patient
 */
export const createPrescription = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { patientId, appointmentId, diagnosis, notes, validUntil, medicines } = req.body;

  if (!patientId || !medicines || !Array.isArray(medicines) || medicines.length === 0) {
    throw new ApiError(400, 'patientId and at least one medicine are required.');
  }

  // Verify patient exists
  const patient = await prisma.user.findFirst({ where: { id: patientId, role: 'PATIENT' } });
  if (!patient) {
    throw new ApiError(404, 'Patient not found.');
  }

  const prescription = await prisma.prescription.create({
    data: {
      patientId,
      doctorId: req.user!.userId,
      appointmentId: appointmentId || null,
      diagnosis,
      notes,
      validUntil,
      medicines: {
        create: medicines.map((med: any) => ({
          medicineName: med.medicineName,
          dosage: med.dosage || '',
          frequency: med.frequency || '',
          duration: med.duration || '',
          instructions: med.instructions || null,
          quantity: med.quantity ? parseInt(med.quantity) : null,
        })),
      },
    },
    include: {
      medicines: true,
      patient: { select: { id: true, firstName: true, lastName: true } },
      doctor: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  // Update doctor consultation count
  await prisma.doctorProfile.updateMany({
    where: { userId: req.user!.userId },
    data: { totalConsultations: { increment: 1 } },
  });

  // Broadcast prescription creation to Patient Vault & E-Pharmacy Desk
  emitNotification('prescription:created', {
    title: '👨‍⚕️ NEW DIGITAL PRESCRIPTION CREATED',
    message: `Dr. ${prescription.doctor?.lastName || 'Consultant'} prescribed ${medicines.length} medicine(s) for ${prescription.patient?.firstName || 'Patient'}`,
    data: prescription,
  });

  res.status(201).json(
    new ApiResponse(201, 'Prescription created successfully.', prescription)
  );
});

/**
 * GET /api/v1/prescriptions/my
 */
export const getMyPrescriptions = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const userId = req.user!.userId;
  const role = req.user!.role;

  const whereClause: any = {};
  if (role === 'DOCTOR') {
    whereClause.doctorId = userId;
  } else {
    whereClause.patientId = userId;
  }

  const prescriptions = await prisma.prescription.findMany({
    where: whereClause,
    include: {
      medicines: true,
      patient: { select: { id: true, firstName: true, lastName: true } },
      doctor: { select: { id: true, firstName: true, lastName: true, doctorProfile: { select: { specialization: true } } } },
      appointment: { select: { id: true, scheduledDate: true, type: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(new ApiResponse(200, 'Prescriptions fetched.', prescriptions));
});

/**
 * GET /api/v1/prescriptions/:id
 */
export const getPrescriptionById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const prescription = await prisma.prescription.findUnique({
    where: { id: req.params.id as string },
    include: {
      medicines: true,
      patient: { select: { id: true, firstName: true, lastName: true, email: true, patientProfile: true } },
      doctor: { select: { id: true, firstName: true, lastName: true, doctorProfile: true } },
      appointment: true,
    },
  });

  if (!prescription) {
    throw new ApiError(404, 'Prescription not found.');
  }

  res.json(new ApiResponse(200, 'Prescription details fetched.', prescription));
});

/**
 * PUT /api/v1/prescriptions/:id/status
 */
export const updatePrescriptionStatus = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { status } = req.body;
  const validStatuses = ['ACTIVE', 'DISPENSED', 'EXPIRED', 'CANCELLED'];

  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Allowed: ${validStatuses.join(', ')}`);
  }

  const prescription = await prisma.prescription.update({
    where: { id: req.params.id as string },
    data: { status },
    include: { medicines: true },
  });

  res.json(new ApiResponse(200, `Prescription status updated to ${status}.`, prescription));
});

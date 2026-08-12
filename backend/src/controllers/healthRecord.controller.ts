// MedLink India — Health Record & Consent Controller (ABHA Vault)
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { ApiResponse, ApiError, asyncHandler } from '../utils/ApiResponse';

/**
 * POST /api/v1/health-records
 * Upload a health record to the patient's ABHA Vault
 */
export const createHealthRecord = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { recordType, title, description, fileUrl, fileType, metadata, tags } = req.body;

  if (!recordType || !title) {
    throw new ApiError(400, 'recordType and title are required.');
  }

  const validTypes = ['LAB_REPORT', 'PRESCRIPTION', 'DISCHARGE_SUMMARY', 'IMAGING', 'VACCINATION', 'INSURANCE_DOC', 'OTHER'];
  if (!validTypes.includes(recordType)) {
    throw new ApiError(400, `Invalid recordType. Allowed: ${validTypes.join(', ')}`);
  }

  const record = await prisma.healthRecord.create({
    data: {
      userId: req.user!.userId,
      recordType,
      title,
      description,
      fileUrl,
      fileType,
      metadata: metadata ? JSON.stringify(metadata) : null,
      tags: tags ? JSON.stringify(tags) : null,
    },
  });

  res.status(201).json(new ApiResponse(201, 'Health record created.', record));
});

/**
 * GET /api/v1/health-records/my
 */
export const getMyHealthRecords = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { recordType } = req.query;

  const whereClause: any = { userId: req.user!.userId };
  if (recordType) whereClause.recordType = recordType as string;

  const records = await prisma.healthRecord.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  res.json(new ApiResponse(200, 'Health records fetched.', records));
});

/**
 * DELETE /api/v1/health-records/:id
 */
export const deleteHealthRecord = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const record = await prisma.healthRecord.findUnique({ where: { id: req.params.id as string } });

  if (!record) throw new ApiError(404, 'Record not found.');
  if (record.userId !== req.user!.userId) throw new ApiError(403, 'Not authorized.');

  await prisma.healthRecord.delete({ where: { id: req.params.id as string } });

  res.json(new ApiResponse(200, 'Health record deleted.'));
});

/**
 * GET /api/v1/health-records/patient/:patientId
 * Doctor views patient's health records (requires consent)
 */
export const getPatientRecords = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { patientId } = req.params;

  // Check if doctor has active consent
  const consent = await prisma.consentRequest.findFirst({
    where: {

      requesterId: req.user!.userId,
      patientId: patientId as string,
      status: 'GRANTED',
      expiresAt: { gt: new Date() },
    },
  });

  if (!consent) {
    throw new ApiError(403, 'No active consent from this patient. Request consent first.');
  }

  const allowedTypes = JSON.parse(consent.recordTypes);

  const records = await prisma.healthRecord.findMany({
    where: {
      userId: patientId as string,
      recordType: { in: allowedTypes },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(new ApiResponse(200, 'Patient records fetched with consent.', records));
});

// ──────────────────── CONSENT MANAGEMENT ────────────────────

/**
 * POST /api/v1/health-records/consent/request
 * Doctor requests consent to view patient records using ABHA ID
 */
export const requestConsent = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { patientId: abhaId, purpose, recordTypes, duration } = req.body;

  if (!abhaId || !purpose) {
    throw new ApiError(400, 'ABHA ID and purpose are required.');
  }

  // Find patient by ABHA ID or fallback to UUID for backward compatibility
  let patient = await prisma.user.findFirst({ where: { abhaId } });
  if (!patient) {
    patient = await prisma.user.findUnique({ where: { id: abhaId } });
  }

  if (!patient || patient.role !== 'PATIENT') {
    throw new ApiError(404, 'Invalid ABHA ID. No patient found.');
  }

  const durationMap: Record<string, number> = {
    '15_MIN': 15 * 60 * 1000,
    '1_HOUR': 60 * 60 * 1000,
    '1_DAY': 24 * 60 * 60 * 1000,
    '7_DAYS': 7 * 24 * 60 * 60 * 1000,
  };

  const consent = await prisma.consentRequest.create({
    data: {
      requesterId: req.user!.userId,
      patientId: patient.id,
      purpose,
      recordTypes: JSON.stringify(recordTypes || ['LAB_REPORT', 'PRESCRIPTION', 'DISCHARGE_SUMMARY']),
      duration: duration || '1_HOUR',
    },
    include: {
      requester: { select: { id: true, firstName: true, lastName: true, doctorProfile: { select: { specialization: true } } } },
      patient: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  res.status(201).json(new ApiResponse(201, 'Consent request sent to patient.', consent));
});

/**
 * PUT /api/v1/health-records/consent/:id/respond
 * Patient grants or denies a consent request
 */
export const respondToConsent = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { action } = req.body; // 'GRANT' or 'DENY'

  if (!action || !['GRANT', 'DENY'].includes(action)) {
    throw new ApiError(400, 'action must be GRANT or DENY.');
  }

  const consentReq = await prisma.consentRequest.findUnique({ where: { id: req.params.id as string } });
  if (!consentReq) throw new ApiError(404, 'Consent request not found.');
  if (consentReq.patientId !== req.user!.userId) throw new ApiError(403, 'Not authorized.');

  const durationMap: Record<string, number> = {
    '15_MIN': 15 * 60 * 1000,
    '1_HOUR': 60 * 60 * 1000,
    '1_DAY': 24 * 60 * 60 * 1000,
    '7_DAYS': 7 * 24 * 60 * 60 * 1000,
  };

  const durationMs = durationMap[consentReq.duration || '1_HOUR'] || durationMap['1_HOUR'];

  const consent = await prisma.consentRequest.update({
    where: { id: req.params.id as string },
    data: {
      status: action === 'GRANT' ? 'GRANTED' : 'DENIED',
      grantedAt: action === 'GRANT' ? new Date() : null,
      expiresAt: action === 'GRANT' ? new Date(Date.now() + durationMs) : null,
    },
  });

  res.json(new ApiResponse(200, `Consent ${action === 'GRANT' ? 'granted' : 'denied'}.`, consent));
});

/**
 * GET /api/v1/health-records/consent/my
 * Get all consent requests for the logged-in user
 */
export const getMyConsents = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const userId = req.user!.userId;
  const role = req.user!.role;

  const consents = await prisma.consentRequest.findMany({
    where: role === 'DOCTOR' ? { requesterId: userId } : { patientId: userId },
    include: {
      requester: { select: { id: true, firstName: true, lastName: true, doctorProfile: { select: { specialization: true } } } },
      patient: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(new ApiResponse(200, 'Consent requests fetched.', consents));
});

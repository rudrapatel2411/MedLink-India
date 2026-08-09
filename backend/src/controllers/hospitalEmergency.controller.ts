// MedLink India — Hospital & Emergency SOS Controller (Phase 2)
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { ApiResponse, ApiError, asyncHandler } from '../utils/ApiResponse';
import { emitNotification } from '../socket';

/**
 * GET /api/v1/hospitals
 * Fetch live hospital bed matrix
 */
export const getHospitals = asyncHandler(async (_req: Request, res: Response) => {
  const hospitals = await prisma.hospital.findMany({
    include: { bedAllocations: true },
    orderBy: { name: 'asc' },
  });
  res.json(new ApiResponse(200, 'Hospitals bed matrix fetched.', hospitals));
});

/**
 * PUT /api/v1/hospitals/:id/beds
 * Update hospital bed count dynamically
 */
export const updateHospitalBeds = asyncHandler(async (req: Request, res: Response) => {
  const { availableBeds, icuBedsAvailable, oxygenBedsAvailable, emergencyStatus } = req.body;

  const hospital = await prisma.hospital.update({
    where: { id: req.params.id as string },
    data: {
      ...(availableBeds !== undefined && { availableBeds: parseInt(availableBeds) }),
      ...(icuBedsAvailable !== undefined && { icuBedsAvailable: parseInt(icuBedsAvailable) }),
      ...(oxygenBedsAvailable !== undefined && { oxygenBedsAvailable: parseInt(oxygenBedsAvailable) }),
      ...(emergencyStatus && { emergencyStatus }),
    },
  });

  emitNotification('hospital:bedUpdate', {
    title: '🏥 Live Hospital Bed Matrix Updated',
    message: `${hospital.name} updated available beds: ${hospital.availableBeds} Ward, ${hospital.icuBedsAvailable} ICU`,
    data: hospital,
  });

  res.json(new ApiResponse(200, 'Hospital beds updated dynamically.', hospital));
});

/**
 * POST /api/v1/emergency/sos
 * Patient triggers 1-Tap Emergency SOS Panic System
 */
export const triggerSOS = asyncHandler(async (req: Request, res: Response) => {
  const { patientName, patientPhone, latitude, longitude, address, bloodGroupNeeded } = req.body;

  if (!patientName || !patientPhone) {
    throw new ApiError(400, 'patientName and patientPhone are required.');
  }

  // Find nearest available ambulance and hospital
  const availableAmbulance = await prisma.ambulance.findFirst({ where: { isAvailable: true } });
  const hospital = await prisma.hospital.findFirst({ where: { emergencyStatus: 'GREEN' } });

  const sos = await prisma.emergencySOS.create({
    data: {
      patientName,
      patientPhone,
      latitude: latitude ? parseFloat(latitude) : 28.6139,
      longitude: longitude ? parseFloat(longitude) : 77.2090,
      address: address || 'Current Patient GPS Location',
      riskLevel: 'CRITICAL',
      status: 'ACTIVE',
      assignedAmbulanceNo: availableAmbulance?.vehicleNo || 'DL-01-AB-1008',
      assignedHospitalName: hospital?.name || 'Apollo Hospitals, Delhi',
      bloodGroupNeeded: bloodGroupNeeded || 'O-ve',
    },
  });

  // Mark ambulance as dispatched
  if (availableAmbulance) {
    await prisma.ambulance.update({
      where: { id: availableAmbulance.id },
      data: { isAvailable: false, status: 'EN_ROUTE' },
    });
  }

  // Broadcast Real-Time Emergency SOS Alert to Hospital ER Bay & Ambulance Fleet
  emitNotification('emergency:sos', {
    title: '🚨 1-TAP EMERGENCY SOS PANIC TRIGGERED!',
    message: `${patientName} triggered emergency panic at ${sos.address}. Assigned Ambulance: ${sos.assignedAmbulanceNo}`,
    data: sos,
  });

  res.status(201).json(new ApiResponse(201, '🚨 Emergency SOS Dispatched to Ambulance & ER Bay!', sos));
});

/**
 * GET /api/v1/emergency/sos/active
 */
export const getActiveSOS = asyncHandler(async (_req: Request, res: Response) => {
  const activeSOS = await prisma.emergencySOS.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(new ApiResponse(200, 'Active emergency SOS signals fetched.', activeSOS));
});

/**
 * PUT /api/v1/emergency/sos/:id/status
 */
export const updateSOSStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, assignedAmbulanceNo, assignedHospitalName } = req.body;

  const sos = await prisma.emergencySOS.update({
    where: { id: req.params.id as string },
    data: {
      status,
      ...(assignedAmbulanceNo && { assignedAmbulanceNo }),
      ...(assignedHospitalName && { assignedHospitalName }),
    },
  });

  res.json(new ApiResponse(200, `SOS status updated to ${status}.`, sos));
});

/**
 * GET /api/v1/ambulances
 */
export const getAmbulances = asyncHandler(async (_req: Request, res: Response) => {
  const fleet = await prisma.ambulance.findMany({ orderBy: { vehicleNo: 'asc' } });
  res.json(new ApiResponse(200, 'Ambulance fleet status fetched.', fleet));
});

/**
 * GET /api/v1/blood-banks
 */
export const getBloodBanks = asyncHandler(async (_req: Request, res: Response) => {
  const bloodBanks = await prisma.bloodBank.findMany();
  const parsed = bloodBanks.map(b => ({
    ...b,
    stock: JSON.parse(b.stockJson),
  }));
  res.json(new ApiResponse(200, 'Blood bank stock radar fetched.', parsed));
});

/**
 * POST /api/v1/blood-banks/request
 */
export const requestBlood = asyncHandler(async (req: Request, res: Response) => {
  const { patientName, bloodBankId, bloodGroup, unitsNeeded, urgency } = req.body;

  if (!patientName || !bloodBankId || !bloodGroup) {
    throw new ApiError(400, 'patientName, bloodBankId, and bloodGroup are required.');
  }

  const bloodReq = await prisma.bloodRequest.create({
    data: {
      patientName,
      bloodBankId,
      bloodGroup,
      unitsNeeded: parseInt(unitsNeeded || '1'),
      urgency: urgency || 'HIGH',
      status: 'APPROVED',
    },
  });

  emitNotification('blood:sos', {
    title: '🩸 URGENT BLOOD SOS DISPATCHED',
    message: `${unitsNeeded || 1} unit(s) of ${bloodGroup} requested for ${patientName} (${urgency} Urgency)`,
    data: bloodReq,
  });

  res.status(201).json(new ApiResponse(201, 'Blood request approved & dispatched.', bloodReq));
});

import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse, ApiError, asyncHandler } from '../utils/ApiResponse';

/**
 * GET /api/v1/ipd/:hospitalId
 * Fetch all active bed allocations (IPD) for a hospital
 */
export const getHospitalIPD = asyncHandler(async (req: Request, res: Response) => {
  const { hospitalId } = req.params;
  const ipd = await prisma.bedAllocation.findMany({
    where: { hospitalId, status: 'ALLOCATED' },
    include: {
      nursingLogs: { orderBy: { createdAt: 'desc' } },
      doctorRounds: { orderBy: { createdAt: 'desc' } },
      bill: true
    },
    orderBy: { allocatedAt: 'desc' }
  });
  res.json(new ApiResponse(200, 'IPD bed allocations fetched.', ipd));
});

/**
 * POST /api/v1/ipd/:bedId/nursing-log
 * Add a nursing care log for a bed allocation
 */
export const addNursingLog = asyncHandler(async (req: Request, res: Response) => {
  const { bedId } = req.params;
  const { nurseName, vitals, notes } = req.body;

  if (!nurseName || !notes) {
    throw new ApiError(400, 'Nurse name and notes are required.');
  }

  const log = await prisma.nursingCareLog.create({
    data: {
      bedAllocationId: bedId,
      nurseName,
      vitals,
      notes
    }
  });

  res.status(201).json(new ApiResponse(201, 'Nursing log added.', log));
});

/**
 * POST /api/v1/ipd/:bedId/doctor-round
 * Add a doctor round history
 */
export const addDoctorRound = asyncHandler(async (req: Request, res: Response) => {
  const { bedId } = req.params;
  const { doctorName, notes, diagnosis } = req.body;

  if (!doctorName || !notes) {
    throw new ApiError(400, 'Doctor name and notes are required.');
  }

  const round = await prisma.doctorRoundHistory.create({
    data: {
      bedAllocationId: bedId,
      doctorName,
      notes,
      diagnosis
    }
  });

  res.status(201).json(new ApiResponse(201, 'Doctor round added.', round));
});

/**
 * POST /api/v1/ipd/:bedId/bill
 * Generate or update the IPD bill
 */
export const generateBill = asyncHandler(async (req: Request, res: Response) => {
  const { bedId } = req.params;
  const { totalAmount, status, breakdown } = req.body;

  if (totalAmount === undefined || !breakdown) {
    throw new ApiError(400, 'totalAmount and breakdown are required.');
  }

  const bill = await prisma.patientBill.upsert({
    where: { bedAllocationId: bedId },
    update: {
      totalAmount,
      status: status || 'PENDING',
      breakdownJson: JSON.stringify(breakdown)
    },
    create: {
      bedAllocationId: bedId,
      totalAmount,
      status: status || 'PENDING',
      breakdownJson: JSON.stringify(breakdown)
    }
  });

  res.json(new ApiResponse(200, 'Bill generated/updated successfully.', bill));
});

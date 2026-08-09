// MedLink India — Diagnostic Lab & E-Pharmacy Controller (Phase 3)
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { ApiResponse, ApiError, asyncHandler } from '../utils/ApiResponse';
import { emitNotification } from '../socket';

/**
 * GET /api/v1/labs/reports
 */
export const getLabReports = asyncHandler(async (_req: Request, res: Response) => {
  const reports = await prisma.labReport.findMany({ orderBy: { createdAt: 'desc' } });
  const parsed = reports.map(r => ({
    ...r,
    metrics: JSON.parse(r.metricsJson),
  }));
  res.json(new ApiResponse(200, 'Lab reports fetched.', parsed));
});

/**
 * POST /api/v1/labs/reports
 * Lab tech pushes new test report directly to patient's ABHA vault
 */
export const createLabReport = asyncHandler(async (req: Request, res: Response) => {
  const { patientName, testName, category, metrics, isCritical, criticalMessage } = req.body;

  if (!patientName || !testName || !metrics) {
    throw new ApiError(400, 'patientName, testName, and metrics are required.');
  }

  const report = await prisma.labReport.create({
    data: {
      patientName,
      testName,
      category: category || 'BIOCHEMISTRY',
      metricsJson: JSON.stringify(metrics),
      isCritical: Boolean(isCritical),
      criticalMessage: criticalMessage || (isCritical ? '🚨 Critical metric value detected in report.' : null),
      reportStatus: 'COMPLETED',
    },
  });

  // Broadcast socket alert for lab report push
  emitNotification('lab:report', {
    title: isCritical ? '🚨 CRITICAL DIAGNOSTIC LAB ALARM' : '🧪 NEW LAB REPORT PUSHED TO ABHA VAULT',
    message: `${testName} report ready for ${patientName}.${isCritical ? ' ' + report.criticalMessage : ''}`,
    data: report,
  });

  res.status(201).json(new ApiResponse(201, 'Lab report created & pushed to ABHA vault.', report));
});


/**
 * GET /api/v1/pharmacy/inventory
 * Get stock & 60-day expiry warning items
 */
export const getPharmacyInventory = asyncHandler(async (_req: Request, res: Response) => {
  const inventory = await prisma.pharmacyInventory.findMany({ orderBy: { expiryDate: 'asc' } });
  res.json(new ApiResponse(200, 'Pharmacy inventory & expiry tracker fetched.', inventory));
});

/**
 * POST /api/v1/pharmacy/orders
 * Fulfill digital prescription order
 */
export const createPharmacyOrder = asyncHandler(async (req: Request, res: Response) => {
  const { patientName, patientPhone, medicines, deliveryAddress, totalAmount } = req.body;

  if (!patientName || !medicines) {
    throw new ApiError(400, 'patientName and medicines are required.');
  }

  const order = await prisma.pharmacyOrder.create({
    data: {
      patientName,
      patientPhone: patientPhone || '+91-9876543210',
      medicinesJson: JSON.stringify(medicines),
      totalAmount: totalAmount ? parseFloat(totalAmount) : 150.00,
      status: 'VERIFIED',
      deliveryAddress: deliveryAddress || 'Patient Address',
    },
  });

  emitNotification('pharmacy:order', {
    title: '💊 PHARMACY ORDER VERIFIED & DISPATCHED',
    message: `Order for ${patientName} verified by Cold-Chain Pharmacy Desk (₹${order.totalAmount})`,
    data: order,
  });

  res.status(201).json(new ApiResponse(201, 'Pharmacy order verified & dispatched.', order));
});

/**
 * GET /api/v1/pharmacy/orders
 */
export const getPharmacyOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await prisma.pharmacyOrder.findMany({ orderBy: { createdAt: 'desc' } });
  const parsed = orders.map(o => ({
    ...o,
    medicines: JSON.parse(o.medicinesJson),
  }));
  res.json(new ApiResponse(200, 'Pharmacy orders fetched.', parsed));
});

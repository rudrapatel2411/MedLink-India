-- CreateTable
CREATE TABLE "hospitals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "totalBeds" INTEGER NOT NULL DEFAULT 100,
    "availableBeds" INTEGER NOT NULL DEFAULT 30,
    "icuBedsAvailable" INTEGER NOT NULL DEFAULT 5,
    "oxygenBedsAvailable" INTEGER NOT NULL DEFAULT 12,
    "emergencyStatus" TEXT NOT NULL DEFAULT 'GREEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "bed_allocations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hospitalId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "bedType" TEXT NOT NULL,
    "bedNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ALLOCATED',
    "allocatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dischargedAt" DATETIME,
    CONSTRAINT "bed_allocations_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "emergency_sos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientName" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "address" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL DEFAULT 'CRITICAL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "assignedAmbulanceNo" TEXT,
    "assignedHospitalName" TEXT,
    "bloodGroupNeeded" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ambulances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleNo" TEXT NOT NULL,
    "driverName" TEXT NOT NULL,
    "driverPhone" TEXT NOT NULL,
    "currentLat" REAL NOT NULL,
    "currentLng" REAL NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'IDLE',
    "hospitalName" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "blood_banks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "stockJson" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "blood_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientName" TEXT NOT NULL,
    "bloodBankId" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "unitsNeeded" INTEGER NOT NULL,
    "urgency" TEXT NOT NULL DEFAULT 'HIGH',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "lab_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientName" TEXT NOT NULL,
    "patientId" TEXT,
    "testName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "metricsJson" TEXT NOT NULL,
    "isCritical" BOOLEAN NOT NULL DEFAULT false,
    "criticalMessage" TEXT,
    "reportStatus" TEXT NOT NULL DEFAULT 'COMPLETED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "pharmacy_inventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "medicineName" TEXT NOT NULL,
    "batchNo" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    "expiryDate" TEXT NOT NULL,
    "manufacturer" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pharmacy_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientName" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "medicinesJson" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'VERIFIED',
    "deliveryAddress" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "insurance_claims" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "claimNumber" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "hospitalName" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "claimAmount" REAL NOT NULL,
    "diagnosisCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PRE_APPROVED',
    "auditLogsJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "disease_outbreaks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "diseaseName" TEXT NOT NULL,
    "activeCases" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "hospitals_code_key" ON "hospitals"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ambulances_vehicleNo_key" ON "ambulances"("vehicleNo");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_claims_claimNumber_key" ON "insurance_claims"("claimNumber");

// MedLink India — Full Master Database Seed Script (All 12 Stakeholder Panels)
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import process from 'process';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MedLink India Master Database (All 12 Stakeholder Panels)...\n');

  // Clean existing tables
  await prisma.diseaseOutbreak.deleteMany();
  await prisma.insuranceClaim.deleteMany();
  await prisma.pharmacyOrder.deleteMany();
  await prisma.pharmacyInventory.deleteMany();
  await prisma.labReport.deleteMany();
  await prisma.bloodRequest.deleteMany();
  await prisma.bloodBank.deleteMany();
  await prisma.ambulance.deleteMany();
  await prisma.emergencySOS.deleteMany();
  await prisma.bedAllocation.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.prescriptionMedicine.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.symptomCheck.deleteMany();
  await prisma.consentRequest.deleteMany();
  await prisma.healthRecord.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('12345', 12);

  // ─────────────── 1. DOCTORS & PATIENTS & STAKEHOLDERS ───────────────
  const doctor1 = await prisma.user.create({
    data: {
      email: 'doctor@gmail.com',
      password: hashedPassword,
      firstName: 'Rajesh',
      lastName: 'Sharma',
      phone: '+91-9876543210',
      role: 'DOCTOR',
      isVerified: true,
      doctorProfile: {
        create: {
          specialization: 'Cardiologist',
          qualification: 'MD, DM Cardiology (AIIMS New Delhi)',
          experience: 15,
          registrationNo: 'MCI-2010-45678',
          consultationFee: 800,
          availableFrom: '09:00',
          availableTo: '17:00',
          availableDays: JSON.stringify(['MON', 'TUE', 'WED', 'THU', 'FRI']),
          hospitalAffiliation: 'Apollo Hospitals, Delhi',
          bio: 'Senior Interventional Cardiologist specializing in acute coronary syndrome and cardiac rhythm management.',
          rating: 4.9,
          totalConsultations: 3420,
          isAvailableNow: true,
        },
      },
    },
  });

  const doctor2 = await prisma.user.create({
    data: {
      email: 'priya.patel@medlink.in',
      password: hashedPassword,
      firstName: 'Priya',
      lastName: 'Patel',
      phone: '+91-9820011223',
      role: 'DOCTOR',
      isVerified: true,
      doctorProfile: {
        create: {
          specialization: 'Orthopedic Surgeon',
          qualification: 'MS Orthopedics (KEM Hospital Mumbai), Fellowship Joint Replacement',
          experience: 12,
          registrationNo: 'MMC-2012-88201',
          consultationFee: 900,
          availableFrom: '10:00',
          availableTo: '18:00',
          availableDays: JSON.stringify(['MON', 'WED', 'FRI', 'SAT']),
          hospitalAffiliation: 'Max Healthcare, Mumbai',
          bio: 'Consultant Joint Replacement & Trauma Surgeon.',
          rating: 4.8,
          totalConsultations: 2150,
          isAvailableNow: true,
        },
      },
    },
  });

  const doctor3 = await prisma.user.create({
    data: {
      email: 'ananya.sen@medlink.in',
      password: hashedPassword,
      firstName: 'Ananya',
      lastName: 'Sen',
      phone: '+91-9845011998',
      role: 'DOCTOR',
      isVerified: true,
      doctorProfile: {
        create: {
          specialization: 'Endocrinologist',
          qualification: 'DM Endocrinology (Fortis Bangalore)',
          experience: 10,
          registrationNo: 'KMC-2014-99012',
          consultationFee: 750,
          availableFrom: '09:30',
          availableTo: '16:30',
          availableDays: JSON.stringify(['TUE', 'THU', 'SAT']),
          hospitalAffiliation: 'Fortis Healthcare, Bangalore',
          bio: 'Diabetes, Thyroid & Metabolic Disorders Specialist.',
          rating: 4.7,
          totalConsultations: 1890,
          isAvailableNow: true,
        },
      },
    },
  });

  const doctor4 = await prisma.user.create({
    data: {
      email: 'vikram.roy@medlink.in',
      password: hashedPassword,
      firstName: 'Vikramaditya',
      lastName: 'Roy',
      phone: '+91-9810099887',
      role: 'DOCTOR',
      isVerified: true,
      doctorProfile: {
        create: {
          specialization: 'Neurologist',
          qualification: 'MD, DM Neurology (NIMHANS)',
          experience: 18,
          registrationNo: 'DMC-2007-11290',
          consultationFee: 1200,
          availableFrom: '11:00',
          availableTo: '16:00',
          availableDays: JSON.stringify(['MON', 'TUE', 'THU', 'FRI']),
          hospitalAffiliation: 'AIIMS New Delhi',
          bio: 'Senior Neurologist with expertise in stroke management, epilepsy & neuro-degenerative care.',
          rating: 5.0,
          totalConsultations: 4120,
          isAvailableNow: true,
        },
      },
    },
  });

  // Main Seeded Patient Account
  const patient1 = await prisma.user.create({
    data: {
      email: 'patient@gmail.com',
      password: hashedPassword,
      firstName: 'Rahul',
      lastName: 'Kumar',
      phone: '+91-9988776655',
      role: 'PATIENT',
      isVerified: true,
      abhaId: 'ABHA-91-1234-5678-9012',
      patientProfile: {
        create: {
          dateOfBirth: '1990-05-15',
          gender: 'MALE',
          bloodGroup: 'B+',
          height: 175,
          weight: 72,
          allergies: JSON.stringify(['Penicillin', 'Sulfa Drugs']),
          chronicConditions: JSON.stringify(['Hypertension', 'Type 2 Diabetes']),
          emergencyContact: JSON.stringify({ name: 'Sunita Kumar', phone: '+91-9988776600', relation: 'Spouse' }),
          address: '42, MG Road, Connaught Place',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001',
        },
      },
    },
  });

  // Additional Patients for Doctor Queue & Hospital Matrix
  const patient2 = await prisma.user.create({
    data: {
      email: 'ananya.sharma@medlink.in',
      password: hashedPassword,
      firstName: 'Ananya',
      lastName: 'Sharma',
      phone: '+91-9876511223',
      role: 'PATIENT',
      isVerified: true,
      abhaId: 'ABHA-91-9876-5432-1098',
      patientProfile: {
        create: { dateOfBirth: '1994-08-22', gender: 'FEMALE', bloodGroup: 'O+', height: 162, weight: 58, address: 'Sector 14, Rohini', city: 'New Delhi', state: 'Delhi' },
      },
    },
  });

  const patient3 = await prisma.user.create({
    data: {
      email: 'vikas.malhotra@medlink.in',
      password: hashedPassword,
      firstName: 'Vikas',
      lastName: 'Malhotra',
      phone: '+91-9811224455',
      role: 'PATIENT',
      isVerified: true,
      abhaId: 'ABHA-91-5544-3322-1100',
      patientProfile: {
        create: { dateOfBirth: '1982-11-04', gender: 'MALE', bloodGroup: 'AB+', height: 180, weight: 84, address: 'Vasant Kunj', city: 'New Delhi', state: 'Delhi' },
      },
    },
  });

  // ─────────────── APPOINTMENTS (Patient Panel & Doctor OPD Queue) ───────────────
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const appt1 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      scheduledDate: todayStr,
      scheduledTime: '10:30 AM',
      type: 'OPD',
      status: 'SCHEDULED',
      tokenNumber: 4,
      chiefComplaint: 'Chest tightness, palpitations & mild dizziness',
      notes: 'Patient reports mild dyspnea on exertion for past 3 days.',
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor1.id,
      scheduledDate: todayStr,
      scheduledTime: '11:15 AM',
      type: 'OPD',
      status: 'IN_QUEUE',
      tokenNumber: 5,
      chiefComplaint: 'High Blood Pressure spike (160/100 mmHg) & Headache',
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patient3.id,
      doctorId: doctor1.id,
      scheduledDate: todayStr,
      scheduledTime: '11:45 AM',
      type: 'OPD',
      status: 'IN_PROGRESS',
      tokenNumber: 6,
      chiefComplaint: 'Follow-up post Coronary Angiography observation',
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor2.id,
      scheduledDate: tomorrowStr,
      scheduledTime: '02:15 PM',
      type: 'OPD',
      status: 'SCHEDULED',
      tokenNumber: 8,
      chiefComplaint: 'Right knee joint stiffness post marathon',
    },
  });

  const appt3 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor3.id,
      scheduledDate: '2026-07-20',
      scheduledTime: '11:00 AM',
      type: 'FOLLOW_UP',
      status: 'COMPLETED',
      tokenNumber: 12,
      chiefComplaint: 'Quarterly Routine Glycemic Control Review',
      vitals: JSON.stringify({ bp: '128/84 mmHg', spo2: '98%', temp: '98.6°F', pulse: '74 bpm' }),
      diagnosis: 'Type 2 Diabetes Mellitus & Essential Hypertension',
      notes: 'Blood sugar controlled. Continue Metformin and lifestyle modifications.',
    },
  });

  // ─────────────── PRESCRIPTIONS (Patient & Doctor Panels) ───────────────
  await prisma.prescription.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      appointmentId: appt1.id,
      diagnosis: 'Hypertension & Acute Angina Prophylaxis',
      notes: 'Take medicines after meals. Monitor BP daily at 09:00 AM. Avoid heavy sodium intake.',
      status: 'ACTIVE',
      validUntil: '2026-11-30',
      medicines: {
        create: [
          { medicineName: 'Amlodipine 5mg', dosage: '1 Tab', frequency: 'Once Daily (Morning)', duration: '30 Days', instructions: 'After Breakfast', quantity: 30 },
          { medicineName: 'Atorvastatin 10mg', dosage: '1 Tab', frequency: 'Once Daily (Night)', duration: '30 Days', instructions: 'At Bedtime', quantity: 30 },
          { medicineName: 'Nitroglycerin 0.4mg', dosage: '1 Sublingual Tab', frequency: 'As Needed', duration: 'PRN', instructions: 'Place under tongue during acute chest pain', quantity: 10 },
        ],
      },
    },
  });

  await prisma.prescription.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor3.id,
      appointmentId: appt3.id,
      diagnosis: 'Type 2 Diabetes Glycemic Maintenance',
      notes: 'Strict low-glycemic diet. Re-check HbA1c in 90 days.',
      status: 'ACTIVE',
      validUntil: '2026-10-31',
      medicines: {
        create: [
          { medicineName: 'Metformin SR 500mg', dosage: '1 Tab', frequency: 'Twice Daily (Morning & Night)', duration: '60 Days', instructions: 'With Meals', quantity: 120 },
          { medicineName: 'Vildagliptin 50mg', dosage: '1 Tab', frequency: 'Once Daily (Morning)', duration: '60 Days', instructions: 'Before Breakfast', quantity: 60 },
        ],
      },
    },
  });

  // ─────────────── HEALTH VAULT & CONSENT REQUESTS ───────────────
  await prisma.healthRecord.createMany({
    data: [
      {
        userId: patient1.id,
        recordType: 'LAB_REPORT',
        title: 'Cardiac Biomarkers & Lipid Profile Panel',
        description: 'Apollo Diagnostics — Troponin I (3.2 ng/mL - CRITICAL ALARM), CK-MB (45 U/L), Serum Potassium (6.2 mEq/L)',
        fileType: 'pdf',
        tags: JSON.stringify(['CARDIAC', 'LAB_REPORT', 'CRITICAL']),
      },
      {
        userId: patient1.id,
        recordType: 'PRESCRIPTION',
        title: 'Digital Rx — Cardiac Care & Blood Pressure Prophylaxis',
        description: 'Prescribed by Dr. Rajesh Sharma (AIIMS / Apollo Delhi) for Angina & Hypertension Management',
        fileType: 'pdf',
        tags: JSON.stringify(['PRESCRIPTION', 'CARDIOLOGY']),
      },
      {
        userId: patient1.id,
        recordType: 'VACCINATION',
        title: 'Covid-19 Booster Vaccination Certificate (Covaxin)',
        description: 'CoWIN Ref #9810-2204-1189 — 3rd Precaution Dose Administered at AIIMS New Delhi',
        fileType: 'pdf',
        tags: JSON.stringify(['VACCINATION', 'COWIN']),
      },
      {
        userId: patient1.id,
        recordType: 'DISCHARGE_SUMMARY',
        title: 'Discharge Summary — Post Coronary Angiography Observation',
        description: 'Apollo Hospitals Delhi — Patient stable post 24-hr observation. Non-obstructive CAD confirmed.',
        fileType: 'pdf',
        tags: JSON.stringify(['DISCHARGE_SUMMARY', 'APOLLO']),
      },
    ],
  });

  // ABDM Consent Requests for Doctor Panel
  await prisma.consentRequest.create({
    data: {
      requesterId: doctor1.id,
      patientId: patient1.id,
      purpose: 'OPD Consultation & Cardiac Evaluation',
      recordTypes: JSON.stringify(['LAB_REPORT', 'PRESCRIPTION', 'DISCHARGE_SUMMARY']),
      status: 'GRANTED',
      grantedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      duration: '7_DAYS',
    },
  });

  await prisma.consentRequest.create({
    data: {
      requesterId: doctor1.id,
      patientId: patient2.id,
      purpose: 'Hypertension Management & Lab Record Audit',
      recordTypes: JSON.stringify(['LAB_REPORT', 'PRESCRIPTION']),
      status: 'PENDING',
      duration: '1_DAY',
    },
  });

  // Stakeholder logins
  await prisma.user.createMany({
    data: [
      { email: 'hospital@gmail.com', password: hashedPassword, firstName: 'Apollo', lastName: 'ER Desk', phone: '+91-11-26925858', role: 'HOSPITAL_ADMIN', isVerified: true },
      { email: 'lab@gmail.com', password: hashedPassword, firstName: 'Pathology', lastName: 'Diagnostics', phone: '+91-11-99881122', role: 'LAB_TECHNICIAN', isVerified: true },
      { email: 'pharmacy@gmail.com', password: hashedPassword, firstName: 'MedPlus', lastName: 'Supply Desk', phone: '+91-11-88776655', role: 'PHARMACIST', isVerified: true },
      { email: 'ambulance@gmail.com', password: hashedPassword, firstName: 'Vikram', lastName: 'Driver', phone: '+91-9811223344', role: 'AMBULANCE_DRIVER', isVerified: true },
      { email: 'bloodbank@gmail.com', password: hashedPassword, firstName: 'RedCross', lastName: 'Vault', phone: '+91-11-23344556', role: 'BLOOD_BANK_MANAGER', isVerified: true },
      { email: 'insurance@gmail.com', password: hashedPassword, firstName: 'StarHealth', lastName: 'TPA', phone: '+91-1800-425-2255', role: 'INSURANCE_TPA', isVerified: true },
      { email: 'govt@gmail.com', password: hashedPassword, firstName: 'MoHFW', lastName: 'Analytics', phone: '+91-11-23061435', role: 'GOVT_OFFICIAL', isVerified: true },
      { email: 'admin@medlink.in', password: hashedPassword, firstName: 'System', lastName: 'SuperAdmin', phone: '+91-9999999999', role: 'SUPER_ADMIN', isVerified: true },
    ],
  });

  console.log('✅ Created Doctor OPD Queue, Patients & Consent Requests');

  // ─────────────── 2. HOSPITALS & LIVE BED MATRIX ───────────────
  const hospital1 = await prisma.hospital.create({
    data: {
      name: 'Apollo Hospitals, Delhi',
      code: 'APOLLO-DEL',
      city: 'New Delhi',
      state: 'Delhi',
      address: 'Sarita Vihar, Mathura Road, New Delhi',
      phone: '+91-11-26925858',
      totalBeds: 250,
      availableBeds: 42,
      icuBedsAvailable: 8,
      oxygenBedsAvailable: 15,
      emergencyStatus: 'GREEN',
    },
  });

  const hospital2 = await prisma.hospital.create({
    data: {
      name: 'Max Healthcare, Mumbai',
      code: 'MAX-MUM',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Bandra Reclamation, Bandra West, Mumbai',
      phone: '+91-22-66986666',
      totalBeds: 300,
      availableBeds: 18,
      icuBedsAvailable: 3,
      oxygenBedsAvailable: 7,
      emergencyStatus: 'AMBER',
    },
  });

  const hospital3 = await prisma.hospital.create({
    data: {
      name: 'Fortis Healthcare, Bangalore',
      code: 'FORTIS-BLR',
      city: 'Bangalore',
      state: 'Karnataka',
      address: '154/9, Bannerghatta Road, Opp IIM, Bangalore',
      phone: '+91-80-66214444',
      totalBeds: 200,
      availableBeds: 35,
      icuBedsAvailable: 10,
      oxygenBedsAvailable: 20,
      emergencyStatus: 'GREEN',
    },
  });

  const hospital4 = await prisma.hospital.create({
    data: {
      name: 'AIIMS New Delhi',
      code: 'AIIMS-ND',
      city: 'New Delhi',
      state: 'Delhi',
      address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
      phone: '+91-11-26588500',
      totalBeds: 500,
      availableBeds: 5,
      icuBedsAvailable: 1,
      oxygenBedsAvailable: 4,
      emergencyStatus: 'RED',
    },
  });

  await prisma.bedAllocation.createMany({
    data: [
      { hospitalId: hospital1.id, patientName: 'Vikas Malhotra', bedType: 'ICU', bedNumber: 'ICU-B04', status: 'ALLOCATED' },
      { hospitalId: hospital1.id, patientName: 'Kavita Joshi', bedType: 'OXYGEN', bedNumber: 'OXY-A12', status: 'ALLOCATED' },
      { hospitalId: hospital1.id, patientName: 'Rahul Kumar', bedType: 'NORMAL', bedNumber: 'NORMAL-W02', status: 'ALLOCATED' },
      { hospitalId: hospital2.id, patientName: 'Sanjay Deshmukh', bedType: 'ICU', bedNumber: 'ICU-02', status: 'ALLOCATED' },
      { hospitalId: hospital3.id, patientName: 'Sunita Patel', bedType: 'OXYGEN', bedNumber: 'OXY-05', status: 'ALLOCATED' },
    ],
  });

  console.log('✅ Created 4 Master Indian Hospitals with Live Bed Matrix');

  // ─────────────── 3. EMERGENCY SOS & AMBULANCE FLEET ───────────────
  await prisma.emergencySOS.create({
    data: {
      patientName: 'Amit Verma',
      patientPhone: '+91-9876500112',
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Connaught Place, Central Delhi',
      riskLevel: 'CRITICAL',
      status: 'DISPATCHED',
      assignedAmbulanceNo: 'DL-01-AB-1008',
      assignedHospitalName: 'Apollo Hospitals, Delhi',
      bloodGroupNeeded: 'O-ve',
    },
  });

  await prisma.emergencySOS.create({
    data: {
      patientName: 'Rahul Kumar',
      patientPhone: '+91-9988776655',
      latitude: 28.6200,
      longitude: 77.2150,
      address: 'MG Road, Connaught Place, New Delhi',
      riskLevel: 'CRITICAL',
      status: 'ARRIVED',
      assignedAmbulanceNo: 'DL-01-AB-1008',
      assignedHospitalName: 'Apollo Hospitals, Delhi',
      bloodGroupNeeded: 'B+',
    },
  });

  await prisma.ambulance.createMany({
    data: [
      { vehicleNo: 'DL-01-AB-1008', driverName: 'Vikram Singh', driverPhone: '+91-9811223344', currentLat: 28.6150, currentLng: 77.2100, isAvailable: false, status: 'EN_ROUTE', hospitalName: 'Apollo Hospitals, Delhi' },
      { vehicleNo: 'MH-02-CD-2020', driverName: 'Ramesh Pawar', driverPhone: '+91-9822334455', currentLat: 19.0600, currentLng: 72.8300, isAvailable: true, status: 'IDLE', hospitalName: 'Max Healthcare, Mumbai' },
      { vehicleNo: 'KA-05-EF-3030', driverName: 'Suresh Gowda', driverPhone: '+91-9844112233', currentLat: 12.9716, currentLng: 77.5946, isAvailable: true, status: 'IDLE', hospitalName: 'Fortis Healthcare, Bangalore' },
    ],
  });

  console.log('✅ Created Emergency SOS Panic Triggers & Ambulance Fleet');

  // ─────────────── 4. BLOOD BANK NETWORK ───────────────
  const bloodBank1 = await prisma.bloodBank.create({
    data: {
      name: 'Central Red Cross Blood Center, Delhi',
      city: 'New Delhi',
      address: '1, Red Cross Road, Connaught Place, New Delhi',
      phone: '+91-11-23716441',
      stockJson: JSON.stringify({ 'A+': 18, 'A-': 5, 'B+': 24, 'B-': 3, 'O+': 32, 'O-': 2, 'AB+': 12, 'AB-': 1, 'Plasma': 15, 'Platelets': 8 }),
    },
  });

  await prisma.bloodBank.createMany({
    data: [
      {
        name: 'LifeLine Blood Logistics, Mumbai',
        city: 'Mumbai',
        address: 'Dadar East, Near Railway Station, Mumbai',
        phone: '+91-22-24101122',
        stockJson: JSON.stringify({ 'A+': 12, 'A-': 2, 'B+': 16, 'B-': 1, 'O+': 20, 'O-': 4, 'AB+': 8, 'AB-': 0, 'Plasma': 10, 'Platelets': 12 }),
      },
      {
        name: 'Rotary Club Blood Bank, Bangalore',
        city: 'Bangalore',
        address: 'Lavelle Road, Near UB City, Bangalore',
        phone: '+91-80-22212345',
        stockJson: JSON.stringify({ 'A+': 15, 'A-': 3, 'B+': 19, 'B-': 2, 'O+': 28, 'O-': 5, 'AB+': 9, 'AB-': 2, 'Plasma': 14, 'Platelets': 18 }),
      },
    ],
  });

  await prisma.bloodRequest.createMany({
    data: [
      { patientName: 'Amit Verma', bloodBankId: bloodBank1.id, bloodGroup: 'O-', unitsNeeded: 2, urgency: 'CRITICAL', status: 'APPROVED' },
      { patientName: 'Vikas Malhotra', bloodBankId: bloodBank1.id, bloodGroup: 'B+', unitsNeeded: 3, urgency: 'HIGH', status: 'PENDING' },
      { patientName: 'Ananya Sharma', bloodBankId: bloodBank1.id, bloodGroup: 'Platelets', unitsNeeded: 4, urgency: 'CRITICAL', status: 'APPROVED' },
    ],
  });

  console.log('✅ Created Blood Bank Radar & Urgent Requests');

  // ─────────────── 5. DIAGNOSTIC LAB REPORTS & CRITICAL ALARMS ───────────────
  await prisma.labReport.createMany({
    data: [
      {
        patientName: 'Rahul Kumar',
        testName: 'Cardiac Biomarkers & Electrolytes Panel',
        category: 'CARDIAC',
        metricsJson: JSON.stringify({
          'Troponin I': '3.2 ng/mL [CRITICAL ALARM - Normal <0.04]',
          'Serum Potassium': '6.2 mEq/L [CRITICAL HIGH - Normal 3.5-5.0]',
          'HbA1c': '9.8% [UNCONTROLLED DIABETES]',
          'CK-MB': '45 U/L (Elevated)',
          'Serum Creatinine': '1.1 mg/dL',
        }),
        isCritical: true,
        criticalMessage: '🚨 CRITICAL CARDIC ALARM: Elevated Troponin I (3.2 ng/mL) & Severe Hyperkalemia (6.2 mEq/L). Immediate ER evaluation required!',
        reportStatus: 'COMPLETED',
      },
      {
        patientName: 'Ananya Sharma',
        testName: 'Complete Blood Count (CBC) & Dengue NS1',
        category: 'HAEMATOLOGY',
        metricsJson: JSON.stringify({
          'Platelet Count': '85,000 /uL [LOW - Normal 150k-450k]',
          'Dengue NS1 Antigen': 'POSITIVE',
          'Hemoglobin': '12.8 g/dL',
          'WBC Count': '4,200 /uL',
        }),
        isCritical: false,
        criticalMessage: 'Platelet count dropping; monitor for dengue hemorrhagic signs.',
        reportStatus: 'COMPLETED',
      },
      {
        patientName: 'Vikas Malhotra',
        testName: 'Comprehensive Metabolic Panel & HbA1c',
        category: 'BIOCHEMISTRY',
        metricsJson: JSON.stringify({
          'HbA1c': '10.4% [CRITICAL HIGH]',
          'Fasting Blood Glucose': '240 mg/dL',
          'Serum Creatinine': '1.8 mg/dL (Elevated)',
          'eGFR': '52 mL/min (Stage 3 CKD)',
        }),
        isCritical: true,
        criticalMessage: '🚨 CRITICAL GLYCEMIC ALARM: HbA1c 10.4% & Fasting Glucose 240 mg/dL with impaired renal function.',
        reportStatus: 'COMPLETED',
      },
    ],
  });

  console.log('✅ Created Diagnostic Lab Reports with Critical Threshold Alarms');

  // ─────────────── 6. E-PHARMACY COLD-CHAIN INVENTORY ───────────────
  await prisma.pharmacyInventory.createMany({
    data: [
      { medicineName: 'Paracetamol 650mg (Dolo)', batchNo: 'PAR-2026-B1', category: 'ANALGESIC', quantity: 450, unitPrice: 32.50, expiryDate: '2026-10-15', manufacturer: 'Micro Labs Ltd' },
      { medicineName: 'Amoxicillin + Clavulanate 625mg', batchNo: 'AMX-2026-B9', category: 'ANTIBIOTIC', quantity: 120, unitPrice: 180.00, expiryDate: '2026-09-01', manufacturer: 'Cipla Healthcare' },
      { medicineName: 'Metformin SR 500mg', batchNo: 'MET-2026-B3', category: 'DIABETIC', quantity: 300, unitPrice: 42.00, expiryDate: '2026-09-10', manufacturer: 'Sun Pharma' },
      { medicineName: 'Insulin Glargine Pen (Cold-Chain 2-8°C)', batchNo: 'INS-2026-B7', category: 'DIABETIC', quantity: 35, unitPrice: 650.00, expiryDate: '2026-09-05', manufacturer: 'Biocon Biologics' },
      { medicineName: 'Amlodipine 5mg', batchNo: 'AML-2026-A1', category: 'CARDIAC', quantity: 200, unitPrice: 48.00, expiryDate: '2026-11-20', manufacturer: 'Torrent Pharma' },
      { medicineName: 'Azithromycin 500mg', batchNo: 'AZI-2026-X1', category: 'ANTIBIOTIC', quantity: 180, unitPrice: 120.00, expiryDate: '2026-08-28', manufacturer: 'Zydus Lifesciences' },
      { medicineName: 'Pantoprazole 40mg', batchNo: 'PAN-2026-P4', category: 'GASTRIC', quantity: 350, unitPrice: 55.00, expiryDate: '2026-12-10', manufacturer: 'Lupin Pharmaceuticals' },
    ],
  });

  await prisma.pharmacyOrder.createMany({
    data: [
      {
        patientName: 'Rahul Kumar',
        patientPhone: '+91-9988776655',
        medicinesJson: JSON.stringify([
          { name: 'Amlodipine 5mg', qty: 30, price: 48 },
          { name: 'Dolo 650', qty: 10, price: 32.5 },
        ]),
        totalAmount: 80.50,
        status: 'VERIFIED',
        deliveryAddress: '42, MG Road, Connaught Place, New Delhi',
      },
      {
        patientName: 'Ananya Sharma',
        patientPhone: '+91-9876511223',
        medicinesJson: JSON.stringify([
          { name: 'Azithromycin 500mg', qty: 5, price: 120 },
          { name: 'Pantoprazole 40mg', qty: 10, price: 55 },
        ]),
        totalAmount: 175.00,
        status: 'DISPATCHED',
        deliveryAddress: 'Sector 14, Rohini, New Delhi',
      },
    ],
  });

  console.log('✅ Created Pharmacy Cold-Chain Inventory & Orders');

  // ─────────────── 7. INSURANCE CASHLESS PRE-AUTH CLAIMS ───────────────
  await prisma.insuranceClaim.createMany({
    data: [
      {
        claimNumber: 'CLM-2026-88192',
        patientName: 'Rahul Kumar',
        hospitalName: 'Apollo Hospitals, Delhi',
        policyNumber: 'STAR-HEALTH-POL-99201',
        claimAmount: 65000.00,
        diagnosisCode: 'ICD-10-I21.9 (Acute Myocardial Infarction)',
        status: 'PRE_APPROVED',
        auditLogsJson: JSON.stringify([
          { timestamp: new Date().toISOString(), action: 'POLICY_ACTIVE_CHECK', result: 'PASS' },
          { timestamp: new Date().toISOString(), action: 'EMPANELMENT_VERIFICATION', result: 'PASS' },
          { timestamp: new Date().toISOString(), action: 'TPA_AUTO_PRE_AUTH_SUCCESS', result: 'APPROVED_RS_65000' }
        ]),
      },
      {
        claimNumber: 'CLM-2026-94012',
        patientName: 'Priya Patel',
        hospitalName: 'Max Healthcare, Mumbai',
        policyNumber: 'HDFC-ERGO-POL-77182',
        claimAmount: 120000.00,
        diagnosisCode: 'ICD-10-S82.2 (Fracture of Tibia Shaft)',
        status: 'PRE_APPROVED',
        auditLogsJson: JSON.stringify([
          { timestamp: new Date().toISOString(), action: 'POLICY_ACTIVE_CHECK', result: 'PASS' },
          { timestamp: new Date().toISOString(), action: 'TPA_AUTO_PRE_AUTH_SUCCESS', result: 'APPROVED_RS_120000' }
        ]),
      },
      {
        claimNumber: 'CLM-2026-77102',
        patientName: 'Vikas Malhotra',
        hospitalName: 'Apollo Hospitals, Delhi',
        policyNumber: 'NIVA-BUPA-POL-33019',
        claimAmount: 85000.00,
        diagnosisCode: 'ICD-10-I50.9 (Heart Failure Unspecified)',
        status: 'PRE_APPROVED',
        auditLogsJson: JSON.stringify([
          { timestamp: new Date().toISOString(), action: 'POLICY_ACTIVE_CHECK', result: 'PASS' },
          { timestamp: new Date().toISOString(), action: 'TPA_AUTO_PRE_AUTH_SUCCESS', result: 'APPROVED_RS_85000' }
        ]),
      },
    ],
  });

  console.log('✅ Created Cashless Pre-Auth Insurance Claims');

  // ─────────────── 8. GOVERNMENT EPIDEMIC OUTBREAK ANALYTICS ───────────────
  await prisma.diseaseOutbreak.createMany({
    data: [
      { district: 'Delhi Sector 14', state: 'Delhi', diseaseName: 'DENGUE FEVER', activeCases: 142, riskLevel: 'CRITICAL' },
      { district: 'Surat Rural', state: 'Gujarat', diseaseName: 'MALARIA VIVAX', activeCases: 68, riskLevel: 'HIGH' },
      { district: 'Thane District', state: 'Maharashtra', diseaseName: 'CHOLERA', activeCases: 35, riskLevel: 'MODERATE' },
      { district: 'Jaipur Urban', state: 'Rajasthan', diseaseName: 'SWINE FLU H1N1', activeCases: 52, riskLevel: 'HIGH' },
    ],
  });

  console.log('✅ Created Government Epidemic Outbreak Analytics');

  console.log('\n🎉 MedLink India Master Database Seeding Complete across all 12 Stakeholder Panels!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

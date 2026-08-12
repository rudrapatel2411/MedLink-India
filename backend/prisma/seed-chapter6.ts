import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Chapter 6 Data...');

  // Get doctors and patients
  const doctor = await prisma.user.findFirst({ where: { role: 'DOCTOR' } });
  const patient1 = await prisma.user.findFirst({ where: { email: 'patient@gmail.com' } });
  const patient2 = await prisma.user.findFirst({ where: { email: 'ananya.sharma@medlink.in' } });
  
  if (!doctor || !patient1 || !patient2) {
    console.log('Missing doctor or patient, skipping.');
    return;
  }

  const today = new Date().toISOString().split('T')[0];

  // Clear existing appointments and IPD for clean slate if needed
  await prisma.appointment.deleteMany({ where: { scheduledDate: today } });
  await prisma.nursingCareLog.deleteMany();
  await prisma.doctorRoundHistory.deleteMany();
  await prisma.patientBill.deleteMany();
  await prisma.bedAllocation.deleteMany();

  // Seed OPD Queue
  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor.id,
      scheduledDate: today,
      scheduledTime: '10:00 AM',
      type: 'OPD',
      status: 'IN_PROGRESS',
      tokenNumber: 1,
      chiefComplaint: 'Fever and cold',
    }
  });

  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor.id,
      scheduledDate: today,
      scheduledTime: '10:15 AM',
      type: 'OPD',
      status: 'IN_QUEUE',
      tokenNumber: 2,
      chiefComplaint: 'Headache',
    }
  });

  // Seed IPD Tracker
  const hospital = await prisma.hospital.findFirst();
  if (hospital) {
    const bedAlloc = await prisma.bedAllocation.create({
      data: {
        hospitalId: hospital.id,
        patientName: 'Suresh Kumar',
        bedType: 'ICU',
        bedNumber: 'ICU-01',
        status: 'ALLOCATED',
      }
    });

    await prisma.nursingCareLog.create({
      data: {
        bedAllocationId: bedAlloc.id,
        nurseName: 'Nurse Priya',
        vitals: 'BP: 120/80, HR: 72',
        notes: 'Patient stable, resting comfortably.',
      }
    });

    await prisma.doctorRoundHistory.create({
      data: {
        bedAllocationId: bedAlloc.id,
        doctorName: 'Dr. Rajesh Sharma',
        diagnosis: 'Recovering from minor surgery',
        notes: 'Continue current medications, start liquid diet.',
      }
    });

    await prisma.patientBill.create({
      data: {
        bedAllocationId: bedAlloc.id,
        totalAmount: 25000,
        status: 'PENDING',
        breakdownJson: JSON.stringify([{ item: 'ICU Bed Charges', amount: 15000 }, { item: 'Nursing', amount: 5000 }, { item: 'Medicines', amount: 5000 }]),
      }
    });
  }

  console.log('Seeding Complete.');
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());

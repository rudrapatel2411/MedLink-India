import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding more IPD Tracker Data...');

  const hospital = await prisma.hospital.findFirst();
  if (!hospital) {
    console.log('Missing hospital, skipping.');
    return;
  }

  const dummyPatients = [
    { name: 'Kavya Singh', bedType: 'NORMAL', bedNumber: 'W-102', dNotes: 'Mild fever, observation', dDiag: 'Viral infection', nVitals: 'BP: 110/70', nNotes: 'Given antipyretic', bill: 4000 },
    { name: 'Ravi Prakash', bedType: 'OXYGEN', bedNumber: 'O2-14', dNotes: 'Asthma exacerbation, on O2 support', dDiag: 'Acute Asthma', nVitals: 'SpO2: 92%', nNotes: 'O2 flow at 2L/min', bill: 12000 },
    { name: 'Sunita Devi', bedType: 'ICU', bedNumber: 'ICU-03', dNotes: 'Post-op observation, vitals stable', dDiag: 'CABG Post-op', nVitals: 'BP: 130/85, HR: 82', nNotes: 'Dressing checked, no bleeding', bill: 45000 },
    { name: 'Vikram Joshi', bedType: 'NORMAL', bedNumber: 'W-105', dNotes: 'Discharge planned for tomorrow', dDiag: 'Dengue Fever', nVitals: 'Temp: 98.6F', nNotes: 'Hydration maintained', bill: 8000 },
    { name: 'Meera Rao', bedType: 'OXYGEN', bedNumber: 'O2-16', dNotes: 'Pneumonia recovering', dDiag: 'Pneumonia', nVitals: 'SpO2: 95%', nNotes: 'Nebulization given', bill: 18000 },
    { name: 'Anil Kapoor', bedType: 'ICU', bedNumber: 'ICU-05', dNotes: 'Critical but stable, neuro assessment done', dDiag: 'Head Injury', nVitals: 'GCS: 12/15', nNotes: 'Pupils reactive, patient resting', bill: 60000 },
  ];

  for (const p of dummyPatients) {
    const bedAlloc = await prisma.bedAllocation.create({
      data: {
        hospitalId: hospital.id,
        patientName: p.name,
        bedType: p.bedType,
        bedNumber: p.bedNumber,
        status: 'ALLOCATED',
      }
    });

    await prisma.nursingCareLog.create({
      data: {
        bedAllocationId: bedAlloc.id,
        nurseName: 'Nurse Jyoti',
        vitals: p.nVitals,
        notes: p.nNotes,
      }
    });

    await prisma.doctorRoundHistory.create({
      data: {
        bedAllocationId: bedAlloc.id,
        doctorName: 'Dr. Rajesh Sharma',
        diagnosis: p.dDiag,
        notes: p.dNotes,
      }
    });

    await prisma.patientBill.create({
      data: {
        bedAllocationId: bedAlloc.id,
        totalAmount: p.bill,
        status: 'PENDING',
        breakdownJson: JSON.stringify([{ item: 'Bed Charges', amount: p.bill * 0.4 }, { item: 'Nursing & Meds', amount: p.bill * 0.6 }]),
      }
    });
  }

  console.log('Seeding 6 extra IPD items Complete.');
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding more OPD Queue Data...');

  const doctor = await prisma.user.findFirst({ where: { role: 'DOCTOR' } });
  if (!doctor) {
    console.log('Missing doctor, skipping.');
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const hashedPassword = await bcrypt.hash('12345', 12);

  // Generate 12 dummy patients for the queue
  const dummyNames = [
    { f: 'Amit', l: 'Verma', c: 'Stomach Ache' },
    { f: 'Neha', l: 'Singh', c: 'Routine Checkup' },
    { f: 'Rohan', l: 'Das', c: 'Back Pain' },
    { f: 'Kavita', l: 'Nair', c: 'Migraine' },
    { f: 'Vikash', l: 'Joshi', c: 'Viral Fever' },
    { f: 'Pooja', l: 'Bhatt', c: 'Knee Joint Pain' },
    { f: 'Karan', l: 'Mehta', c: 'Skin Allergy' },
    { f: 'Sneha', l: 'Reddy', c: 'Follow up' },
    { f: 'Manish', l: 'Tiwari', c: 'Dizziness' },
    { f: 'Divya', l: 'Kapoor', c: 'Sprain in ankle' },
    { f: 'Arjun', l: 'Saxena', c: 'Sore throat' },
    { f: 'Ritu', l: 'Desai', c: 'High BP check' },
  ];

  let tokenStart = 3; // Starting from token 3 since 1 and 2 are already there

  for (let i = 0; i < dummyNames.length; i++) {
    const p = dummyNames[i];
    
    // Create patient
    const patient = await prisma.user.create({
      data: {
        email: `dummy${i}@medlink.in`,
        password: hashedPassword,
        firstName: p.f,
        lastName: p.l,
        phone: `+91-98765${10000 + i}`,
        role: 'PATIENT',
        isVerified: true,
      }
    });

    // Determine time (10:30 AM onwards, every 15 mins)
    const totalMins = 630 + (i * 15); // 10:30 is 10*60 + 30 = 630
    const hr = Math.floor(totalMins / 60);
    const min = totalMins % 60;
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const displayHr = hr > 12 ? hr - 12 : hr;
    const timeStr = `${displayHr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} ${ampm}`;

    // Add to queue
    await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        scheduledDate: today,
        scheduledTime: timeStr,
        type: 'OPD',
        status: 'SCHEDULED', // Make them scheduled so they wait in queue
        tokenNumber: tokenStart + i,
        chiefComplaint: p.c,
      }
    });
  }

  console.log('Seeding 12 extra queue items Complete.');
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());

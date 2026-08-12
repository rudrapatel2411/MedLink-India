const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function run() { 
  const users = await prisma.user.findMany({ where: { role: 'PATIENT', abhaId: null } }); 
  for (const u of users) { 
    const newId = '91-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
    await prisma.user.update({ where: { id: u.id }, data: { abhaId: newId } }); 
  } 
  console.log('Updated ' + users.length + ' existing patients with ABHA IDs'); 
} 

run().finally(() => prisma.$disconnect());

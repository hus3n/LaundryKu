import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const superAdminEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@laundryku.com';
  const superAdminPassword = process.env.SUPERADMIN_PASSWORD || 'SuperAdmin@2026';
  const superAdminName = process.env.SUPERADMIN_NAME || 'Super Admin';

  const existing = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
    const superAdmin = await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        name: superAdminName,
        role: 'SUPERADMIN' as any,
        isActive: true,
      },
    });

    console.log('✅ SuperAdmin user seeded successfully:');
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Password: ${superAdminPassword}`);
  } else {
    console.log('ℹ️ SuperAdmin already exists.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

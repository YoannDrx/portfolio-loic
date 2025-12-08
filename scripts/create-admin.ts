import { prisma } from '../lib/prisma';
import { hash } from 'bcryptjs';

async function createAdmin() {
  try {
    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@loicghanem.com' },
      include: { accounts: true }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists:');
      console.log('   Email:', existingAdmin.email);
      console.log('   ID:', existingAdmin.id);
      console.log('   Role:', existingAdmin.role);
      console.log('   Accounts:', existingAdmin.accounts.length);
      return;
    }

    // Create admin user
    const hashedPassword = await hash('admin123456', 10);

    const admin = await prisma.user.create({
      data: {
        email: 'admin@loicghanem.com',
        name: 'Admin',
        role: 'admin',
        emailVerified: true,
        accounts: {
          create: {
            providerId: 'credential',
            accountId: 'admin@loicghanem.com',
            password: hashedPassword,
          },
        },
      },
      include: { accounts: true }
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Email:', admin.email);
    console.log('   Password: admin123456');
    console.log('   ID:', admin.id);
    console.log('   Role:', admin.role);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

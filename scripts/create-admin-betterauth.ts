import { prisma } from '../lib/prisma';

async function createAdminViaBetterAuth() {
  try {
    // First, delete existing admin if any
    const existing = await prisma.user.findUnique({
      where: { email: 'admin@loicghanem.com' },
      include: { accounts: true }
    });

    if (existing) {
      console.log('🗑️  Deleting existing admin user...');
      // Delete accounts first
      for (const account of existing.accounts) {
        await prisma.account.delete({ where: { id: account.id } });
      }
      // Delete sessions
      await prisma.session.deleteMany({ where: { userId: existing.id } });
      // Delete user
      await prisma.user.delete({ where: { id: existing.id } });
      console.log('✅ Existing admin deleted');
    }

    // Use Better Auth API to create user
    console.log('📝 Creating admin user via Better Auth API...');

    const response = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@loicghanem.com',
        password: 'admin123456',
        name: 'Admin',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Signup failed: ${error}`);
    }

    const result = await response.json();
    console.log('✅ User created via API:', result);

    // Now update the role to admin
    const user = await prisma.user.findUnique({
      where: { email: 'admin@loicghanem.com' }
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: 'admin',
          emailVerified: true
        }
      });
      console.log('✅ User role updated to admin');
      console.log('\n🎉 Admin user ready!');
      console.log('   Email: admin@loicghanem.com');
      console.log('   Password: admin123456');
      console.log('   Role: admin');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminViaBetterAuth();

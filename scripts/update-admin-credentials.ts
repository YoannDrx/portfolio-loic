import { prisma } from '../lib/prisma';

const NEW_EMAIL = 'loic.ghanem@outlook.com';
const NEW_PASSWORD = 'admin123456';
const OLD_EMAIL = 'admin@loicghanem.com';

async function updateAdminCredentials() {
  try {
    console.log('🔄 Updating admin credentials...\n');

    // Check if user with new email already exists
    const existingNew = await prisma.user.findUnique({
      where: { email: NEW_EMAIL },
      include: { accounts: true, sessions: true }
    });

    // Check if old admin exists
    const existingOld = await prisma.user.findUnique({
      where: { email: OLD_EMAIL },
      include: { accounts: true, sessions: true }
    });

    // Clean up old admin if exists
    if (existingOld) {
      console.log('🗑️  Deleting old admin (admin@loicghanem.com)...');
      await prisma.session.deleteMany({ where: { userId: existingOld.id } });
      await prisma.account.deleteMany({ where: { userId: existingOld.id } });
      await prisma.user.delete({ where: { id: existingOld.id } });
      console.log('✅ Old admin deleted');
    }

    // Clean up existing user with new email if exists (to recreate with proper password)
    if (existingNew) {
      console.log('🗑️  Cleaning up existing user with new email...');
      await prisma.session.deleteMany({ where: { userId: existingNew.id } });
      await prisma.account.deleteMany({ where: { userId: existingNew.id } });
      await prisma.user.delete({ where: { id: existingNew.id } });
      console.log('✅ Existing user cleaned');
    }

    // Create new admin via Better Auth API
    console.log('\n📝 Creating admin user via Better Auth API...');
    console.log('   (Make sure the dev server is running on localhost:3000)\n');

    const response = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: NEW_EMAIL,
        password: NEW_PASSWORD,
        name: 'Loïc Ghanem',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Signup failed: ${error}`);
    }

    const result = await response.json();
    console.log('✅ User created via API');

    // Update role to admin
    const newUser = await prisma.user.findUnique({
      where: { email: NEW_EMAIL }
    });

    if (newUser) {
      await prisma.user.update({
        where: { id: newUser.id },
        data: {
          role: 'admin',
          emailVerified: true
        }
      });

      console.log('\n🎉 Admin credentials updated successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   Email:    ${NEW_EMAIL}`);
      console.log(`   Password: ${NEW_PASSWORD}`);
      console.log(`   Role:     admin`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\n💡 Tip: Make sure the dev server is running (npm run dev)');
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminCredentials();

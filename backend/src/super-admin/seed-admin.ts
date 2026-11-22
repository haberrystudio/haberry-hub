import { PrismaClient } from '@prisma/client';
import { hashPassword } from './password';

async function seedAdmin() {
  const email = process.env.PLATFORM_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.PLATFORM_ADMIN_PASSWORD;
  if (
    !email ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !password ||
    password.length < 8 ||
    password.length > 128
  ) {
    throw new Error('Set a valid admin email and an 8-128 character password.');
  }

  const database = new PrismaClient();
  try {
    const result = await database.platformAdmin.createMany({
      data: { email, passwordHash: await hashPassword(password) },
      skipDuplicates: true,
    });
    console.log(
      result.count
        ? 'Super admin created.'
        : 'Super admin already exists.',
    );
  } finally {
    await database.$disconnect();
  }
}

seedAdmin().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : 'Admin provisioning failed.',
  );
  process.exitCode = 1;
});

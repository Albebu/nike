import { PrismaClient } from '@prisma/client';
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();


async function main() {
  const hashedPassword = await bcrypt.hash("Monlau2024", 10);
  await prisma.user.createMany({
    data: [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword, // Asegúrate de encriptarlo si es para producción
        role: 'ADMIN',
      },
      {
        name: 'Cliente Ejemplo',
        email: 'cliente@example.com',
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    ],
  });
}

main()
  .then(() => {
    console.log('Seed completado.');
  })
  .catch((e) => {
    console.error('Error al ejecutar el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

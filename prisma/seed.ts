import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'hashedpassword123', // Asegúrate de encriptarlo si es para producción
        role: 'ADMIN',
      },
      {
        name: 'Cliente Ejemplo',
        email: 'cliente@example.com',
        password: 'hashedpassword456',
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

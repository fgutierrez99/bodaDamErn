import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const data = [
    { nombre: "Álvaro mendoza", maxAcomp: 2 },
    { nombre: "Ana Alida", maxAcomp: 1 },
    { nombre: "Analy Morales", maxAcomp: 1 },
    
    { nombre: "Anyi Romero", maxAcomp: 2 },
    { nombre: "Brisseida Rodriguez", maxAcomp: 1 },
    { nombre: "Cistian Morales", maxAcomp: 2 },
    { nombre: "Dania Díaz", maxAcomp: 0 },
    { nombre: "David Reynoso", maxAcomp: 2 },
    { nombre: "Dulce Guerra", maxAcomp: 1 },
    { nombre: "Ervin Leal", maxAcomp: 4 },
    { nombre: "Henry Reyes", maxAcomp: 1 },
    { nombre: "Israel Morales", maxAcomp: 1 },
    { nombre: "Karla Morales", maxAcomp: 1 },
    { nombre: "Lorena Díaz", maxAcomp: 1 },
    { nombre: "Lorena Garza", maxAcomp: 0 },
    { nombre: "Manfred Sirin", maxAcomp: 1 },
    { nombre: "Marco Antonio Díaz", maxAcomp: 0 },
    { nombre: "Marlyn Gutierrez", maxAcomp: 3 },
    { nombre: "Mayda Mendoza", maxAcomp: 0 },
    { nombre: "Mishell Rivera", maxAcomp: 0 },
    { nombre: "Nora Mendoza", maxAcomp: 1 },
    { nombre: "Renato Sor", maxAcomp: 0 },
    { nombre: "Sergio Gutierrez", maxAcomp: 2 },
    { nombre: "Sucely Reyes", maxAcomp: 2 },
    { nombre: "Carlos Gutierrez", maxAcomp: 1 },
    { nombre: "Yanett Ramírez", maxAcomp: 3 }
  ];

  for (const i of data) {
    await prisma.invitado.upsert({
      where: { nombre: i.nombre },
      update: { maxAcomp: i.maxAcomp },
      create: i
    });
  }

  console.log("✅ Seed listo: invitados cargados/actualizados");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

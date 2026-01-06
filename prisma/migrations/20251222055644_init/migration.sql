-- CreateEnum
CREATE TYPE "EstadoInvitado" AS ENUM ('SIN_CONFIRMAR', 'CONFIRMO', 'RECHAZO', 'INACTIVO');

-- CreateTable
CREATE TABLE "Invitado" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT,
    "acompanantes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "estado" "EstadoInvitado" NOT NULL DEFAULT 'SIN_CONFIRMAR',
    "respondioAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitado_pkey" PRIMARY KEY ("id")
);

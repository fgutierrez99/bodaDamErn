/*
  Warnings:

  - You are about to drop the column `acompanantes` on the `Invitado` table. All the data in the column will be lost.
  - You are about to drop the column `respondioAt` on the `Invitado` table. All the data in the column will be lost.
  - The `estado` column on the `Invitado` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[nombre]` on the table `Invitado` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EstadoInvitacion" AS ENUM ('SIN_CONFIRMAR', 'CONFIRMO', 'RECHAZO', 'INACTIVO');

-- AlterTable
ALTER TABLE "Invitado" DROP COLUMN "acompanantes",
DROP COLUMN "respondioAt",
ADD COLUMN     "asistira" BOOLEAN,
ADD COLUMN     "comentario" TEXT,
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoInvitacion" NOT NULL DEFAULT 'SIN_CONFIRMAR';

-- DropEnum
DROP TYPE "EstadoInvitado";

-- CreateTable
CREATE TABLE "Acompanante" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "asistira" BOOLEAN,
    "invitadoId" INTEGER NOT NULL,

    CONSTRAINT "Acompanante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Acompanante_invitadoId_idx" ON "Acompanante"("invitadoId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitado_nombre_key" ON "Invitado"("nombre");

-- AddForeignKey
ALTER TABLE "Acompanante" ADD CONSTRAINT "Acompanante_invitadoId_fkey" FOREIGN KEY ("invitadoId") REFERENCES "Invitado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

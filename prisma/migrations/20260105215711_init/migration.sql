/*
  Warnings:

  - The `estado` column on the `Invitado` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Acompanante` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EstadoInvitado" AS ENUM ('SIN_CONFIRMAR', 'CONFIRMO', 'RECHAZO', 'INACTIVO');

-- DropForeignKey
ALTER TABLE "Acompanante" DROP CONSTRAINT "Acompanante_invitadoId_fkey";

-- AlterTable
ALTER TABLE "Invitado" ADD COLUMN     "acompCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxAcomp" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoInvitado" NOT NULL DEFAULT 'SIN_CONFIRMAR';

-- DropTable
DROP TABLE "Acompanante";

-- DropEnum
DROP TYPE "EstadoInvitacion";

import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Servir frontend (una sola página)
app.use(express.static("public"));

/**
 * GET /api/invitados
 * Devuelve lista para el select
 */
app.get("/api/invitados", async (_req, res) => {
  try {
    const invitados = await prisma.invitado.findMany({
      where: { estado: "SIN_CONFIRMAR" },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true, maxAcomp: true, estado: true }
    });
    res.json(invitados);
  } catch (err) {
    res.status(500).json({ message: "Error cargando invitados" });
  }
});

/**
 * POST /api/rsvp
 * Guarda confirmación:
 * - asistira: true/false
 * - estado pasa a CONFIRMO o RECHAZO
 * - acompCount debe estar entre 0 y maxAcomp
 */
app.post("/api/rsvp", async (req, res) => {
  try {
    const { invitadoId, correo, asistira, acompCount, comentario } = req.body;

    if (!invitadoId || typeof asistira !== "boolean") {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    if (correo && correo.trim() !== "" && !/^\S+@\S+\.\S+$/.test(correo.trim())) {
      return res.status(400).json({ message: "Correo inválido." });
    }


    const invitado = await prisma.invitado.findUnique({
      where: { id: Number(invitadoId) }
    });

    if (!invitado) return res.status(404).json({ message: "Invitado no existe." });

    if (invitado.estado !== "SIN_CONFIRMAR") {
      return res.status(409).json({
        message: "Este invitado ya confirmó o rechazó. Ya no se puede enviar otra respuesta."
      });
    }

    const count = Number(acompCount ?? 0);
    if (Number.isNaN(count) || count < 0 || count > invitado.maxAcomp) {
      return res.status(400).json({ message: "Cantidad de acompañantes inválida." });
    }

    const nuevoEstado = asistira ? "CONFIRMO" : "RECHAZO";

    const updated = await prisma.invitado.update({
      where: { id: invitado.id },
      data: {
        correo: (correo && correo.trim() !== "") ? correo.trim() : null,
        asistira,
        acompCount: count,
        comentario: (comentario || "").trim() || null,
        estado: nuevoEstado
      }
    });

    res.json({ ok: true, invitado: updated });
  } catch (err) {
    res.status(500).json({ message: "Error guardando confirmación." });
  }
});

// fallback SPA (por si refrescan)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`✅ Server corriendo en http://localhost:${PORT}`);
});

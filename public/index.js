const invitadoSelect = document.getElementById("invitadoSelect");
const acompInput = document.getElementById("acompanantes"); // ahora es input disabled
const acompReal = document.getElementById('acompanantesReal');
const helpMax = document.getElementById("helpMax");
const form = document.getElementById("rsvpForm");
const statusEl = document.getElementById("status");
const API_BASE = "";
let invitadosCache = [];

function setStatus(msg, type) {
  statusEl.textContent = msg || "";
  statusEl.className = "status";
  if (type) statusEl.classList.add(type);
}

function fillAcompanantes(maxAcomp) {
  const totalInvitados = (Number(maxAcomp) || 0);   //acompañantes
  acompInput.value = String(totalInvitados);
  acompReal.value = String(Number(maxAcomp) || 0);      // solo acompañantes
}


async function loadInvitados() {
  try {

    const res = await fetch(`${API_BASE}/api/invitados`);
    if (!res.ok) throw new Error("No se pudo cargar la lista de invitados.");
    const data = await res.json();

    invitadosCache = data;

    data.forEach((i) => {
      const opt = document.createElement("option");
      opt.value = String(i.id);
      opt.textContent = i.nombre;
      invitadoSelect.appendChild(opt);
    });
  } catch (e) {
    setStatus(e.message, "err");
  }
}

invitadoSelect.addEventListener("change", () => {
  const id = Number(invitadoSelect.value);
  const inv = invitadosCache.find((x) => x.id === id);

  if (!inv) {
    helpMax.textContent = "";
    fillAcompanantes(0);
    return;
  }

  /*helpMax.textContent = `Cupo asignado: ${inv.maxAcomp + 1} (incluyéndote).`;*/
  fillAcompanantes(inv.maxAcomp);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("Enviando...", null);

  const invitadoId = Number(invitadoSelect.value);
  const correo = document.getElementById("correo").value.trim();
  const asistiraVal = document.getElementById("asistiraVal").value;
  const acompCount = Number(acompReal.value || 0);
  const comentario = document.getElementById("comentario").value.trim();

  if (!invitadoId || (asistiraVal !== "SI" && asistiraVal !== "NO")) {
    setStatus("Selecciona tu nombre y si asistirás.", "err");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invitadoId,
        correo: correo || null,
        asistira: asistiraVal === "SI",
        acompCount,
        comentario
      })
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.message || "Error guardando confirmación.");

    setStatus("¡Listo! Gracias por confirmar.", "ok");
    form.reset();
    helpMax.textContent = "";
    fillAcompanantes(0);
  } catch (e) {
    setStatus(e.message, "err");
  }
});

loadInvitados();


// Configura la fecha objetivo (Año, Mes [0-11], Día, Hora, Minuto, Segundo)
const targetDate = new Date("Jan 24, 2026 15:30:00").getTime();

const interval = setInterval(() => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  // Cálculos matemáticos para días, horas, minutos y segundos
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Inyectar los resultados en el HTML
  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;

  // Si la cuenta llega a cero
  if (distance < 0) {
    clearInterval(interval);
    document.getElementById("countdown").innerHTML = "¡Tiempo cumplido!";
  }
}, 1000);
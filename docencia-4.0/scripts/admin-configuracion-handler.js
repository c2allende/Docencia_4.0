import { db } from "./firebase-config.js";
import { auth } from "./firebase-config.js";
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { isAdmin } from "./user-service.js";

const enrollmentForm = document.getElementById("enrollmentForm");
const enrollmentStatusEl = document.getElementById("enrollmentStatusMessage");

function showEnrollmentMessage(text, type = "info") {
    if (!enrollmentStatusEl) return;
    enrollmentStatusEl.textContent = text;
    enrollmentStatusEl.className = `status-message is-visible is-${type}`;
}

function toLocalDatetimeValue(ts) {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function loadEnrollmentConfig() {
    try {
        const ref = doc(db, "configuracion", "registro");
        const snap = await getDoc(ref);
        if (!snap.exists()) return;
        const data = snap.data();

        const toggleBtn = document.getElementById("enrollmentEnabled");
        const startInput = document.getElementById("enrollmentStartAt");
        const endInput = document.getElementById("enrollmentEndAt");
        const emailInput = document.getElementById("enrollmentContactEmail");

        if (toggleBtn) toggleBtn.setAttribute("aria-pressed", String(!!data.enrollmentEnabled));
        if (startInput) startInput.value = toLocalDatetimeValue(data.enrollmentStartAt);
        if (endInput) endInput.value = toLocalDatetimeValue(data.enrollmentEndAt);
        if (emailInput) emailInput.value = data.adminContactEmail || "";
    } catch (error) {
        console.error("Error al cargar configuración de matrícula:", error);
    }
}

onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    const adminCheck = await isAdmin(user.uid);
    if (!adminCheck) return;
    await loadEnrollmentConfig();
});

enrollmentForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        showEnrollmentMessage("Sesión no válida. Recarga la página.", "error");
        return;
    }

    const adminCheck = await isAdmin(user.uid);
    if (!adminCheck) {
        showEnrollmentMessage("Sin permisos de administrador.", "error");
        return;
    }

    const toggleBtn = document.getElementById("enrollmentEnabled");
    const startInput = document.getElementById("enrollmentStartAt");
    const endInput = document.getElementById("enrollmentEndAt");
    const emailInput = document.getElementById("enrollmentContactEmail");

    const enrollmentEnabled = toggleBtn?.getAttribute("aria-pressed") === "true";
    const startVal = startInput?.value || "";
    const endVal = endInput?.value || "";
    const adminContactEmail = emailInput?.value.trim() || "";

    if (enrollmentEnabled) {
        if (!startVal || !endVal) {
            showEnrollmentMessage("Si la matrícula está activa, debes definir fecha de inicio y cierre.", "error");
            return;
        }
        if (new Date(startVal) >= new Date(endVal)) {
            showEnrollmentMessage("La fecha de inicio debe ser anterior a la fecha de cierre.", "error");
            return;
        }
    }

    if (adminContactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminContactEmail)) {
        showEnrollmentMessage("El formato del email de contacto no es válido.", "error");
        return;
    }

    try {
        showEnrollmentMessage("Guardando configuración...", "info");

        const { updateEnrollmentConfig } = await import("./enrollment-service.js");

        await updateEnrollmentConfig({
            enrollmentEnabled,
            enrollmentStartAt: startVal,
            enrollmentEndAt: endVal,
            adminContactEmail
        }, user.uid);

        showEnrollmentMessage("Configuración de matrícula guardada correctamente.", "success");
    } catch (error) {
        console.error("Error al guardar configuración de matrícula:", error);
        showEnrollmentMessage("Error al guardar. Verifica tu sesión e inténtalo de nuevo.", "error");
    }
});

// Toggle click handler para el botón de activar matrícula
document.getElementById("enrollmentEnabled")?.addEventListener("click", function () {
    const current = this.getAttribute("aria-pressed") === "true";
    this.setAttribute("aria-pressed", String(!current));
});

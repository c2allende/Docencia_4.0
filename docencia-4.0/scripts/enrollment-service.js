import { db } from "./firebase-config.js";
import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/**
 * Lee la configuración del periodo de matrícula desde Firestore.
 * No requiere usuario autenticado (configuracion/registro es público por regla).
 * @returns {Object|null}
 */
export async function getEnrollmentConfig() {
    try {
        const ref = doc(db, "configuracion", "registro");
        const snap = await getDoc(ref);
        return snap.exists() ? snap.data() : null;
    } catch (error) {
        console.error("Error al leer configuración de matrícula:", error);
        return null;
    }
}

/**
 * Evalúa el estado del periodo de matrícula a partir de la configuración leída.
 * @param {Object|null} config
 * @returns {{ isOpen: boolean, reason: "open"|"disabled"|"not_started"|"closed"|"missing_config", message: string, adminContactEmail: string }}
 */
export function evaluateEnrollmentStatus(config) {
    const adminContactEmail = config?.adminContactEmail || "";
    const contactSuffix = adminContactEmail
        ? `comuníquese con el administrador: ${adminContactEmail}`
        : "comuníquese con el administrador.";

    if (!config) {
        return {
            isOpen: false,
            reason: "missing_config",
            message: "El periodo de matrícula no está disponible en este momento. Para solicitar acceso, comuníquese con el administrador.",
            adminContactEmail: ""
        };
    }

    if (!config.enrollmentEnabled) {
        return {
            isOpen: false,
            reason: "disabled",
            message: `El periodo de matrícula no está disponible en este momento. Para solicitar acceso, ${contactSuffix}`,
            adminContactEmail
        };
    }

    const now = new Date();
    const startAt = config.enrollmentStartAt?.toDate
        ? config.enrollmentStartAt.toDate()
        : new Date(config.enrollmentStartAt);
    const endAt = config.enrollmentEndAt?.toDate
        ? config.enrollmentEndAt.toDate()
        : new Date(config.enrollmentEndAt);

    if (now < startAt) {
        const startStr = startAt.toLocaleDateString("es", {
            day: "numeric", month: "long", year: "numeric"
        });
        return {
            isOpen: false,
            reason: "not_started",
            message: `El periodo de matrícula comenzará el ${startStr}. Para información adicional, ${contactSuffix}`,
            adminContactEmail
        };
    }

    if (now > endAt) {
        const endStr = endAt.toLocaleDateString("es", {
            day: "numeric", month: "long", year: "numeric"
        });
        return {
            isOpen: false,
            reason: "closed",
            message: `El periodo de matrícula cerró el ${endStr}. Para solicitar acceso, ${contactSuffix}`,
            adminContactEmail
        };
    }

    return {
        isOpen: true,
        reason: "open",
        message: "El periodo de matrícula está disponible. Puede completar su registro.",
        adminContactEmail
    };
}

/**
 * Actualiza la configuración del periodo de matrícula en Firestore.
 * Requiere permisos administrativos en firestore.rules.
 * @param {Object} config - Objeto con enrollmentEnabled, enrollmentStartAt, enrollmentEndAt, adminContactEmail.
 * @param {string} adminUid - UID del administrador que realiza el cambio.
 * @returns {Promise<boolean>}
 */
export async function updateEnrollmentConfig(config, adminUid) {
    if (!adminUid) throw new Error("UID de administrador requerido para auditoría.");

    try {
        const { setDoc, doc, serverTimestamp, Timestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        const ref = doc(db, "configuracion", "registro");

        const payload = {
            ...config,
            updatedAt: serverTimestamp(),
            updatedBy: adminUid
        };

        // Convertir fechas a Timestamps de Firestore si son strings
        if (typeof payload.enrollmentStartAt === "string") {
            payload.enrollmentStartAt = Timestamp.fromDate(new Date(payload.enrollmentStartAt));
        }
        if (typeof payload.enrollmentEndAt === "string") {
            payload.enrollmentEndAt = Timestamp.fromDate(new Date(payload.enrollmentEndAt));
        }

        await setDoc(ref, payload, { merge: true });
        return true;
    } catch (error) {
        console.error("Error al actualizar configuración de matrícula:", error);
        throw error;
    }
}

/**
 * module-access-service.js
 * Servicio de control de acceso por módulo — Docencia 4.0
 * Fuente única de verdad: Firestore configuracion/modulos
 * v1.0.0 — Microfase 2.0F-1
 */

import { db } from './firebase-config.js';
import {
    doc,
    getDoc,
    setDoc,
    onSnapshot,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { auth } from './firebase-config.js';

// ─── Constante de ruta Firestore ──────────────────────────────────────────────
const CONFIG_DOC_PATH = 'configuracion/modulos';

// ─── Mapeo pageType → sección de acceso ───────────────────────────────────────
// Valores reales de data-page-type encontrados en el proyecto:
//   intro, leccion → lecciones
//   actividad      → actividades
//   foro           → foros
//   recursos       → recursos
export function mapPageTypeToSection(pageType) {
    const map = {
        intro:     'lecciones',
        leccion:   'lecciones',
        actividad: 'actividades',
        foro:      'foros',
        recursos:  'recursos',
        // aliases por compatibilidad futura
        lesson:    'lecciones',
        activity:  'actividades',
        forum:     'foros',
        resource:  'recursos',
    };
    return map[pageType] ?? null;
}

// ─── Configuración por defecto (todo habilitado) ───────────────────────────────
export function getDefaultModuleAccess() {
    return {
        modulo1: { lecciones: true, actividades: true, foros: true, recursos: true },
        modulo2: { lecciones: true, actividades: true, foros: true, recursos: true },
        modulo3: { lecciones: true, actividades: true, foros: true, recursos: true },
    };
}

// ─── Leer configuración una vez ───────────────────────────────────────────────
export async function getModuleAccessConfig() {
    try {
        const ref = doc(db, CONFIG_DOC_PATH);
        const snap = await getDoc(ref);
        if (!snap.exists()) return getDefaultModuleAccess();
        const data = snap.data();
        // Merge con defaults para garantizar que todos los campos existen
        const defaults = getDefaultModuleAccess();
        return {
            modulo1: { ...defaults.modulo1, ...(data.modulo1 ?? {}) },
            modulo2: { ...defaults.modulo2, ...(data.modulo2 ?? {}) },
            modulo3: { ...defaults.modulo3, ...(data.modulo3 ?? {}) },
        };
    } catch (err) {
        console.warn('[module-access-service] Error leyendo config, usando defaults:', err);
        return getDefaultModuleAccess();
    }
}

// ─── Suscripción en tiempo real ────────────────────────────────────────────────
// Retorna unsubscribe(). callback recibe el objeto de config o los defaults.
export function subscribeModuleAccessConfig(callback) {
    const ref = doc(db, CONFIG_DOC_PATH);
    return onSnapshot(
        ref,
        (snap) => {
            if (!snap.exists()) {
                callback(getDefaultModuleAccess());
                return;
            }
            const data = snap.data();
            const defaults = getDefaultModuleAccess();
            callback({
                modulo1: { ...defaults.modulo1, ...(data.modulo1 ?? {}) },
                modulo2: { ...defaults.modulo2, ...(data.modulo2 ?? {}) },
                modulo3: { ...defaults.modulo3, ...(data.modulo3 ?? {}) },
            });
        },
        (err) => {
            console.warn('[module-access-service] Error en snapshot, usando defaults:', err);
            callback(getDefaultModuleAccess());
        }
    );
}

// ─── Actualizar una sección de un módulo ───────────────────────────────────────
// moduleId: 'modulo1' | 'modulo2' | 'modulo3'
// sectionKey: 'lecciones' | 'actividades' | 'foros' | 'recursos'
// value: boolean
export async function updateModuleAccess(moduleId, sectionKey, value) {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const ref = doc(db, CONFIG_DOC_PATH);
    // Leer estado actual antes de escribir para no pisar otras secciones
    const current = await getModuleAccessConfig();

    await setDoc(ref, {
        ...current,
        [moduleId]: {
            ...current[moduleId],
            [sectionKey]: value,
        },
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
    }, { merge: true });
}

// ─── Consulta puntual de acceso ────────────────────────────────────────────────
// Retorna true si el participante puede acceder, false si está bloqueado.
// moduleId: 'modulo1' | 'modulo2' | 'modulo3'
// pageType: valor de data-page-type del body ('intro', 'leccion', 'actividad', 'foro', 'recursos')
export async function canAccessSection(moduleId, pageType) {
    const section = mapPageTypeToSection(pageType);
    if (!section) return true; // Tipo desconocido → no bloquear
    if (!moduleId) return true; // Sin módulo → no bloquear

    const config = await getModuleAccessConfig();
    const moduleConfig = config[moduleId];
    if (!moduleConfig) return true; // Módulo no registrado → no bloquear
    return moduleConfig[section] !== false;
}

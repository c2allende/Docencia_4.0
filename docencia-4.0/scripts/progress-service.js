import { db } from "./firebase-config.js";
import { 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    collection, 
    getDocs, 
    query, 
    where, 
    serverTimestamp, 
    increment 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * MAPA DEL CURSO (PARA EL PILOTO)
 * Define las páginas que pertenecen a cada módulo para calcular porcentajes.
 */
export const COURSE_STRUCTURE = {
    modulo1: {
        title: "Módulo 1: Fundamentos y Ética",
        totalPages: 8,
        pages: [
            { id: "modulo1_intro", type: "intro", title: "Inicio Módulo 1", url: "modulo1_intro.html" },
            { id: "leccion1_1", type: "leccion", title: "Lección 1.1", url: "leccion1_1.html" },
            { id: "leccion1_2", type: "leccion", title: "Lección 1.2", url: "leccion1_2.html" },
            { id: "leccion1_3", type: "leccion", title: "Lección 1.3", url: "leccion1_3.html" },
            { id: "actividad1_1", type: "actividad", title: "Actividad 1.1", url: "actividad1_1.html" },
            { id: "actividad1_2", type: "actividad", title: "Actividad 1.2", url: "actividad1_2.html" },
            { id: "foro_modulo1", type: "foro", title: "Foro Módulo 1", url: "foro_modulo1.html" },
            { id: "recursos_m1", type: "recursos", title: "Recursos Módulo 1", url: "recursos_m1.html" }
        ]
    },
    modulo2: {
        title: "Módulo 2: Planificación y Diseño",
        totalPages: 7,
        pages: [
            { id: "modulo2_intro", type: "intro", title: "Inicio Módulo 2", url: "modulo2_intro.html" },
            { id: "leccion2_1", type: "leccion", title: "Lección 2.1", url: "leccion2_1.html" },
            { id: "leccion2_2", type: "leccion", title: "Lección 2.2", url: "leccion2_2.html" },
            { id: "leccion2_3", type: "leccion", title: "Lección 2.3", url: "leccion2_3.html" },
            { id: "actividad2_1", type: "actividad", title: "Actividad 2.1", url: "actividad2_1.html" },
            { id: "foro_modulo2", type: "foro", title: "Foro Módulo 2", url: "foro_modulo2.html" },
            { id: "recursos_m2", type: "recursos", title: "Recursos Módulo 2", url: "recursos_m2.html" }
        ]
    }
};

/**
 * Obtiene el progreso detallado de un módulo para el dashboard pedagógico.
 */
export async function getModuleDetailedProgress(uid, moduleId) {
    const moduleConfig = COURSE_STRUCTURE[moduleId];
    if (!moduleConfig) return null;

    // Obtener todas las páginas completadas por el usuario para este módulo
    const pagesCol = collection(db, "usuarios", uid, "progresoPaginas");
    const q = query(pagesCol, where("moduleId", "==", moduleId), where("status", "==", "completed"));
    
    const breakdown = {
        contenido: { label: "Contenido formativo", completed: 0, total: 0 },
        actividades: { label: "Actividades", completed: 0, total: 0 },
        foro: { label: "Foro revisado", completed: 0, total: 0 },
        recursos: { label: "Recursos revisados", completed: 0, total: 0 }
    };

    let nextPage = null;
    let completedCount = 0;

    try {
        const querySnapshot = await getDocs(q);
        const completedIds = new Set();
        querySnapshot.forEach(doc => completedIds.add(doc.id));

        moduleConfig.pages.forEach(page => {
            const isCompleted = completedIds.has(page.id);
            if (isCompleted) completedCount++;

            // Mapeo a categorías pedagógicas
            let cat = "";
            if (page.type === "intro" || page.type === "leccion") cat = "contenido";
            else if (page.type === "actividad") cat = "actividades";
            else if (page.type === "foro") cat = "foro";
            else if (page.type === "recursos") cat = "recursos";

            if (cat && breakdown[cat]) {
                breakdown[cat].total++;
                if (isCompleted) breakdown[cat].completed++;
            }

            // Identificar próximo paso (primera no completada)
            if (!isCompleted && !nextPage) {
                nextPage = page;
            }
        });

        return {
            moduleId,
            moduleTitle: moduleConfig.title,
            percentComplete: Math.round((completedCount / moduleConfig.totalPages) * 100),
            completedPages: completedCount,
            totalPages: moduleConfig.totalPages,
            nextPage,
            breakdown
        };

    } catch (error) {
        console.error("Error al obtener progreso detallado:", error);
        return null;
    }
}

/**
 * Obtiene el listado de todos los participantes y su progreso básico.
 * (Solo para administradores)
 */
export async function getAllParticipantsProgress() {
    try {
        const usersCol = collection(db, "usuarios");
        const querySnapshot = await getDocs(usersCol);
        
        const participants = [];
        
        for (const userDoc of querySnapshot.docs) {
            const userData = userDoc.data();
            
            // Opcional: Identificar si es admin (puedes filtrar si lo prefieres)
            // if (userData.role === "admin") continue;

            const uid = userDoc.id;
            const moduleProgress = await getParticipantModuleProgress(uid);

            // Calcular última actividad (updatedAt más reciente entre módulos)
            let lastActivity = null;
            if (moduleProgress.modulo1.updatedAt) lastActivity = moduleProgress.modulo1.updatedAt;
            if (moduleProgress.modulo2.updatedAt && (!lastActivity || moduleProgress.modulo2.updatedAt > lastActivity)) {
                lastActivity = moduleProgress.modulo2.updatedAt;
            }

            participants.push({
                uid,
                displayName: userData.displayName || "Sin nombre",
                email: userData.email || "Sin email",
                role: userData.role || "participant",
                roleContext: userData.roleContext || "No especificado",
                status: userData.status || "active",
                photoURL: userData.photoURL || null,
                modulo1: moduleProgress.modulo1.percent,
                modulo2: moduleProgress.modulo2.percent,
                lastActivity: lastActivity ? lastActivity.toDate() : null
            });
        }
        
        return participants;
    } catch (error) {
        console.error("Error al obtener progreso de participantes:", error);
        throw error;
    }
}

/**
 * Obtiene el progreso resumido de módulos para un participante específico.
 */
export async function getParticipantModuleProgress(uid) {
    const results = {
        modulo1: { percent: 0, updatedAt: null },
        modulo2: { percent: 0, updatedAt: null }
    };

    try {
        const progressCol = collection(db, "usuarios", uid, "progresoModulos");
        const snapshot = await getDocs(progressCol);

        snapshot.forEach(doc => {
            const data = doc.data();
            if (results[doc.id]) {
                results[doc.id].percent = data.percentComplete || 0;
                results[doc.id].updatedAt = data.updatedAt || null;
            }
        });
    } catch (error) {
        console.warn(`No se pudo obtener progreso para el usuario ${uid}:`, error);
    }

    return results;
}

/**
 * Reutiliza la lógica de desglose pedagógico para un participante específico.
 */
export async function getParticipantDetailedProgress(uid, moduleId) {
    // Reutilizamos la lógica de getModuleDetailedProgress
    return await getModuleDetailedProgress(uid, moduleId);
}

/**
 * Registra o actualiza el inicio de visita a una página.
 */
export async function startPageProgress(uid, pageData) {
    const { pageId, moduleId, pageType, title, url } = pageData;
    const progressRef = doc(db, "usuarios", uid, "progresoPaginas", pageId);

    try {
        const docSnap = await getDoc(progressRef);
        
        if (!docSnap.exists()) {
            // Primer inicio
            await setDoc(progressRef, {
                uid,
                pageId,
                moduleId,
                pageType,
                title,
                url,
                status: "started",
                visitCount: 1,
                firstOpenedAt: serverTimestamp(),
                lastOpenedAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        } else {
            // Actualización de visita (no cambia status si ya es completed)
            await updateDoc(progressRef, {
                visitCount: increment(1),
                lastOpenedAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error("Error al registrar inicio de progreso:", error);
    }
}

/**
 * Marca una página como completada y dispara el recálculo del módulo.
 */
export async function completePageProgress(uid, pageId, moduleId) {
    const progressRef = doc(db, "usuarios", uid, "progresoPaginas", pageId);

    try {
        await updateDoc(progressRef, {
            status: "completed",
            completedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        
        // Recalcular el progreso del módulo correspondiente
        await updateModuleProgress(uid, moduleId);
    } catch (error) {
        console.error("Error al completar progreso:", error);
    }
}

/**
 * Recalcula el porcentaje de avance de un módulo.
 */
export async function updateModuleProgress(uid, moduleId) {
    const moduleConfig = COURSE_STRUCTURE[moduleId];
    if (!moduleConfig) return;

    const pagesCol = collection(db, "usuarios", uid, "progresoPaginas");
    const q = query(pagesCol, where("moduleId", "==", moduleId), where("status", "==", "completed"));

    try {
        const querySnapshot = await getDocs(q);
        const completedPages = querySnapshot.size;
        const totalPages = moduleConfig.totalPages;
        const percentComplete = Math.round((completedPages / totalPages) * 100);

        const moduleRef = doc(db, "usuarios", uid, "progresoModulos", moduleId);
        const moduleSnap = await getDoc(moduleRef);

        const data = {
            uid,
            moduleId,
            moduleTitle: moduleConfig.title,
            completedPages,
            totalPages,
            percentComplete,
            status: percentComplete === 100 ? "completed" : (percentComplete > 0 ? "in_progress" : "not_started"),
            updatedAt: serverTimestamp()
        };

        if (!moduleSnap.exists()) {
            data.startedAt = serverTimestamp();
            if (percentComplete === 100) data.completedAt = serverTimestamp();
            await setDoc(moduleRef, data);
        } else {
            if (percentComplete === 100 && !moduleSnap.data().completedAt) {
                data.completedAt = serverTimestamp();
            }
            await updateDoc(moduleRef, data);
        }
    } catch (error) {
        console.error("Error al actualizar progreso del módulo:", error);
    }
}

/**
 * Obtiene el progreso de una página específica.
 */
export async function getUserPageProgress(uid, pageId) {
    const progressRef = doc(db, "usuarios", uid, "progresoPaginas", pageId);
    const docSnap = await getDoc(progressRef);
    return docSnap.exists() ? docSnap.data() : null;
}

/**
 * Obtiene todos los módulos para el dashboard en formato objeto { moduleId: data }.
 */
export async function getAllModuleProgress(uid) {
    const modulesRef = collection(db, "usuarios", uid, "progresoModulos");
    const querySnapshot = await getDocs(modulesRef);
    const progressMap = {};
    querySnapshot.forEach(doc => {
        const data = doc.data();
        progressMap[data.moduleId] = data;
    });
    return progressMap;
}

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
        totalPages: 3,
        pages: ["leccion1_1", "actividad1_1", "recursos_m1"]
    }
};

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

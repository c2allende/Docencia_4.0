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
    increment,
    writeBatch,
    addDoc
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
        title: "Módulo 2: Planificación y Diseño de Recursos con LLM",
        totalPages: 7,
        pages: [
            { id: "modulo2_intro", type: "intro", title: "Introducción Módulo 2", url: "modulo2_intro.html" },
            { id: "leccion2_1", type: "leccion", title: "Planificación de la unidad", url: "leccion2_1.html" },
            { id: "leccion2_2", type: "leccion", title: "Diseño de materiales didácticos", url: "leccion2_2.html" },
            { id: "leccion2_3", type: "leccion", title: "Personalización del aprendizaje", url: "leccion2_3.html" },
            { id: "actividad2_1", type: "actividad", title: "Actividad 2.1: Taller de diseño", url: "actividad2_1.html" },
            { id: "foro_modulo2", type: "foro", title: "Foro Módulo 2", url: "foro_modulo2.html" },
            { id: "recursos_m2", type: "recursos", title: "Recursos Módulo 2", url: "recursos_m2.html" }
        ]
    },
    modulo3: {
        title: "Módulo 3: Gestión Administrativa y Evaluativa",
        totalPages: 8,
        pages: [
            { id: "modulo3_intro", type: "intro", title: "Introducción Módulo 3", url: "modulo3_intro.html" },
            { id: "leccion3_1", type: "leccion", title: "Diseño de evaluación automatizada", url: "leccion3_1.html" },
            { id: "leccion3_2", type: "leccion", title: "Retroalimentación formativa y afectiva", url: "leccion3_2.html" },
            { id: "leccion3_3", type: "leccion", title: "Automatización de la burocracia", url: "leccion3_3.html" },
            { id: "leccion3_4", type: "leccion", title: "Seguridad de datos", url: "leccion3_4.html" },
            { id: "actividad3_1", type: "actividad", title: "Actividad 3.1: Taller práctico", url: "actividad3_1.html" },
            { id: "foro_modulo3", type: "foro", title: "Foro Módulo 3", url: "foro_modulo3.html" },
            { id: "recursos_m3", type: "recursos", title: "Recursos Módulo 3", url: "recursos_m3.html" }
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
            if (moduleProgress.modulo3.updatedAt && (!lastActivity || moduleProgress.modulo3.updatedAt > lastActivity)) {
                lastActivity = moduleProgress.modulo3.updatedAt;
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
                modulo3: moduleProgress.modulo3.percent,
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
 * Se calcula estructuralmente para evitar anomalías por datos huérfanos.
 */
export async function getParticipantModuleProgress(uid) {
    const results = {
        modulo1: { percent: 0, updatedAt: null },
        modulo2: { percent: 0, updatedAt: null },
        modulo3: { percent: 0, updatedAt: null }
    };

    try {
        // Obtenemos los documentos de resumen guardados
        const progressCol = collection(db, "usuarios", uid, "progresoModulos");
        const snapshot = await getDocs(progressCol);

        snapshot.forEach(doc => {
            const data = doc.data();
            if (results[doc.id]) {
                // Aplicamos saneamiento: máximo 100%
                let percent = data.percentComplete || 0;
                if (percent > 100) {
                    console.warn(`[QA] Progreso anómalo detectado para ${uid} en ${doc.id}: ${percent}%. Saneando a 100%.`);
                    percent = 100;
                }
                results[doc.id].percent = percent;
                results[doc.id].updatedAt = data.updatedAt || null;
            }
        });

        // Si el porcentaje es 0 o parece inconsistente, podríamos recalcularlo aquí,
        // pero por ahora confiamos en el saneamiento y en que updateModuleProgress 
        // ahora es más robusto.
        
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
 * Recalcula el porcentaje de avance de un módulo de forma estructural.
 * Solo cuenta páginas que pertenecen a la COURSE_STRUCTURE actual.
 */
export async function updateModuleProgress(uid, moduleId) {
    const moduleConfig = COURSE_STRUCTURE[moduleId];
    if (!moduleConfig) return;

    try {
        // 1. Obtener todas las páginas completadas del usuario
        const pagesCol = collection(db, "usuarios", uid, "progresoPaginas");
        const q = query(pagesCol, where("moduleId", "==", moduleId), where("status", "==", "completed"));
        const querySnapshot = await getDocs(q);
        
        const completedIds = new Set();
        querySnapshot.forEach(doc => completedIds.add(doc.id));

        // 2. Contar solo las que existen en la estructura oficial
        let completedCount = 0;
        const officialIds = moduleConfig.pages.map(p => p.id);
        
        officialIds.forEach(id => {
            if (completedIds.has(id)) completedCount++;
        });

        // 3. Detectar documentos huérfanos para auditoría
        if (querySnapshot.size > completedCount) {
            console.warn(`[QA] Usuario ${uid} tiene ${querySnapshot.size - completedCount} documentos huérfanos en el módulo ${moduleId}.`);
        }

        const totalPages = moduleConfig.totalPages;
        let percentComplete = Math.round((completedCount / totalPages) * 100);
        
        // Límite de seguridad
        if (percentComplete > 100) percentComplete = 100;
        if (completedCount > totalPages) completedCount = totalPages;

        const moduleRef = doc(db, "usuarios", uid, "progresoModulos", moduleId);
        const moduleSnap = await getDoc(moduleRef);

        const data = {
            uid,
            moduleId,
            moduleTitle: moduleConfig.title,
            completedPages: completedCount,
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
/**
 * Registra una acción administrativa en el log de auditoría.
 */
export async function logAdminAction(data) {
    try {
        const logsCol = collection(db, "adminLogs");
        await addDoc(logsCol, {
            ...data,
            createdAt: serverTimestamp()
        });
        console.log("[AdminLog] Acción registrada:", data.action);
    } catch (error) {
        console.error("[AdminLog] Error al registrar acción:", error);
    }
}

/**
 * Reinicia el progreso de un usuario para un módulo específico.
 * (Solo para administradores)
 */
export async function resetUserModuleProgress(uid, moduleId, adminInfo) {
    const moduleConfig = COURSE_STRUCTURE[moduleId];
    if (!moduleConfig) throw new Error("Módulo no válido");

    const batch = writeBatch(db);

    try {
        // 1. Identificar y actualizar páginas existentes del módulo
        const pagesCol = collection(db, "usuarios", uid, "progresoPaginas");
        const q = query(pagesCol, where("moduleId", "==", moduleId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((pageDoc) => {
            const pageRef = doc(db, "usuarios", uid, "progresoPaginas", pageDoc.id);
            batch.update(pageRef, {
                status: "started",
                completedAt: null,
                updatedAt: serverTimestamp()
                // Se conservan visitCount, firstOpenedAt, lastOpenedAt por defecto al no incluirlos en el update
            });
        });

        // 2. Actualizar documento de resumen del módulo
        const modRef = doc(db, "usuarios", uid, "progresoModulos", moduleId);
        batch.update(modRef, {
            completedPages: 0,
            percentComplete: 0,
            status: "not_started",
            completedAt: null,
            updatedAt: serverTimestamp()
        });

        // 3. Ejecutar lote
        await batch.commit();

        // 4. Registrar auditoría
        await logAdminAction({
            action: "reset_module_progress",
            targetUid: uid,
            targetEmail: adminInfo.targetEmail || "Desconocido",
            moduleId: moduleId,
            moduleTitle: moduleConfig.title,
            performedBy: adminInfo.adminUid,
            performedByEmail: adminInfo.adminEmail,
            note: adminInfo.note || "Reinicio administrativo de progreso"
        });

        return true;
    } catch (error) {
        console.error("Error en resetUserModuleProgress:", error);
        throw error;
    }
}

/**
 * DETECCIÓN DE DATOS HUÉRFANOS (MODO AUDITORÍA)
 * Identifica documentos de progreso que no pertenecen a la estructura oficial del curso.
 */
export async function detectUserOrphanData(uid, includeArchived = false) {
    if (!uid) return [];
    const orphans = [];

    try {
        // 1. Obtener todas las páginas y módulos del usuario
        const [pagesSnap, modulesSnap] = await Promise.all([
            getDocs(collection(db, `usuarios/${uid}/progresoPaginas`)),
            getDocs(collection(db, `usuarios/${uid}/progresoModulos`))
        ]);

        // Mapear estructura oficial para búsqueda rápida
        const officialPages = [];
        const officialModules = Object.keys(COURSE_STRUCTURE);
        
        officialModules.forEach(mId => {
            COURSE_STRUCTURE[mId].pages.forEach(p => {
                officialPages.push({ id: p.id, moduleId: mId });
            });
        });

        // 2. Analizar progresoPaginas
        pagesSnap.forEach(docSnap => {
            const data = docSnap.data();
            const pageId = docSnap.id;
            const officialPage = officialPages.find(p => p.id === pageId);
            const isArchived = data.archived === true;

            // Si ya está archivado y no pedimos verlos, saltar
            if (isArchived && !includeArchived) return;

            let reason = null;
            let recommendation = "Revisar en Firestore: puede ser un ID antiguo o de prueba.";

            if (!officialPage) {
                reason = "Página no existe en COURSE_STRUCTURE.";
            } else if (data.moduleId && data.moduleId !== officialPage.moduleId) {
                reason = `Módulo incongruente. Registrado en ${data.moduleId}, pertenece a ${officialPage.moduleId}.`;
                recommendation = "Corregir moduleId o archivar si es duplicado.";
            } else if (!data.status || !data.updatedAt) {
                reason = "Documento con campos obligatorios faltantes (status/updatedAt).";
                recommendation = "Documento incompleto, se recomienda archivar.";
            }

            if (reason || isArchived) {
                orphans.push({
                    orphanType: "page",
                    orphanId: pageId,
                    moduleId: data.moduleId || "Desconocido",
                    reason: reason || "Documento archivado preventivamente.",
                    lastUpdated: data.updatedAt ? new Date(data.updatedAt.seconds * 1000).toLocaleString() : "N/A",
                    currentStatus: data.status || "N/A",
                    recommendation: isArchived ? "Documento ya archivado lógico." : recommendation,
                    isArchived: isArchived
                });
            }
        });

        // 3. Analizar progresoModulos
        modulesSnap.forEach(docSnap => {
            const data = docSnap.data();
            const moduleId = docSnap.id;
            const isArchived = data.archived === true;

            if (isArchived && !includeArchived) return;

            if (!officialModules.includes(moduleId) || isArchived) {
                orphans.push({
                    orphanType: "module",
                    orphanId: moduleId,
                    moduleId: moduleId,
                    reason: isArchived ? "Documento archivado preventivamente." : "ID de módulo no reconocido en la estructura actual.",
                    lastUpdated: data.updatedAt ? new Date(data.updatedAt.seconds * 1000).toLocaleString() : "N/A",
                    currentStatus: data.status || "N/A",
                    recommendation: isArchived ? "Documento ya archivado lógico." : "Revisar si es un módulo de una versión previa del curso.",
                    isArchived: isArchived
                });
            }
        });

        return orphans;
    } catch (error) {
        console.error("Error detectando datos huérfanos:", error);
        return [];
    }
}

/**
 * ARCHIVADO LÓGICO DE DATOS HUÉRFANOS
 * Inyecta campos de archivado en documentos que no pertenecen a la estructura oficial.
 * (Solo para administradores)
 */
export async function archiveOrphanProgress(uid, orphanData, adminInfo) {
    if (!uid || !orphanData || !adminInfo) throw new Error("Parámetros insuficientes");
    
    const { orphanId, orphanType, reason, moduleId } = orphanData;
    if (!["page", "module"].includes(orphanType)) throw new Error("Tipo de huérfano no soportado");

    const collectionName = orphanType === "page" ? "progresoPaginas" : "progresoModulos";
    const docRef = doc(db, "usuarios", uid, collectionName, orphanId);

    try {
        // 1. Ejecutar actualización lógica (Solo los 5 campos aprobados por reglas)
        await updateDoc(docRef, {
            archived: true,
            archivedAt: serverTimestamp(),
            archivedBy: adminInfo.uid,
            archiveReason: reason || "Archivado administrativo preventivo",
            updatedAt: serverTimestamp()
        });

        // 2. Registrar auditoría obligatoria en adminLogs
        await logAdminAction({
            action: "archive_orphan_progress",
            targetUid: uid,
            targetEmail: adminInfo.targetEmail || "Desconocido",
            orphanType: orphanType,
            orphanId: orphanId,
            moduleId: moduleId || "N/A",
            reason: reason || "N/A",
            performedBy: adminInfo.uid,
            performedByEmail: adminInfo.email,
            createdAt: serverTimestamp(),
            note: `Archivado lógico de ${orphanType} huérfana: ${orphanId}`
        });

        return true;
    } catch (error) {
        console.error("Error en archiveOrphanProgress:", error);
        throw error;
    }
}

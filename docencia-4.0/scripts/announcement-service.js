import { db } from "./firebase-config.js";
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    addDoc, 
    updateDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp,
    Timestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Crea un nuevo anuncio en la colección 'anuncios'.
 */
export async function createAnnouncement(data, uid) {
    const announcementData = {
        title: data.title || '',
        message: data.message || '',
        scope: data.scope || 'global', // global o module
        moduleId: data.moduleId || null,
        priority: data.priority || 'normal', // normal, importante, urgente
        status: data.status || 'draft', // draft, published, archived
        isActive: data.isActive !== undefined ? data.isActive : true,
        publishAt: data.publishAt || serverTimestamp(),
        expiresAt: data.expiresAt || null,
        createdBy: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    try {
        const docRef = await addDoc(collection(db, "anuncios"), announcementData);
        return docRef.id;
    } catch (error) {
        console.error("Error al crear anuncio:", error);
        throw error;
    }
}

/**
 * Obtiene anuncios activos para los participantes.
 * Filtra por status, isActive y vigencia.
 */
export async function getVisibleAnnouncements() {
    try {
        const now = Timestamp.now();
        // Consulta base: publicados y activos
        const q = query(
            collection(db, "anuncios"),
            where("status", "==", "published"),
            where("isActive", "==", true),
            orderBy("publishAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const announcements = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Filtrado de vigencia en el cliente para evitar problemas de índices complejos iniciales
            const isPublished = data.publishAt ? data.publishAt.toDate() <= now.toDate() : true;
            const isNotExpired = !data.expiresAt || data.expiresAt.toDate() > now.toDate();
            
            if (isPublished && isNotExpired) {
                announcements.push({ id: doc.id, ...data });
            }
        });

        return announcements;
    } catch (error) {
        console.error("Error al obtener anuncios visibles:", error);
        throw error;
    }
}

/**
 * Obtiene todos los anuncios para el panel de administración.
 */
export async function getAdminAnnouncements() {
    try {
        const q = query(
            collection(db, "anuncios"),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error al obtener anuncios para admin:", error);
        throw error;
    }
}

/**
 * Actualiza un anuncio existente.
 */
export async function updateAnnouncement(id, data) {
    const announcementRef = doc(db, "anuncios", id);
    try {
        await updateDoc(announcementRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error al actualizar anuncio:", error);
        throw error;
    }
}

/**
 * Borrado lógico (Archivar).
 */
export async function archiveAnnouncement(id) {
    return updateAnnouncement(id, {
        status: "archived",
        isActive: false
    });
}

/**
 * Registra que un usuario ha leído un anuncio.
 */
export async function markAsRead(announcementId, uid) {
    if (!uid || !announcementId) return;
    const readRef = doc(db, "usuarios", uid, "anuncioLecturas", announcementId);
    try {
        await setDoc(readRef, {
            announcementId,
            readAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error al marcar como leído:", error);
    }
}

/**
 * Obtiene la lista de IDs de anuncios leídos por un usuario.
 */
export async function getUserReadStatus(uid) {
    if (!uid) return [];
    try {
        const readsRef = collection(db, "usuarios", uid, "anuncioLecturas");
        const querySnapshot = await getDocs(readsRef);
        return querySnapshot.docs.map(doc => doc.id);
    } catch (error) {
        console.error("Error al obtener estado de lectura:", error);
        return [];
    }
}

/**
 * Formatea un Firestore Timestamp o Date a una cadena legible (es-PR)
 * Formato: "28 de abril de 2026, 9:35 a. m."
 * Esta función es exportada para uso en handlers de admin y participantes.
 */
export function formatAnnouncementDateTime(timestamp) {
    if (!timestamp) return "Fecha no disponible";
    
    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat("es-PR", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "America/Puerto_Rico"
        }).format(date);
    } catch (e) {
        console.error("Error formateando fecha:", e);
        return "Fecha no válida";
    }
}

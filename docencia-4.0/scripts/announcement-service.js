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
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
        // Obtenemos la hora del cliente
        const clientNow = Date.now();
        
        // MARGEN DE RELOJ (Clock Drift Margin): 5 minutos
        // Firebase Rules exige matemáticamente que 'publishAt <= request.time' y 'expiresAt > request.time'.
        // Como el reloj del cliente nunca está 100% sincronizado con el servidor de Google, la consulta 
        // fallará con Permission Denied si el cliente está adelantado o atrasado por un milisegundo.
        // Al restar 5 minutos para publishAt y sumar 5 minutos para expiresAt, garantizamos que la 
        // consulta es ESTRICTAMENTE MÁS RÍGIDA que la regla, pasando así la validación del firewall.
        const safePublishBound = Timestamp.fromMillis(clientNow - 5 * 60 * 1000); 
        const safeExpireBound = Timestamp.fromMillis(clientNow + 5 * 60 * 1000);

        // Consulta 1: publicados, activos, vigentes (margen) y sin expiración
        const q1 = query(
            collection(db, "anuncios"),
            where("status", "==", "published"),
            where("isActive", "==", true),
            where("publishAt", "<=", safePublishBound),
            where("expiresAt", "==", null)
        );

        // Consulta 2: publicados, activos, vigentes (margen) y que aún no expiran (margen)
        const q2 = query(
            collection(db, "anuncios"),
            where("status", "==", "published"),
            where("isActive", "==", true),
            where("publishAt", "<=", safePublishBound),
            where("expiresAt", ">", safeExpireBound)
        );

        const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        
        const announcementsMap = new Map();
        
        snapshot1.forEach(doc => announcementsMap.set(doc.id, { id: doc.id, ...doc.data() }));
        snapshot2.forEach(doc => announcementsMap.set(doc.id, { id: doc.id, ...doc.data() }));

        const announcements = Array.from(announcementsMap.values());
        
        // Ordenamiento seguro en memoria
        announcements.sort((a, b) => {
            const timeA = a.publishAt?.toMillis() || a.createdAt?.toMillis() || 0;
            const timeB = b.publishAt?.toMillis() || b.createdAt?.toMillis() || 0;
            return timeB - timeA;
        });

        // Filtro final defensivo (usando la hora real para mostrar, el margen era solo para Firebase)
        const realNow = Timestamp.fromMillis(clientNow);
        return announcements.filter(data => {
            const isPublished = data.publishAt ? data.publishAt.toDate() <= realNow.toDate() : true;
            const isNotExpired = !data.expiresAt || data.expiresAt.toDate() > realNow.toDate();
            return isPublished && isNotExpired;
        });
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

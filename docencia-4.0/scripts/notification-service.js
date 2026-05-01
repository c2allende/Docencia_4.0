import { db, auth } from './firebase-config.js';
import { 
    collection, 
    doc, 
    setDoc, 
    updateDoc, 
    getDocs, 
    getCountFromServer, 
    onSnapshot, 
    query, 
    where, 
    orderBy, 
    limit, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Obtiene notificaciones de un usuario (no archivadas) para consultas directas.
 */
export async function getUserNotifications(uid) {
    if (!auth.currentUser) throw new Error("No autenticado");
    const notifsRef = collection(db, "usuarios", uid, "notificaciones");
    const q = query(
        notifsRef, 
        where("status", "in", ["unread", "read"]), 
        orderBy("createdAt", "desc"),
        limit(20)
    );
    const snap = await getDocs(q);
    const results = [];
    snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
    return results;
}

/**
 * Escucha cambios en tiempo real en la cantidad de notificaciones no leídas.
 */
export function subscribeToUnreadNotifications(uid, callback) {
    if (!auth.currentUser) return () => {};
    const notifsRef = collection(db, "usuarios", uid, "notificaciones");
    const q = query(notifsRef, where("status", "==", "unread"));
    return onSnapshot(q, (snapshot) => {
        const count = snapshot.size;
        callback(count);
    }, (error) => {
        console.error("Error al escuchar notificaciones no leídas:", error);
    });
}

/**
 * Escucha en tiempo real las 5 notificaciones recientes (leídas y no leídas).
 */
export function subscribeToRecentNotifications(uid, callback) {
    if (!auth.currentUser) return () => {};
    const notifsRef = collection(db, "usuarios", uid, "notificaciones");
    const q = query(
        notifsRef, 
        where("status", "in", ["unread", "read"]), 
        orderBy("createdAt", "desc"), 
        limit(5)
    );
    
    return onSnapshot(q, (snapshot) => {
        const notifications = [];
        snapshot.forEach(doc => {
            notifications.push({ id: doc.id, ...doc.data() });
        });
        callback(notifications);
    }, (error) => {
        console.error("Error al escuchar notificaciones recientes:", error);
    });
}

/**
 * Marca una notificación como leída.
 */
export async function markNotificationAsRead(uid, notificationId) {
    if (!auth.currentUser) throw new Error("No autenticado");
    const notifRef = doc(db, "usuarios", uid, "notificaciones", notificationId);
    await updateDoc(notifRef, {
        status: "read",
        readAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
}

/**
 * Marca una notificación como archivada.
 */
export async function archiveNotification(uid, notificationId) {
    if (!auth.currentUser) throw new Error("No autenticado");
    const notifRef = doc(db, "usuarios", uid, "notificaciones", notificationId);
    await updateDoc(notifRef, {
        status: "archived",
        updatedAt: serverTimestamp()
    });
}

/**
 * Obtiene el conteo de no leídas directamente (one-off).
 */
export async function getUnreadNotificationCount(uid) {
    if (!auth.currentUser) throw new Error("No autenticado");
    const notifsRef = collection(db, "usuarios", uid, "notificaciones");
    const q = query(notifsRef, where("status", "==", "unread"));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
}

/**
 * Crea una notificación para otro usuario. Exclusivo para admins en Fase 2.0A.
 */
export async function createUserNotification(targetUid, payload) {
    if (!auth.currentUser) throw new Error("No autenticado");
    
    // Generar un ID predecible para evitar duplicados (o uno nuevo si no hay sourceId)
    let uniqueId = payload.sourceId ? `${payload.sourceType}_${payload.sourceId}` : null;
    let notifRef;
    
    if (uniqueId) {
        notifRef = doc(db, "usuarios", targetUid, "notificaciones", uniqueId);
    } else {
        notifRef = doc(collection(db, "usuarios", targetUid, "notificaciones"));
    }
    
    const notificationData = {
        type: payload.type,
        title: payload.title,
        message: payload.message,
        status: "unread",
        priority: payload.priority || "normal",
        sourceType: payload.sourceType,
        createdAt: serverTimestamp()
    };
    
    // Campos opcionales
    if (payload.sourceId) notificationData.sourceId = payload.sourceId;
    if (payload.moduleId) notificationData.moduleId = payload.moduleId;
    if (payload.actionUrl) notificationData.actionUrl = payload.actionUrl;
    
    await setDoc(notifRef, notificationData, { merge: true });
    return notifRef.id;
}

import { db } from "./firebase-config.js";
import { 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Crea o actualiza el perfil de un usuario en Firestore.
 * @param {Object} user - Objeto de usuario de Firebase Auth.
 * @param {Object} additionalData - Datos adicionales como displayName y roleContext.
 */
export async function createUserProfile(user, additionalData = {}) {
    if (!user) return;

    const userRef = doc(db, "usuarios", user.uid);
    const profile = {
        uid: user.uid,
        email: user.email,
        displayName: additionalData.displayName || user.displayName || "Participante",
        roleContext: additionalData.roleContext || "",
        role: additionalData.role || "participant",
        status: additionalData.status || "active",
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    try {
        await setDoc(userRef, profile, { merge: true });
        return profile;
    } catch (error) {
        console.error("Error al crear perfil en Firestore:", error);
        throw error;
    }
}

/**
 * Obtiene el perfil de un usuario desde Firestore.
 * @param {string} uid - ID del usuario.
 */
export async function getUserProfile(uid) {
    if (!uid) return null;
    try {
        const userRef = doc(db, "usuarios", uid);
        const snap = await getDoc(userRef);
        return snap.exists() ? snap.data() : null;
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        return null;
    }
}

/**
 * Actualiza campos específicos del perfil.
 * @param {string} uid - ID del usuario.
 * @param {Object} data - Datos a actualizar.
 */
export async function updateUserProfile(uid, data) {
    if (!uid) return;
    const userRef = doc(db, "usuarios", uid);
    try {
        await updateDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        throw error;
    }
}

/**
 * Verifica si el usuario actual tiene rol de administrador.
 * @param {string} uid - ID del usuario.
 */
export async function isAdmin(uid) {
    const profile = await getUserProfile(uid);
    return profile?.role === "admin" && profile?.status === "active";
}

/**
 * Obtiene el rol actual del usuario.
 * @param {string} uid - ID del usuario.
 */
export async function getCurrentUserRole(uid) {
    const profile = await getUserProfile(uid);
    return profile?.role || "guest";
}

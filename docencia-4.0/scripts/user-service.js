import { db, auth } from "./firebase-config.js";
import { 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    serverTimestamp,
    collection,
    query,
    orderBy,
    getDocs,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

    console.log("DIAGNÓSTICO: Intentando crear perfil para UID:", user.uid);
    console.log("DIAGNÓSTICO: Datos del perfil:", profile);

    try {
        await setDoc(userRef, profile, { merge: true });
        console.log("DIAGNÓSTICO: Perfil creado exitosamente en Firestore.");
        return profile;
    } catch (error) {
        console.error("DIAGNÓSTICO: Error crítico al crear perfil:", error);
        console.error("DIAGNÓSTICO: Código de error:", error.code);
        console.error("DIAGNÓSTICO: Mensaje de error:", error.message);
        throw error;
    }
}

/**
 * Obtiene el perfil de un usuario desde Firestore.
 * @param {string} uid - ID del usuario.
 */
export async function getUserProfile(uid) {
    if (!uid) return null;
    
    // PASO 6: Logs temporales para diagnóstico
    console.log("[USER_SERVICE] getUserProfile uid requested", uid);
    console.log("[USER_SERVICE] current auth uid", auth.currentUser?.uid);
    console.log("[USER_SERVICE] uid match", auth.currentUser?.uid === uid);

    try {
        const userRef = doc(db, "usuarios", uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
            console.warn(`[USER_SERVICE] Perfil no encontrado para UID: ${uid}`);
            return null; // El documento no existe
        }
        return snap.data();
    } catch (error) {
        // Enriquecemos el error para el diagnóstico
        const enhancedError = new Error(error.message);
        enhancedError.code = error.code || "unknown";
        enhancedError.uid = uid;
        
        console.error("[USER_SERVICE] Fallo en lectura de perfil:", {
            code: enhancedError.code,
            message: enhancedError.message,
            uid: uid
        });
        
        throw enhancedError; 
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

/**
 * Obtiene la lista completa de usuarios para administración.
 */
export async function getAllUsers() {
    try {
        const usersRef = collection(db, "usuarios");
        const q = query(usersRef, orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        
        const users = [];
        snap.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return users;
    } catch (error) {
        console.error("Error al obtener todos los usuarios:", error);
        throw error;
    }
}

/**
 * Actualiza el estado de acceso de un usuario (Borrado lógico / Inactivación).
 */
export async function updateUserStatus(targetUid, targetEmail, newStatus, accessRevoked, note = "") {
    if (!targetUid) throw new Error("UID de destino requerido");
    
    // Proteger Admin Principal
    const MAIN_ADMIN_UID = "9l2MOKU8Y9ayX9yHmxtAcpGkzcJ2";
    if (targetUid === MAIN_ADMIN_UID) {
        throw new Error("No se puede modificar el estado del administrador principal.");
    }

    try {
        const userRef = doc(db, "usuarios", targetUid);
        const userSnap = await getDoc(userRef);
        const previousData = userSnap.exists() ? userSnap.data() : {};

        const updateData = {
            status: newStatus,
            accessRevoked: accessRevoked,
            updatedAt: serverTimestamp(),
            updatedBy: auth.currentUser?.uid || "system"
        };

        if (accessRevoked) {
            updateData.accessRevokedAt = serverTimestamp();
            updateData.accessRevokedBy = auth.currentUser?.uid || "system";
        }

        await updateDoc(userRef, updateData);

        // Registrar en adminLogs
        let action = "user_updated";
        if (newStatus === "active") action = "user_activated";
        else if (newStatus === "inactive") action = "user_deactivated";
        else if (newStatus === "archived") action = "user_archived";

        await addDoc(collection(db, "adminLogs"), {
            action: action,
            targetUid: targetUid,
            targetEmail: targetEmail || previousData.email || "unknown",
            previousStatus: previousData.status || "unknown",
            newStatus: newStatus,
            performedBy: auth.currentUser?.uid || "system",
            performedByEmail: auth.currentUser?.email || "system",
            createdAt: serverTimestamp(),
            note: note || `Cambio de estado a ${newStatus}`
        });

        return true;
    } catch (error) {
        console.error("Error al actualizar estado de usuario:", error);
        throw error;
    }
}

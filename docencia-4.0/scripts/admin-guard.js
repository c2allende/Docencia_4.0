import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-config.js";
import { getUserProfile } from "./user-service.js";

/**
 * ADMIN GUARD: Protege las páginas operativas/administrativas.
 * Valida el rol directamente en Firestore.
 */
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const profile = await getUserProfile(user.uid);
            
            // Lógica de autorización: Rol Admin en Firestore OR Fallback por Email (Temporal)
            const isAuthorized = (profile?.role === "admin" && profile?.status === "active") || 
                                 (user.email === "carmelo.allende@gmail.com");

            if (!isAuthorized) {
                console.warn("Acceso denegado: Se requiere cuenta administrativa.");
                window.location.href = "dashboard.html";
            }
        } catch (error) {
            console.error("Error en Admin Guard (Firestore):", error);
            // Fallback de emergencia si falla Firestore
            if (user.email !== "carmelo.allende@gmail.com") {
                window.location.href = "dashboard.html";
            }
        }
    }
    // Si no hay user, auth-guard.js ya se encarga de la redirección a index.html
});

import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "./firebase-config.js";
import { getUserProfile, createUserProfile } from "./user-service.js";

/**
 * AUTH GUARD: Protege las páginas privadas.
 * Verifica autenticación y estado del usuario en Firestore.
 */
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html"; 
    } else {
        try {
            let profile = await getUserProfile(user.uid);
            
            // Auto-creación de perfil si no existe en Firestore (para usuarios antiguos de Auth)
            if (!profile) {
                console.info("Perfil no encontrado. Creando entrada en Firestore...");
                profile = await createUserProfile(user, {
                    role: "participant",
                    status: "active"
                });
            }

            // Bloqueo por estado o revocación manual
            if (profile && (profile.status === "inactive" || profile.status === "archived" || profile.accessRevoked === true)) {
                console.warn("Acceso denegado: Cuenta inactiva o acceso revocado.");
                await signOut(auth);
                alert("Tu acceso al programa no está activo. Comunícate con el administrador.");
                window.location.href = "index.html";
            }
        } catch (error) {
            console.error("Error al verificar estado del usuario:", error);
        }
    }
});

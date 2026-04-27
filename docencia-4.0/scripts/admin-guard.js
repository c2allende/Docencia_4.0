import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

/**
 * ADMIN GUARD: Protege las páginas operativas/administrativas.
 * Solo permite el acceso si el email es carmelo.allende@gmail.com.
 * Si no hay sesión, auth-guard.js lo mandará a index.html.
 * Si hay sesión pero no es admin, lo manda a dashboard.html.
 */
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.email !== "carmelo.allende@gmail.com") {
            console.warn("Acceso denegado: Se requiere cuenta administrativa.");
            window.location.href = "dashboard.html";
        }
    }
    // Si no hay user, auth-guard.js ya se encarga de la redirección al login.
});

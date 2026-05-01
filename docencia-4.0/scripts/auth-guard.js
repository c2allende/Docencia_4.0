import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

/**
 * AUTH GUARD: Protege las páginas privadas.
 * Si no hay un usuario autenticado, redirige a index.html.
 */
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html"; 
    }
});

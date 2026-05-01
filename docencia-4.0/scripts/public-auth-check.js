import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Si el usuario ya está autenticado, lo mandamos al dashboard
        window.location.href = "dashboard.html";
    }
});

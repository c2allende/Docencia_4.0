import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

onAuthStateChanged(auth, (user) => {
    const path = window.location.pathname;
    const isAuthPage = path.endsWith('login.html') || path.endsWith('registro.html') || path.endsWith('recuperar_password.html');

    if (!user && !isAuthPage) {
        // Si no hay usuario y no está en una página de auth, redirigir al login
        window.location.href = "login.html"; 
    } else if (user && isAuthPage) {
        // Si ya hay usuario y está en el login, mandarlo al dashboard
        window.location.href = "dashboard.html";
    }
});

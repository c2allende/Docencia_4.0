import { auth } from "./firebase-config.js";
import { getFunctions } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js";

// Inicializar functions usando la instancia app existente en auth
export const functionsClient = getFunctions(auth.app);

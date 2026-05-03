import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración mínima (tomada de firebase-config.js usualmente)
// Pero como no puedo importar archivos locales fácilmente en un script de node fuera del entorno browser sin configurar todo,
// voy a intentar leer firebase-config.js primero para obtener la config.

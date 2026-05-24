import { auth, db } from './firebase-config.js';
import { collection, query, getDocs, writeBatch, where } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Ya que admin-guard.js protege la página, sabemos que si auth resuelve, el usuario está logueado (y es admin o no fue rebotado).
// Pero para acciones destructivas, vamos a asegurarnos.

class AdminMaintenanceHandler {
    constructor() {
        this.init();
    }

    init() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.currentUser = user;
                this.bindEvents();
            } else {
                this.disableAllButtons();
            }
        });
    }

    disableAllButtons() {
        document.querySelectorAll('.btn-action').forEach(btn => btn.disabled = true);
        document.querySelectorAll('.status-message').forEach(el => this.setStatus(el.id, "Sesión no válida.", "error"));
    }

    bindEvents() {
        // Board Act 1.1
        document.getElementById('btnCountAct11Board')?.addEventListener('click', () => this.countAct11Board());
        document.getElementById('btnCleanAct11Board')?.addEventListener('click', () => this.cleanAct11Board());

        // Progreso LMS
        document.getElementById('btnCountProgressTestUser')?.addEventListener('click', () => this.countProgress());
        document.getElementById('btnCleanProgressTestUser')?.addEventListener('click', () => this.cleanProgress());
    }

    setStatus(elementId, message, type = 'info') {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.textContent = message;
        el.className = `status-message ${type}`;
    }

    requireTypedConfirmation(label) {
        const confirmed = window.confirm(
            `Vas a limpiar datos de prueba de: ${label}. Esta acción no se puede deshacer. ¿Deseas continuar?`
        );

        if (!confirmed) return false;

        const typed = window.prompt(
            `Para confirmar, escribe LIMPIAR exactamente en mayúsculas.`
        );

        return typed === 'LIMPIAR';
    }

    async countCollectionDocs(path) {
        const ref = collection(db, path);
        const snapshot = await getDocs(ref);
        return snapshot.size;
    }

    async deleteCollectionDocsInBatches(collectionPath, statusElementId) {
        try {
            const ref = collection(db, collectionPath);
            const snapshot = await getDocs(ref);

            if (snapshot.empty) {
                this.setStatus(statusElementId, 'No hay registros para limpiar.', 'info');
                return { deleted: 0 };
            }

            let batch = writeBatch(db);
            let count = 0;
            let batchCount = 0;

            for (const docSnap of snapshot.docs) {
                batch.delete(docSnap.ref);
                count++;
                batchCount++;

                if (batchCount === 450) {
                    await batch.commit();
                    batch = writeBatch(db);
                    batchCount = 0;
                }
            }

            if (batchCount > 0) {
                await batch.commit();
            }

            this.setStatus(statusElementId, `Limpieza completada. Registros eliminados: ${count}.`, 'success');
            return { deleted: count };
        } catch (error) {
            console.error(`Error limpiando coleccion ${collectionPath}:`, error);
            this.setStatus(statusElementId, `Error al limpiar. Revisa la consola.`, 'error');
            return { deleted: 0, error };
        }
    }

    // --- Board Act 1.1 ---
    
    async countAct11Board() {
        const statusId = 'statusAct11Board';
        this.setStatus(statusId, 'Consultando registros...', 'info');
        
        try {
            const size = await this.countCollectionDocs('sessions/actividad1_1/responses');
            if (size === 0) {
                this.setStatus(statusId, 'No hay datos de prueba.', 'info');
                document.getElementById('btnCleanAct11Board').disabled = true;
            } else {
                this.setStatus(statusId, `Se encontraron ${size} registros.`, 'warning');
                document.getElementById('btnCleanAct11Board').disabled = false;
            }
        } catch (err) {
            console.error("Error al contar board:", err);
            this.setStatus(statusId, 'Error al contar. Revisa consola.', 'error');
        }
    }

    async cleanAct11Board() {
        const statusId = 'statusAct11Board';
        if (!this.requireTypedConfirmation('Board Actividad 1.1')) {
            this.setStatus(statusId, 'Acción cancelada. No se eliminó ningún dato.', 'info');
            return;
        }

        this.setStatus(statusId, 'Limpiando registros...', 'info');
        document.getElementById('btnCleanAct11Board').disabled = true;
        
        await this.deleteCollectionDocsInBatches('sessions/actividad1_1/responses', statusId);
    }

    // --- Progreso LMS ---

    async getTestUserUid(email) {
        // En Firestore, la coleccion 'usuarios' usa el UID como document id, y tiene un campo 'email'
        const usersRef = collection(db, 'usuarios');
        const q = query(usersRef, where("email", "==", email));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        return snap.docs[0].id;
    }

    async countProgress() {
        const statusId = 'statusProgressTestUser';
        const email = document.getElementById('testUserEmail').value.trim();
        
        if (!email) {
            this.setStatus(statusId, 'Introduce un correo válido.', 'error');
            return;
        }

        this.setStatus(statusId, 'Consultando usuario y registros...', 'info');

        try {
            const uid = await this.getTestUserUid(email);
            if (!uid) {
                this.setStatus(statusId, 'Usuario no encontrado en la base de datos.', 'error');
                document.getElementById('btnCleanProgressTestUser').disabled = true;
                return;
            }

            const sizePaginas = await this.countCollectionDocs(`usuarios/${uid}/progresoPaginas`);
            const sizeModulos = await this.countCollectionDocs(`usuarios/${uid}/progresoModulos`);
            
            const total = sizePaginas + sizeModulos;

            if (total === 0) {
                this.setStatus(statusId, 'El usuario existe, pero no tiene registros de progreso.', 'info');
                document.getElementById('btnCleanProgressTestUser').disabled = true;
            } else {
                this.setStatus(statusId, `Usuario encontrado. Se encontraron ${total} registros (Páginas: ${sizePaginas}, Módulos: ${sizeModulos}).`, 'warning');
                document.getElementById('btnCleanProgressTestUser').disabled = false;
                // Guardar UID para uso futuro
                this.currentTestUid = uid;
            }
        } catch (err) {
            console.error("Error al buscar progreso:", err);
            this.setStatus(statusId, 'Error al consultar. Revisa consola.', 'error');
        }
    }

    async cleanProgress() {
        const statusId = 'statusProgressTestUser';
        const email = document.getElementById('testUserEmail').value.trim();

        if (!this.currentTestUid) {
            this.setStatus(statusId, 'Realiza el conteo primero.', 'error');
            return;
        }

        if (!this.requireTypedConfirmation(`Progreso del usuario ${email}`)) {
            this.setStatus(statusId, 'Acción cancelada. No se eliminó ningún dato.', 'info');
            return;
        }

        this.setStatus(statusId, 'Limpiando progreso...', 'info');
        document.getElementById('btnCleanProgressTestUser').disabled = true;
        
        const resPaginas = await this.deleteCollectionDocsInBatches(`usuarios/${this.currentTestUid}/progresoPaginas`, statusId);
        const resModulos = await this.deleteCollectionDocsInBatches(`usuarios/${this.currentTestUid}/progresoModulos`, statusId);

        const totalDeleted = (resPaginas.deleted || 0) + (resModulos.deleted || 0);

        if (!resPaginas.error && !resModulos.error) {
            this.setStatus(statusId, `Limpieza completada. Registros eliminados: ${totalDeleted}.`, 'success');
        } else {
            this.setStatus(statusId, `Limpieza finalizada con errores. Registros eliminados: ${totalDeleted}. Revisa consola.`, 'warning');
        }
    }
}

// Inicializar cuando el DOM esté listo
const initAdminMaintenance = () => new AdminMaintenanceHandler();
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminMaintenance);
} else {
    initAdminMaintenance();
}

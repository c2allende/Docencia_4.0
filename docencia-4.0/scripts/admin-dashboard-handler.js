import { db } from './firebase-config.js';
import { 
    collection, 
    query, 
    where, 
    orderBy, 
    limit, 
    onSnapshot,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { subscribeToParticipantsProgress } from './progress-service.js';
import { getAdminAnnouncements } from './announcement-service.js';
import { getAdminForumPosts } from './forum-service.js';

/**
 * Handler para el Dashboard General Administrativo.
 * Se encarga de poblar las métricas y listas con datos reales.
 */
class AdminDashboardHandler {
    constructor() {
        this.participants = [];
        this.unsubscribeProgress = null;
        this.elements = {
            countParticipants: document.querySelector('.metric-card:nth-child(1) .metric-value'),
            countAnnouncements: document.querySelector('.metric-card:nth-child(2) .metric-value'),
            avgProgress: document.querySelector('.metric-card:nth-child(3) .metric-value'),
            countMessages: document.querySelector('.metric-card:nth-child(4) .metric-value'),
            topParticipantsBody: document.querySelector('.progress-table tbody'),
            systemEventsList: document.querySelector('.activity-list'),
            forumParticipationList: document.querySelector('.timeline-list')
        };
    }

    async init() {
        console.log("AdminDashboardHandler: Inicializando...");
        this.showLoadingStates();
        
        // Esperar a que la autenticación esté lista
        const { auth } = await import('./firebase-config.js');
        const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");

        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("AdminDashboardHandler: Usuario autenticado, cargando datos...");
                
                // 1. Suscribirse a Participantes y Progreso (Tiempo Real)
                if (this.unsubscribeProgress) this.unsubscribeProgress();
                this.unsubscribeProgress = subscribeToParticipantsProgress((data) => {
                    var email = '';
                    this.participants = (data || []).filter(function(p) {
                      email = (p.email || '').trim().toLowerCase();
                      return email !== 'test@gmail.com' && (email.indexOf('test') === -1 || email.indexOf('@') === -1);
                    });
                    this.updateParticipantMetrics();
                    this.renderTopParticipants();
                });

                // 2. Cargar Anuncios Activos
                this.loadAnnouncementMetrics();

                // 3. Cargar Métricas de Foros
                this.loadForumMetrics();

                // 4. Vincular Matrícula Manual
                this.bindManualEnrollment();

                // 5. Cargar Eventos Reales
                this.loadRecentEvents();
            } else {
                console.warn("AdminDashboardHandler: No hay usuario autenticado.");
            }
        });
    }

    showLoadingStates() {
        Object.values(this.elements).forEach(el => {
            if (el && el.tagName !== 'TBODY') {
                el.innerText = "...";
            }
        });
        if (this.elements.topParticipantsBody) {
            this.elements.topParticipantsBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Cargando participantes...</td></tr>';
        }
    }

    /**
     * Actualiza las tarjetas de Participantes y Progreso Promedio.
     */
    updateParticipantMetrics() {
        if (this.elements.countParticipants) {
            this.elements.countParticipants.innerText = this.participants.length;
        }

        if (this.elements.avgProgress && this.participants.length > 0) {
            const total = this.participants.reduce((acc, p) => {
                const p1 = p.modulo1 || 0;
                const p2 = p.modulo2 || 0;
                const p3 = p.modulo3 || 0;
                return acc + ((p1 + p2 + p3) / 3);
            }, 0);
            const avg = Math.round(total / this.participants.length);
            this.elements.avgProgress.innerText = `${avg}%`;
        } else if (this.elements.avgProgress) {
            this.elements.avgProgress.innerText = "0%";
        }
    }

    /**
     * Renderiza los 3 participantes con mayor progreso/actividad.
     */
    renderTopParticipants() {
        if (!this.elements.topParticipantsBody) return;

        if (this.participants.length === 0) {
            this.elements.topParticipantsBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay participantes registrados.</td></tr>';
            return;
        }

        // Ordenar por promedio de progreso desc
        const sorted = [...this.participants].sort((a, b) => {
            const avgA = ((a.modulo1 || 0) + (a.modulo2 || 0) + (a.modulo3 || 0)) / 3;
            const avgB = ((b.modulo1 || 0) + (b.modulo2 || 0) + (b.modulo3 || 0)) / 3;
            return avgB - avgA;
        }).slice(0, 3);

        this.elements.topParticipantsBody.innerHTML = sorted.map(p => {
            // Determinar módulo actual (el más alto con progreso) y su valor específico
            let currentMod = "Módulo 1";
            let modProgress = p.modulo1 || 0;

            if (p.modulo3 > 0) {
                currentMod = "Módulo 3";
                modProgress = p.modulo3;
            } else if (p.modulo2 > 0) {
                currentMod = "Módulo 2";
                modProgress = p.modulo2;
            }

            const lastActive = p.lastActivity 
                ? this.formatRelativeTime(p.lastActivity) 
                : "Sin actividad";

            return `
                <tr>
                    <td>
                        <span class="participant-name">${p.displayName}</span>
                        <span class="participant-email">${p.email}</span>
                    </td>
                    <td><span class="badge-soft">${currentMod}</span></td>
                    <td>
                        <div class="mini-progress">
                            <span class="table-label">${modProgress}%</span>
                            <div class="progress" aria-label="Progreso: ${modProgress}%">
                                <div class="progress-fill" style="width: ${modProgress}%"></div>
                            </div>
                        </div>
                    </td>
                    <td>${lastActive}</td>
                </tr>
            `;
        }).join('');
    }

    /**
     * Carga y cuenta anuncios publicados.
     */
    async loadAnnouncementMetrics() {
        try {
            const anuncios = await getAdminAnnouncements();
            const activeCount = anuncios.filter(a => a.status === 'published').length;
            if (this.elements.countAnnouncements) {
                this.elements.countAnnouncements.innerText = activeCount;
            }
        } catch (error) {
            console.warn("Dashboard: Error al cargar anuncios", error);
            if (this.elements.countAnnouncements) this.elements.countAnnouncements.innerText = "0";
        }
    }

    /**
     * Carga métricas de foros (Publicaciones + Respuestas).
     */
    async loadForumMetrics() {
        try {
            const posts = await getAdminForumPosts({ status: 'active' });
            let totalMessages = posts.length;
            
            // Sumar respuestas
            posts.forEach(p => {
                totalMessages += (p.replyCount || 0);
            });

            if (this.elements.countMessages) {
                this.elements.countMessages.innerText = totalMessages;
            }

            // Población de la lista lateral de foros
            this.renderForumParticipation(posts);
        } catch (error) {
            console.warn("Dashboard: Error al cargar foros", error);
            if (this.elements.countMessages) this.elements.countMessages.innerText = "0";
            if (this.elements.forumParticipationList) {
                this.elements.forumParticipationList.innerHTML = '<p style="font-size:12px; color:var(--color-text-muted);">Resumen no disponible.</p>';
            }
        }
    }

    renderForumParticipation(allPosts) {
        if (!this.elements.forumParticipationList) return;

        const forumStats = {
            general: { posts: 0, replies: 0 },
            modulo1: { posts: 0, replies: 0 },
            modulo2: { posts: 0, replies: 0 },
            modulo3: { posts: 0, replies: 0 }
        };

        allPosts.forEach(p => {
            if (forumStats[p.foroId]) {
                forumStats[p.foroId].posts++;
                forumStats[p.foroId].replies += (p.replyCount || 0);
            }
        });

        const forumNames = {
            general: "Foro General",
            modulo1: "Foro Módulo 1",
            modulo2: "Foro Módulo 2",
            modulo3: "Foro Módulo 3"
        };

        this.elements.forumParticipationList.innerHTML = Object.keys(forumStats).map(fId => {
            const stat = forumStats[fId];
            const name = forumNames[fId];
            return `
                <article class="timeline-item">
                    <h3>${name}</h3>
                    <p>${stat.posts} publicaciones · ${stat.replies} respuestas</p>
                </article>
            `;
        }).join('');
    }

    /**
     * Carga eventos reales desde adminLogs (últimos 3).
     */
    async loadRecentEvents() {
        if (!this.elements.systemEventsList) return;

        try {
            const logsRef = collection(db, "adminLogs");
            const q = query(logsRef, orderBy("createdAt", "desc"), limit(3));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                this.elements.systemEventsList.innerHTML = '<p style="padding:16px; font-size:13px; color:var(--color-text-muted);">No hay actividad reciente registrada.</p>';
                return;
            }

            const actionLabels = {
                "create_announcement": "Anuncio creado",
                "moderate_forum_post": "Moderación de foro",
                "moderate_forum_reply": "Moderación de respuesta",
                "export_forum_data": "Exportación de datos",
                "delete_user_data": "Purga de datos"
            };

            this.elements.systemEventsList.innerHTML = snapshot.docs.map(doc => {
                const data = doc.data();
                const label = actionLabels[data.action] || "Acción administrativa";
                const time = data.createdAt ? this.formatRelativeTime(data.createdAt.toDate()) : "";
                
                return `
                    <article class="activity-item">
                        <span class="activity-dot" aria-hidden="true"></span>
                        <div>
                            <h3>${label}</h3>
                            <p>${data.note || "Sin detalles adicionales"}</p>
                            <span style="font-size:10px; color:var(--color-text-muted);">${time}</span>
                        </div>
                    </article>
                `;
            }).join('');
        } catch (error) {
            console.warn("Dashboard: Error al cargar eventos", error);
            this.elements.systemEventsList.innerHTML = '<p style="padding:16px; font-size:13px; color:var(--color-text-muted);">Actividad reciente no disponible.</p>';
        }
    }

    formatRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return days === 1 ? "Ayer" : `Hace ${days} días`;
        if (hours > 0) return `Hace ${hours}h`;
        if (minutes > 0) return `Hace ${minutes}m`;
        return "Hace un momento";
    }

    bindManualEnrollment() {
        var form = document.getElementById('manualEnrollmentForm');
        if (!form) return;

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            var firstName = document.getElementById('manualFirstName')?.value.trim() || '';
            var lastName = document.getElementById('manualLastName')?.value.trim() || '';
            var email = document.getElementById('manualEmail')?.value.trim() || '';
            var resultDiv = document.getElementById('manualEnrollmentResult');
            var btn = document.getElementById('manualEnrollmentSubmit');

            if (!firstName || !lastName || !email) {
                if (resultDiv) {
                    resultDiv.className = 'manual-enrollment-result is-visible';
                    resultDiv.style.background = '#fef2f2';
                    resultDiv.style.border = '1px solid #fca5a5';
                    resultDiv.style.color = '#991b1b';
                    resultDiv.textContent = 'Todos los campos son requeridos.';
                }
                return;
            }

            if (resultDiv) {
                resultDiv.className = 'manual-enrollment-result is-visible';
                resultDiv.style.background = '#eff6ff';
                resultDiv.style.border = '1px solid #93c5fd';
                resultDiv.style.color = '#1e40af';
                resultDiv.textContent = 'Creando participante...';
            }
            if (btn) btn.disabled = true;

            try {
                var functionsMod = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js");
                var { auth } = await import('./firebase-config.js');
                var functions = functionsMod.getFunctions(auth.app, 'us-central1');
                var createParticipant = functionsMod.httpsCallable(functions, 'createManualParticipant');

                var result = await createParticipant({
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                });

                var data = result.data;
                console.log('[ManualEnroll] Cloud Function response:', data);

                if (resultDiv) {
                    resultDiv.className = 'manual-enrollment-result is-visible';
                    resultDiv.innerHTML =
                        '<div class="manual-enrollment-success-card">' +
                        '  <div class="manual-enrollment-success-header">' +
                        '    <span class="manual-enrollment-success-icon">\u2713</span>' +
                        '    <div>' +
                        '      <h3>Participante creado exitosamente</h3>' +
                        '      <p>La cuenta oficial fue creada en la plataforma.</p>' +
                        '    </div>' +
                        '  </div>' +

                        '  <dl class="manual-enrollment-summary">' +
                        '    <div>' +
                        '      <dt>Email</dt>' +
                        '      <dd>' + data.email + '</dd>' +
                        '    </div>' +
                        '    <div>' +
                        '      <dt>Nombre</dt>' +
                        '      <dd>' + data.displayName + '</dd>' +
                        '    </div>' +
                        '  </dl>' +

                        '  <div class="manual-enrollment-password-box">' +
                        '    <p class="manual-enrollment-password-label">Contrase\u00f1a temporal de primer acceso</p>' +
                        '    <div class="manual-enrollment-password-row">' +
                        '      <code class="manual-enrollment-temp-password" id="tempPasswordDisplay">' + data.temporaryPassword + '</code>' +
                        '      <button type="button" class="btn btn-secondary" id="copyTemporaryPasswordBtn">Copiar contrase\u00f1a</button>' +
                        '    </div>' +
                        '    <p class="manual-enrollment-password-warning">Por seguridad, esta contrase\u00f1a no se guardar\u00e1 y no podr\u00e1 consultarse nuevamente desde el panel.</p>' +
                        '  </div>' +

                        '  <p class="manual-enrollment-instruction">Entregue esta contrase\u00f1a temporal al participante por un canal seguro. Al iniciar sesi\u00f3n, el sistema le solicitar\u00e1 crear su propia contrase\u00f1a.</p>' +
                        '</div>';

                    var copyBtn = document.getElementById('copyTemporaryPasswordBtn');
                    if (copyBtn) {
                        copyBtn.addEventListener('click', function () {
                            navigator.clipboard.writeText(data.temporaryPassword).then(function () {
                                copyBtn.textContent = '\u2713 Copiado';
                                setTimeout(function () { copyBtn.textContent = 'Copiar contrase\u00f1a'; }, 2500);
                            }).catch(function () {
                                copyBtn.textContent = 'Error al copiar';
                            });
                        });
                    }
                }

                document.getElementById('manualFirstName').value = '';
                document.getElementById('manualLastName').value = '';
                document.getElementById('manualEmail').value = '';
            } catch (error) {
                console.error('[ManualEnroll] Error:', error);
                var message = error.message || 'Error desconocido';
                if (error.code === 'unauthenticated') message = 'Debe iniciar sesión como administrador.';
                else if (error.code === 'permission-denied') message = 'No tiene permisos para matricular participantes.';
                else if (error.code === 'already-exists') message = 'El email ya está registrado en la plataforma.';
                else if (error.code === 'invalid-argument') message = error.message || 'Datos inválidos.';

                if (resultDiv) {
                    resultDiv.className = 'manual-enrollment-result is-visible';
                    resultDiv.style.background = '#fef2f2';
                    resultDiv.style.border = '1px solid #fca5a5';
                    resultDiv.style.color = '#991b1b';
                    resultDiv.innerHTML = '<strong>Error:</strong> ' + message;
                }
            } finally {
                if (btn) btn.disabled = false;
            }
        });
    }

    destroy() {
        if (this.unsubscribeProgress) this.unsubscribeProgress();
    }
}

export const adminDashboardHandler = new AdminDashboardHandler();

import { auth, db } from './firebase-config.js';
import { getForum, getForumPosts, createForumPost, getPostReplies, createPostReply } from './forum-service.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class ForumHandler {
    constructor() {
        this.container = document.getElementById('forum-dynamic-container');
        if (!this.container) return; // Si no está en la página, abortar

        this.foroId = this.container.getAttribute("data-forum-id") || "general";
        this.currentUserProfile = null;
        this.isLoading = true;
        this.isSubmitting = false;

        this.init();
    }

    async init() {
        this.renderLoading();
        
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await this.loadUserProfile(user.uid);
                await this.loadForumData();
            } else {
                this.renderError("Debes iniciar sesión para ver y participar en el foro.");
            }
        });
    }

    async loadUserProfile(uid) {
        try {
            const userDoc = await getDoc(doc(db, "usuarios", uid));
            if (userDoc.exists()) {
                this.currentUserProfile = userDoc.data();
            } else {
                // Fallback si no hay perfil (ej. admin recién creado sin doc)
                this.currentUserProfile = {
                    displayName: auth.currentUser.displayName || "Usuario",
                    roleContext: "Participante"
                };
            }
        } catch (error) {
            console.error("Error cargando perfil:", error);
            this.currentUserProfile = { displayName: "Usuario", roleContext: "Participante" };
        }
    }

    async loadForumData() {
        this.isLoading = true;
        this.renderLoading();

        try {
            // Validar si el foro está activo
            const forum = await getForum(this.foroId);
            if (forum && forum.isActive === false) {
                this.renderError("Este foro se encuentra cerrado temporalmente.");
                return;
            }

            const posts = await getForumPosts(this.foroId, 50);
            this.isLoading = false;
            this.renderForum(posts);
        } catch (error) {
            console.error("Error cargando foro:", error);
            this.isLoading = false;
            this.renderError("Hubo un problema al cargar las publicaciones. Por favor, recarga la página.");
        }
    }

    formatDate(dateObj) {
        if (!dateObj) return "Hace un momento";
        const date = dateObj.toDate ? dateObj.toDate() : new Date(dateObj);
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
        });
    }

    renderLoading() {
        this.container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--color-text-muted);">
                <p>Cargando publicaciones del foro...</p>
            </div>
        `;
    }

    renderError(message) {
        this.container.innerHTML = `
            <div class="alert" style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; border-left: 4px solid #ffeeba;">
                <p style="margin: 0;">⚠️ ${message}</p>
            </div>
        `;
    }

    renderForum(posts) {
        let html = `
            <div class="forum-composer" style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 30px;">
                <div style="display: flex; gap: 15px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">
                        ${this.currentUserProfile.displayName ? this.currentUserProfile.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div style="flex-grow: 1;">
                        <textarea id="newPostContent" placeholder="Comparte tus reflexiones, dudas o experiencias con la comunidad..." style="width: 100%; min-height: 80px; padding: 12px; border: 1px solid var(--color-border-default); border-radius: 8px; font-family: inherit; resize: vertical; margin-bottom: 10px;"></textarea>
                        <div style="display: flex; justify-content: flex-end;">
                            <button id="btnCreatePost" class="btn btn-primary" style="padding: 8px 20px; font-size: 14px;">
                                Publicar Aportación
                            </button>
                        </div>
                        <div id="postErrorMsg" style="color: #dc3545; font-size: 12px; margin-top: 5px; display: none;"></div>
                    </div>
                </div>
            </div>
            
            <div class="forum-feed">
        `;

        if (posts.length === 0) {
            html += `
                <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 12px; color: var(--color-text-muted);">
                    <p>Aún no hay publicaciones en este foro. ¡Sé el primero en participar!</p>
                </div>
            `;
        } else {
            posts.forEach(post => {
                html += `
                    <div class="forum-post" data-post-id="${post.id}" style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); border: 1px solid var(--color-border-default); margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                            <div style="display: flex; gap: 12px; align-items: center;">
                                <div style="width: 36px; height: 36px; border-radius: 50%; background: #e9ecef; color: #495057; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                                    ${post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div>
                                    <div style="font-weight: 600; font-size: 14px;">${post.authorName}</div>
                                    <div style="font-size: 11px; color: var(--color-text-muted);">${post.authorContext || 'Participante'} • ${this.formatDate(post.createdAt)}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="font-size: 15px; line-height: 1.5; color: #333; margin-bottom: 15px; white-space: pre-wrap;">${post.content}</div>
                        
                        <div style="border-top: 1px solid #f1f3f5; padding-top: 10px; display: flex; gap: 15px;">
                            <button class="btn-responder" data-target="${post.id}" style="background: none; border: none; color: var(--color-text-muted); font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                                💬 Responder
                            </button>
                        </div>
                        
                        <!-- Contenedor de respuestas (se carga dinámicamente) -->
                        <div id="replies-${post.id}" style="margin-top: 15px; padding-left: 20px; border-left: 2px solid #f1f3f5; display: none;">
                            <div class="replies-list" style="margin-bottom: 15px;"></div>
                            
                            <!-- Caja para nueva respuesta -->
                            <div style="display: flex; gap: 10px; margin-top: 10px;">
                                <input type="text" class="reply-input" data-post-id="${post.id}" placeholder="Escribe una respuesta..." style="flex-grow: 1; padding: 8px 12px; border: 1px solid #ced4da; border-radius: 20px; font-size: 13px;">
                                <button class="btn-enviar-respuesta btn btn-secondary" data-post-id="${post.id}" style="padding: 6px 15px; font-size: 12px; border-radius: 20px;">
                                    Enviar
                                </button>
                            </div>
                            <div id="reply-error-${post.id}" style="color: #dc3545; font-size: 11px; display: none; margin-top: 5px;"></div>
                        </div>
                    </div>
                `;
            });
        }

        html += `</div>`;
        this.container.innerHTML = html;

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Botón Publicar
        const btnCreate = document.getElementById('btnCreatePost');
        if (btnCreate) {
            btnCreate.addEventListener('click', () => this.handleCreatePost());
        }

        // Botones Responder (abrir contenedor)
        document.querySelectorAll('.btn-responder').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const postId = e.currentTarget.getAttribute('data-target');
                const repliesContainer = document.getElementById(`replies-${postId}`);
                
                if (repliesContainer.style.display === 'none') {
                    repliesContainer.style.display = 'block';
                    await this.loadReplies(postId);
                } else {
                    repliesContainer.style.display = 'none';
                }
            });
        });

        // Botones Enviar Respuesta
        document.querySelectorAll('.btn-enviar-respuesta').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postId = e.currentTarget.getAttribute('data-post-id');
                this.handleCreateReply(postId);
            });
        });
    }

    async handleCreatePost() {
        if (this.isSubmitting) return;
        
        const input = document.getElementById('newPostContent');
        const errorMsg = document.getElementById('postErrorMsg');
        const content = input.value.trim();
        
        if (!content) {
            errorMsg.textContent = "Por favor, escribe algo antes de publicar.";
            errorMsg.style.display = 'block';
            return;
        }

        this.isSubmitting = true;
        const btn = document.getElementById('btnCreatePost');
        const originalText = btn.textContent;
        btn.textContent = "Publicando...";
        btn.disabled = true;
        errorMsg.style.display = 'none';

        try {
            await createForumPost(
                this.foroId, 
                content, 
                this.currentUserProfile.displayName, 
                this.currentUserProfile.roleContext
            );
            
            // Recargar datos
            input.value = '';
            await this.loadForumData();
            
        } catch (error) {
            console.error("Error al publicar:", error);
            errorMsg.textContent = "Error al publicar. Revisa tu conexión o permisos.";
            errorMsg.style.display = 'block';
        } finally {
            this.isSubmitting = false;
            if (btn) {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }
    }

    async loadReplies(postId) {
        const container = document.querySelector(`#replies-${postId} .replies-list`);
        container.innerHTML = '<div style="font-size: 12px; color: #6c757d;">Cargando respuestas...</div>';
        
        try {
            const replies = await getPostReplies(this.foroId, postId);
            
            if (replies.length === 0) {
                container.innerHTML = '<div style="font-size: 12px; color: #6c757d; font-style: italic;">No hay respuestas todavía.</div>';
                return;
            }

            let html = '';
            replies.forEach(reply => {
                html += `
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 12px; margin-bottom: 10px; font-size: 13px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="font-weight: 600;">${reply.authorName}</span>
                            <span style="color: #6c757d; font-size: 11px;">${this.formatDate(reply.createdAt)}</span>
                        </div>
                        <div style="color: #333; white-space: pre-wrap;">${reply.content}</div>
                    </div>
                `;
            });
            container.innerHTML = html;
            
        } catch (error) {
            container.innerHTML = '<div style="font-size: 12px; color: #dc3545;">Error al cargar respuestas.</div>';
        }
    }

    async handleCreateReply(postId) {
        if (this.isSubmitting) return;

        const input = document.querySelector(`.reply-input[data-post-id="${postId}"]`);
        const errorMsg = document.getElementById(`reply-error-${postId}`);
        const content = input.value.trim();

        if (!content) return;

        this.isSubmitting = true;
        const btn = document.querySelector(`.btn-enviar-respuesta[data-post-id="${postId}"]`);
        btn.disabled = true;
        errorMsg.style.display = 'none';

        try {
            await createPostReply(
                this.foroId, 
                postId, 
                content, 
                this.currentUserProfile.displayName, 
                this.currentUserProfile.roleContext
            );
            
            input.value = '';
            await this.loadReplies(postId); // Recargar solo este bloque
            
        } catch (error) {
            console.error("Error al responder:", error);
            errorMsg.textContent = "Error al enviar la respuesta.";
            errorMsg.style.display = 'block';
        } finally {
            this.isSubmitting = false;
            btn.disabled = false;
        }
    }
}

// Inicializar
const initForum = () => {
    new ForumHandler();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForum);
} else {
    initForum();
}

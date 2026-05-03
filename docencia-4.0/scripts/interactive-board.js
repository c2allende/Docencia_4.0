import { auth, db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    onSnapshot, 
    getDocs,
    limit,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

class InteractiveBoard {
    constructor() {
        this.boardContainer = document.getElementById('interactive-board-grid');
        this.form = document.getElementById('board-form');
        this.input = document.getElementById('board-input');
        this.charCounter = document.getElementById('char-counter');
        this.submitBtn = document.getElementById('board-submit');
        
        if (!this.boardContainer || !this.form) return;

        this.pageId = "actividad1_1";
        this.moduleId = "modulo1";
        this.sessionId = "actividad1_1"; // ID de sesión para Firestore
        this.currentUser = null;
        this.colors = [
            'var(--color-brand-primary)', 
            'var(--color-brand-secondary)', 
            'var(--color-cyan-600)', 
            'var(--color-orange-600)', 
            '#6366f1', 
            '#ec4899'
        ];

        this.init();
    }

    async init() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.currentUser = user;
                this.listenToResponses();
                await this.checkUserParticipation();
            }
        });

        this.setupEventListeners();
    }

    async checkUserParticipation() {
        if (!this.currentUser) return;

        try {
            const q = query(
                collection(db, `sessions/${this.sessionId}/responses`),
                where("uid", "==", this.currentUser.uid),
                limit(1)
            );
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                this.enableCompletion();
            }
        } catch (error) {
            console.error("Error al verificar participación:", error);
        }
    }

    enableCompletion() {
        // Disparar evento para el progress-tracker.js
        document.dispatchEvent(new CustomEvent('enable-completion'));
    }

    setupEventListeners() {
        this.input.addEventListener('input', () => {
            const length = this.input.value.length;
            this.charCounter.textContent = `${length}/200`;
            this.submitBtn.disabled = length === 0 || length > 200;
        });

        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.sendResponse();
        });
    }

    async sendResponse() {
        if (!this.currentUser || this.input.value.trim() === '') return;

        const text = this.input.value.trim();
        this.submitBtn.disabled = true;
        this.input.disabled = true;

        try {
            await addDoc(collection(db, `sessions/${this.sessionId}/responses`), {
                text: text,
                uid: this.currentUser.uid,
                displayName: this.currentUser.displayName || 'Participante',
                timestamp: serverTimestamp(),
                likes: 0,
                colorIndex: Math.floor(Math.random() * this.colors.length),
                pageId: this.pageId,
                moduleId: this.moduleId,
                status: 'active'
            });

            this.input.value = '';
            this.charCounter.textContent = '0/200';
            this.input.disabled = false;
            
            // Activar completado de sección
            this.enableCompletion();
        } catch (error) {
            console.error("Error al enviar respuesta:", error);
            alert("Hubo un error al enviar tu respuesta. Por favor, intenta de nuevo.");
            this.input.disabled = false;
            this.submitBtn.disabled = false;
        }
    }

    listenToResponses() {
        const q = query(
            collection(db, `sessions/${this.sessionId}/responses`),
            orderBy("timestamp", "desc")
        );

        onSnapshot(q, (snapshot) => {
            this.boardContainer.innerHTML = '';
            
            if (snapshot.empty) {
                this.boardContainer.innerHTML = `
                    <div class="empty-board">
                        <p>Aún no hay respuestas. ¡Sé el primero en compartir!</p>
                    </div>`;
                return;
            }

            snapshot.forEach((doc) => {
                const data = doc.data();
                this.renderResponse(data);
            });
        });
    }

    renderResponse(data) {
        const card = document.createElement('div');
        card.className = 'response-card';
        const color = this.colors[data.colorIndex] || this.colors[0];
        
        card.style.borderTopColor = color;
        
        card.innerHTML = `
            <p class="response-text">${this.escapeHTML(data.text)}</p>
            <div class="response-meta">
                <span class="response-author">${this.escapeHTML(data.displayName)}</span>
            </div>
        `;
        
        this.boardContainer.appendChild(card);
    }

    escapeHTML(str) {
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InteractiveBoard();
});

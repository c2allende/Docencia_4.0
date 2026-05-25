/**
 * Prototipo: Asistente Docencia 4.0
 * Handler para la lógica del chatbot institucional, sin IA generativa.
 * Mantiene la conversación durante la sesión mediante sessionStorage.
 */

const FAQ_KNOWLEDGE_BASE = [
    {
        id: 'comenzar',
        category: 'Comenzar el programa',
        keywords: [
            'comenzar',
            'comienzo',
            'como comienzo',
            'cómo comienzo',
            'empezar',
            'empiezo',
            'inicio',
            'por donde empiezo',
            'por dónde empiezo',
            'dashboard',
            'primer paso',
            'primeros pasos'
        ],
        question: '¿Cómo comienzo?',
        answer: `Para comenzar en Docencia 4.0, le recomiendo seguir una ruta sencilla y organizada:

1. Primero, ubíquese en el Dashboard del curso. Desde allí podrá ver los módulos disponibles y acceder a las secciones principales del LMS.

2. Luego, entre a la introducción del módulo correspondiente. Esa sección le ofrece el contexto general, el propósito del módulo y la ruta de aprendizaje sugerida.

3. Después, revise las lecciones en orden. Las lecciones le ayudarán a comprender los conceptos antes de completar las actividades.

4. Cuando llegue a una actividad, lea primero el propósito, las instrucciones y los criterios de trabajo. Si la actividad incluye una plantilla, ábrala y úsela como guía para organizar su respuesta.

5. Finalmente, participe en los foros o espacios colaborativos indicados, complete las evidencias solicitadas y marque la sección como completada cuando corresponda.

La idea es avanzar paso a paso: comprender, practicar, reflexionar y documentar su aprendizaje. No tiene que hacerlo todo de una vez; siga la ruta del módulo y use este asistente cuando necesite orientación.`
    },
    {
        id: 'modulos',
        category: 'Módulos y lecciones',
        keywords: ['modulo', 'leccion', 'orden', 'contenido', 'aprender', 'módulo', 'lección'],
        question: '¿Qué hago en cada módulo?',
        answer: `Cada módulo incluye introducción, lecciones, actividades, foro y recursos. Las lecciones deben revisarse detalladamente antes de intentar completar las actividades para asegurar un buen dominio del tema.`
    },
    {
        id: 'actividades',
        category: 'Actividades',
        keywords: ['actividad', 'tarea', 'ejercicio', 'hacer', 'asignacion', 'completar'],
        question: '¿Cómo completo las actividades?',
        answer: `Lea el propósito de la actividad, revise las instrucciones paso a paso, complete la tarea y use las plantillas o recursos indicados. Asegúrese de guardar sus evidencias si se le solicitan.`
    },
    {
        id: 'plantillas',
        category: 'Plantillas',
        keywords: ['plantilla', 'descargar', 'pdf', 'actividad 2.1', 'documento', 'formato', 'rellenar'],
        question: '¿Dónde encuentro las plantillas?',
        answer: `Las plantillas están enlazadas desde las actividades correspondientes. Deben abrirse (generalmente en una pestaña nueva), completarse con su información y descargarse en PDF según las instrucciones.`
    },
    {
        id: 'foros',
        category: 'Foros',
        keywords: ['foro', 'participar', 'comentar', 'opinion', 'discusion', 'responder'],
        question: '¿Cómo participo en los foros?',
        answer: `Los foros sirven para reflexionar, compartir aplicaciones y evidenciar su participación. Lea cuidadosamente la pregunta guía antes de responder y comparta su experiencia profesional.`
    },
    {
        id: 'padlet',
        category: 'Padlet',
        keywords: ['padlet', 'muro', 'pizarra', 'colaborativo', 'evidencia padlet'],
        question: '¿Qué hago con Padlet?',
        answer: `Padlet se usa como muro colaborativo externo para documentar ideas, evidencias o aportaciones. Siga el enlace de la actividad correspondiente para publicar su aportación directamente en la plataforma externa.`
    },
    {
        id: 'progreso',
        category: 'Progreso y completado',
        keywords: ['progreso', 'completado', 'marcar', 'avance', 'terminar', 'listo'],
        question: '¿Cómo marco una sección como completada?',
        answer: `Al terminar una sección, use el botón de "Completado" cuando esté disponible al final de la página. Esto ayuda a registrar y calcular su avance visual en el Dashboard del LMS.`
    },
    {
        id: 'recursos',
        category: 'Recursos',
        keywords: ['recurso', 'material', 'lectura', 'adicional', 'bibliografia'],
        question: '¿Cómo uso los recursos?',
        answer: `Los recursos (lecturas, videos, guías) complementan las lecciones y actividades del módulo. Puede revisarlos antes o después de completar una actividad para profundizar en el tema.`
    },
    {
        id: 'problemas',
        category: 'Problemas técnicos',
        keywords: ['error', 'no carga', 'problema', 'tecnico', 'falla', 'blanco', 'no funciona', 'roto'],
        question: 'Tengo un problema técnico',
        answer: `Le sugiero refrescar la página (Ctrl+R o F5), verificar su conexión a internet, usar un navegador actualizado (como Chrome) y asegurarse de abrir los enlaces externos en una pestaña nueva. Si el problema continúa, contacte al investigador.`
    },
    {
        id: 'contacto',
        category: 'Contactar al investigador',
        keywords: ['contacto', 'investigador', 'email', 'correo', 'ayuda', 'duda', 'pregunta', 'carmelo'],
        question: '¿Cómo contacto al investigador?',
        answer: `Si tiene alguna duda, pregunta adicional o sugerencia, puede comunicarse directamente con el investigador al email: carmelo.allende@upr.edu.`
    }
];

const GUARDRAILS = [
    {
        keywords: ['hazme', 'redacta', 'escribe', 'completa', 'contesta', 'haz la tarea', 'escribe mi reflexion'],
        answer: `Puedo orientarle sobre los pasos, criterios o estructura de la tarea, pero no debo completar la evidencia por usted. La respuesta debe reflejar su análisis y experiencia como participante.`
    }
];

const DEFAULT_FALLBACK_RESPONSE = `No tengo información suficiente sobre ese tema. Este asistente está diseñado para orientar sobre el uso del LMS Docencia 4.0 y sus actividades. Puede intentar buscar usando otros términos o explorar las categorías rápidas.`;

// Estado del UI
const dom = {
    toggleBtn: document.getElementById('chatbotToggleBtn'),
    panel: document.getElementById('chatbotPanel'),
    closeBtn: document.getElementById('chatbotCloseBtn'),
    messagesContainer: document.getElementById('chatMessages'),
    form: document.getElementById('chatbotForm'),
    input: document.getElementById('chatbotInput'),
    clearBtn: document.getElementById('chatbotClearBtn'),
    bubble: document.getElementById('chatbotScrollBubble'),
    bubbleClose: document.getElementById('chatbotBubbleClose')
};

// Normalizar texto para búsqueda
function normalizeText(value = '') {
    return String(value || '')
               .toLowerCase()
               .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remover acentos
               .trim();
}

// Encontrar respuesta
function findBestAnswer(userInput) {
    const query = normalizeText(userInput);

    // 1. Check Guardrails
    for (const guardrail of GUARDRAILS) {
        if (guardrail.keywords.some(kw => query.includes(normalizeText(kw)))) {
            return { answer: guardrail.answer, type: 'warning' };
        }
    }

    // Explicit override for "comenzar"
    if (
        query.includes('como comienzo') ||
        query.includes('como empiezo') ||
        query.includes('por donde empiezo') ||
        query.includes('comienzo') ||
        query.includes('empezar') ||
        query.includes('inicio')
    ) {
        const item = FAQ_KNOWLEDGE_BASE.find(e => e.id === 'comenzar');
        if (item) return { answer: item.answer, type: 'bot' };
    }

    // 2. Check FAQ
    const matches = FAQ_KNOWLEDGE_BASE.map((item) => {
        const score = item.keywords.reduce((total, keyword) => {
            return query.includes(normalizeText(keyword)) ? total + 1 : total;
        }, 0);

        return { item, score };
    }).sort((a, b) => b.score - a.score);

    if (matches[0]?.score > 0) {
        return { answer: matches[0].item.answer, type: 'bot' };
    }

    // 3. Fallback
    return { answer: DEFAULT_FALLBACK_RESPONSE, type: 'bot' };
}

// UI Functions
function addMessage(text, sender = 'bot', type = 'bot', save = true) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `docencia-chatbot-message ${sender} ${type === 'warning' ? 'warning' : ''}`;
    
    // Convertir URLs o correos a links básicos si es necesario
    let formattedText = text;
    if (text.includes('carmelo.allende@upr.edu')) {
        formattedText = text.replace('carmelo.allende@upr.edu', '<a href="mailto:carmelo.allende@upr.edu" style="text-decoration:underline; font-weight:600;">carmelo.allende@upr.edu</a>');
    }

    msgDiv.innerHTML = `
        <div>${formattedText}</div>
        <span class="docencia-chatbot-timestamp">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
    `;
    
    dom.messagesContainer.appendChild(msgDiv);
    dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;

    if (save) {
        saveConversation();
    }
}

function showCategories() {
    const container = document.createElement('div');
    container.className = 'docencia-chatbot-suggestions';
    
    const initialChips = [
        '¿Cómo comienzo?',
        '¿Qué hago en cada módulo?',
        '¿Dónde encuentro las actividades?',
        '¿Cómo uso las plantillas?',
        '¿Cómo participo en los foros?',
        '¿Cómo trabajo con Padlet?',
        '¿Cómo doy seguimiento a mi progreso?',
        '¿Cómo contacto al investigador?'
    ];

    initialChips.forEach(question => {
        const chip = document.createElement('button');
        chip.className = 'docencia-chatbot-chip';
        chip.textContent = question;
        chip.onclick = () => {
            handleUserSubmit(question);
        };
        container.appendChild(chip);
    });

    dom.messagesContainer.appendChild(container);
    dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;
}

function showFollowUpSuggestions() {
    const suggestions = ['Ver actividades', 'Ver plantillas', 'Contactar investigador', 'Problemas técnicos'];
    const container = document.createElement('div');
    container.className = 'docencia-chatbot-suggestions';
    container.style.marginTop = '4px';
    
    suggestions.forEach(text => {
        const chip = document.createElement('button');
        chip.className = 'docencia-chatbot-chip';
        chip.textContent = text;
        chip.onclick = () => {
            handleUserSubmit(text);
        };
        container.appendChild(chip);
    });

    dom.messagesContainer.appendChild(container);
    dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;
}

function handleUserSubmit(text) {
    if (!text.trim()) return;
    
    // Add User message
    addMessage(text, 'user');
    dom.input.value = '';

    // Simulate thinking delay
    setTimeout(() => {
        const response = findBestAnswer(text);
        addMessage(response.answer, 'bot', response.type);
        showFollowUpSuggestions();
    }, 400);
}

function renderWelcomeMessage() {
    dom.messagesContainer.innerHTML = '';
    
    const disclaimerDiv = document.createElement('div');
    disclaimerDiv.className = 'docencia-chatbot-message bot warning';
    disclaimerDiv.style.fontSize = '0.8rem';
    disclaimerDiv.innerHTML = `Este asistente le brinda orientación operacional y pedagógica. No sustituye las instrucciones oficiales de cada actividad ni la comunicación directa con el investigador.`;
    dom.messagesContainer.appendChild(disclaimerDiv);

    const initialWelcome = `Saludos. Soy el Asistente Docencia 4.0 🌟<br>Estoy aquí para orientarle en el uso de la plataforma, resolver dudas frecuentes y acompañarle en su proceso dentro del LMS.`;
    addMessage(initialWelcome, 'bot', 'bot', false);
    showCategories();
}

// Session Storage (Optional persistence during session)
function saveConversation() {
    const html = dom.messagesContainer.innerHTML;
    sessionStorage.setItem('chatbot_docencia4_history', html);
}

function loadConversation() {
    const history = sessionStorage.getItem('chatbot_docencia4_history');
    if (history) {
        dom.messagesContainer.innerHTML = history;
        // Re-attach events to chips if loaded from HTML
        const chips = dom.messagesContainer.querySelectorAll('.docencia-chatbot-chip');
        chips.forEach(chip => {
            chip.onclick = () => handleUserSubmit(chip.textContent);
        });
        dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;
    } else {
        renderWelcomeMessage();
    }
}

function clearConversation() {
    sessionStorage.removeItem('chatbot_docencia4_history');
    renderWelcomeMessage();
}

// Bubble logic
let hasShownBubble = sessionStorage.getItem('chatbot_docencia4_bubble_shown') === 'true';

function resetChatbotPanelScroll() {
    const panelBody = dom.messagesContainer;
    if (!panelBody) return;

    requestAnimationFrame(() => {
        panelBody.scrollTop = 0;
    });

    setTimeout(() => {
        panelBody.scrollTop = 0;
    }, 80);
}

function handleScroll() {
    if (!hasShownBubble && window.scrollY > 400) {
        if (dom.bubble) {
            dom.bubble.classList.add('show');
            if (dom.toggleBtn) {
                dom.toggleBtn.classList.add('is-attending');
                setTimeout(() => {
                    dom.toggleBtn.classList.remove('is-attending');
                }, 1600);
            }
            hasShownBubble = true;
            sessionStorage.setItem('chatbot_docencia4_bubble_shown', 'true');
        }
    }
}

function hideBubble() {
    if (dom.bubble) {
        dom.bubble.classList.remove('show');
        hasShownBubble = true;
        sessionStorage.setItem('chatbot_docencia4_bubble_shown', 'true');
    }
}

// Event Listeners
function initChatbot() {
    if (!dom.toggleBtn) return;

    // Scroll listener for bubble
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (dom.bubbleClose) {
        dom.bubbleClose.addEventListener('click', hideBubble);
    }

    dom.toggleBtn.addEventListener('click', () => {
        const isHidden = dom.panel.getAttribute('aria-hidden') === 'true';
        if (isHidden) {
            dom.panel.classList.add('active');
            dom.panel.setAttribute('aria-hidden', 'false');
            dom.input.focus();
            hideBubble();
            resetChatbotPanelScroll();
        } else {
            dom.panel.classList.remove('active');
            dom.panel.setAttribute('aria-hidden', 'true');
        }
    });

    dom.closeBtn.addEventListener('click', () => {
        dom.panel.classList.remove('active');
        dom.panel.setAttribute('aria-hidden', 'true');
    });

    dom.form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleUserSubmit(dom.input.value);
    });

    dom.clearBtn.addEventListener('click', clearConversation);

    // Initialize state
    loadConversation();
}

document.addEventListener('DOMContentLoaded', initChatbot);

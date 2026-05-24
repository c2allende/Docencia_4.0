import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    collection, 
    getDocs, 
    getDoc,
    doc,
    query, 
    where, 
    addDoc,
    updateDoc, 
    serverTimestamp,
    orderBy,
    limit 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAllParticipantsProgress } from "./progress-service.js"; 
import { functionsClient } from "./firebase-functions-client.js";
import { httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js";

// Feature flags obligatorias
const ENABLE_REAL_EMAIL_BACKEND = false;
const ENABLE_EMAIL_DRY_RUN_BACKEND = true;
const MAX_REAL_RECIPIENTS_PER_SEND = 25;

const ADMIN_INTERNAL_EMAIL = 'carmelo.allende@gmail.com';
const INVESTIGATOR_EMAIL = 'carmelo.allende@upr.edu';
const LMS_LINK = 'https://docencia-4-lms.web.app/dashboard.html';

const INSTITUTIONAL_COMMUNICATION_FOOTER = 
`Puede acceder al LMS desde el siguiente enlace:
{{lmsLink}}

Si tiene alguna duda, pregunta o sugerencia, puede comunicarse con el investigador al email carmelo.allende@upr.edu.

Gracias por su tiempo y compromiso.

Cordialmente,
Equipo Docencia 4.0`;

function ensureInstitutionalFooter(body = '') {
    const normalized = String(body || '').trim();

    if (
        normalized.includes('carmelo.allende@upr.edu') &&
        normalized.includes('{{lmsLink}}')
    ) {
        return normalized;
    }

    return `${normalized}

${INSTITUTIONAL_COMMUNICATION_FOOTER}`.trim();
}

const ADMIN_INTERNAL_RECIPIENT = {
  uid: 'admin-carmelo',
  id: 'admin-carmelo',
  displayName: 'Administrador',
  name: 'Administrador',
  nombre: 'Administrador',
  email: ADMIN_INTERNAL_EMAIL,
  role: 'admin',
  rol: 'admin',
  isAdminInternal: true,
  progress: { modulo1: 0, modulo2: 0, modulo3: 0 },
  forums: { general: false, modulo1: false, modulo2: false, modulo3: false },
  followUpReason: 'Administrador incluido para pruebas y copia de control'
};

function getParticipantsWithSingleAdmin(participants = []) {
  const normalized = Array.isArray(participants) ? [...participants] : [];

  const withoutAdminDuplicates = normalized.filter((participant) => {
    const email = String(participant.email || '').toLowerCase();
    const name = String(
      participant.displayName ||
      participant.name ||
      participant.nombre ||
      ''
    ).toLowerCase();

    return (
      email !== ADMIN_INTERNAL_EMAIL &&
      !name.includes('admin — piloto') &&
      !name.includes('admin piloto') &&
      !name.includes('carmelo allende (admin')
    );
  });

  return [ADMIN_INTERNAL_RECIPIENT, ...withoutAdminDuplicates];
}

const MESSAGE_TEMPLATES = {
    progressReminder: {
        subject: "Seguimiento cordial — Docencia 4.0",
        body:
`Saludos {{nombre}},

Espero que se encuentre muy bien.

Le escribimos desde Docencia 4.0 para darle seguimiento cordial a su progreso en el LMS. Hemos identificado que aún tiene una o más secciones pendientes por completar.

Puede acceder al LMS desde el siguiente enlace:
{{lmsLink}}

Le invitamos a continuar cuando tenga oportunidad. Su participación es muy valiosa para el desarrollo del programa y para los procesos de investigación académica asociados.

Si tiene alguna duda, pregunta o sugerencia, puede comunicarse con el investigador al email carmelo.allende@upr.edu.

Gracias por su tiempo y compromiso.

Cordialmente,
Equipo Docencia 4.0`
    },
    forumReminder: {
        subject: "Recordatorio amistoso de participación en foro — Docencia 4.0",
        body:
`Saludos {{nombre}},

Espero que se encuentre muy bien.

Le compartimos este recordatorio amistoso sobre su participación pendiente en el foro correspondiente del LMS Docencia 4.0. Su aportación es importante para enriquecer la reflexión colectiva y documentar la experiencia formativa.

Puede acceder al LMS desde el siguiente enlace:
{{lmsLink}}

Desde allí podrá completar su participación cuando le sea posible.

Si tiene alguna duda, pregunta o sugerencia, puede comunicarse con el investigador al email carmelo.allende@upr.edu.

Gracias por su colaboración.

Cordialmente,
Equipo Docencia 4.0`
    },
    padletReminder: {
        subject: "Seguimiento cordial sobre evidencia en Padlet — Docencia 4.0",
        body:
`Saludos {{nombre}},

Espero que se encuentre muy bien.

Le escribimos desde Docencia 4.0 para darle seguimiento cordial a la evidencia de participación relacionada con una actividad en Padlet. Esta actividad forma parte de la documentación del proceso formativo y contribuye a la evidencia científica del proyecto.

Puede acceder al LMS desde el siguiente enlace:
{{lmsLink}}

Desde allí podrá revisar las instrucciones de la actividad correspondiente y completar o verificar su participación.

Si tiene alguna duda, pregunta o sugerencia, puede comunicarse con el investigador al email carmelo.allende@upr.edu.

Gracias por su colaboración y compromiso con el proyecto.

Cordialmente,
Equipo Docencia 4.0`
    },
    generalEncouragement: {
        subject: "Mensaje de apoyo — Docencia 4.0",
        body:
`Saludos {{nombre}},

Esperamos que se encuentre muy bien.

Queremos agradecerle su participación en Docencia 4.0. Su colaboración contribuye significativamente al desarrollo de esta experiencia formativa y al proceso de investigación académica.

Puede acceder al LMS desde el siguiente enlace:
{{lmsLink}}

Si tiene alguna duda, pregunta o sugerencia, puede comunicarse con el investigador al email carmelo.allende@upr.edu.

Seguimos disponibles para apoyarle durante el proceso.

Cordialmente,
Equipo Docencia 4.0`
    },
    completionThanks: {
        subject: "Gracias por completar secciones del proyecto — Docencia 4.0",
        body:
`Saludos {{nombre}},

Espero que se encuentre muy bien.

Queremos agradecerle por haber completado de manera eficiente las secciones correspondientes del proyecto Docencia 4.0. Su participación y compromiso son muy valiosos para el desarrollo del programa y para la documentación de esta experiencia académica.

Puede acceder al LMS desde el siguiente enlace:
{{lmsLink}}

Si tiene alguna duda, pregunta o sugerencia, puede comunicarse con el investigador al email carmelo.allende@upr.edu.

Gracias nuevamente por su colaboración.

Cordialmente,
Equipo Docencia 4.0`
    },
    blank: {
        subject: "",
        body: INSTITUTIONAL_COMMUNICATION_FOOTER
    },
    custom: {
        subject: "",
        body: INSTITUTIONAL_COMMUNICATION_FOOTER
    }
};

function extractEmailFromParticipantInput(value = '') {
  const normalized = String(value || '').trim();
  const emailMatch = normalized.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return emailMatch ? emailMatch[0].toLowerCase() : '';
}

let allParticipants = [];
let filteredParticipants = [];
let adminEmail = "";

// Elementos DOM
const dom = {
    communicationMode: document.getElementById('communicationMode'),
    participantSearch: document.getElementById('participantSearch'),
    selectedParticipantUid: document.getElementById('selectedParticipantUid'),
    selectedParticipantEmail: document.getElementById('selectedParticipantEmail'),
    selectedParticipantName: document.getElementById('selectedParticipantName'),
    progressFilter: document.getElementById('progressFilter'),
    forumFilter: document.getElementById('forumFilter'),
    padletFilter: document.getElementById('padletFilter'),
    btnApplyCommunicationFilters: document.getElementById('btnApplyCommunicationFilters'),
    recipientSummary: document.getElementById('recipientSummary'),
    recipientsTableBody: document.getElementById('recipientsTableBody'),
    btnSelectAllRecipients: document.getElementById('btnSelectAllRecipients'),
    btnClearRecipientSelection: document.getElementById('btnClearRecipientSelection'),
    messageTemplate: document.getElementById('messageTemplate'),
    emailSubject: document.getElementById('emailSubject'),
    emailBody: document.getElementById('emailBody'),
    replyToEmails: document.getElementById('replyToEmails'),
    btnPreviewCommunication: document.getElementById('btnPreviewCommunication'),
    btnSimulateCommunication: document.getElementById('btnSimulateCommunication'),
    btnRealCommunication: document.getElementById('btnRealCommunication'),
    btnClearCommunicationForm: document.getElementById('btnClearCommunicationForm'),
    communicationPreview: document.getElementById('communicationPreview'),
    communicationsHistory: document.getElementById('communicationsHistory'),
    btnLogout: document.getElementById('btnLogout')
};

// ==========================================
// INICIALIZACIÓN
// ==========================================

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userSnap = await getDocs(query(collection(db, "usuarios"), where("__name__", "==", user.uid)));
            if (!userSnap.empty && (userSnap.docs[0].data().role === "admin" || userSnap.docs[0].data().role === "investigador")) {
                adminEmail = user.email;
                dom.replyToEmails.value = `${adminEmail},${INVESTIGATOR_EMAIL}`;
                
                document.body.style.display = "block";
                
                await loadRegisteredParticipants();
                loadRecentCommunicationLogs();
                setupEventListeners();
            } else {
                handleUnauthorized();
            }
        } catch (error) {
            console.error("Error al verificar permisos:", error);
            handleUnauthorized();
        }
    } else {
        window.location.href = "index.html";
    }
});

function handleUnauthorized() {
    alert("No se pudo validar permiso de administrador. Comunicación deshabilitada.");
    document.getElementById('main-content').innerHTML = `
        <section class="page-card communication-warning" role="alert">
            <h2>Acceso denegado</h2>
            <p>No tiene permisos para utilizar esta herramienta administrativa.</p>
            <a href="dashboard.html" class="btn-action btn-primary">Volver al Dashboard</a>
        </section>
    `;
}

function setupEventListeners() {
    dom.btnLogout.addEventListener('click', () => auth.signOut());
    dom.btnApplyCommunicationFilters.addEventListener('click', applyCommunicationFilters);
    dom.btnSelectAllRecipients.addEventListener('click', selectAllFilteredRecipients);
    dom.btnClearRecipientSelection.addEventListener('click', clearRecipientSelection);
    dom.messageTemplate.addEventListener('change', applyMessageTemplate);
    dom.btnPreviewCommunication.addEventListener('click', renderCommunicationPreview);
    dom.btnSimulateCommunication.addEventListener('click', () => processCommunication('simulated'));
    if (dom.btnRealCommunication) {
        dom.btnRealCommunication.addEventListener('click', () => processCommunication('real'));
    }
    dom.btnClearCommunicationForm.addEventListener('click', clearCommunicationForm);
    
    dom.communicationMode.addEventListener('change', () => {
        updateParticipantSearchVisibilityByMode();

        if (dom.communicationMode.value === 'individual') {
            dom.btnSelectAllRecipients.style.display = 'none';
            dom.btnClearRecipientSelection.style.display = 'none';
        } else {
            dom.btnSelectAllRecipients.style.display = 'inline-block';
            dom.btnClearRecipientSelection.style.display = 'inline-block';
            
            // Notification on mode change
            dom.recipientSummary.textContent = "Modo colectivo activado. La búsqueda individual de participante fue limpiada.";
        }
    });

    dom.participantSearch?.addEventListener('change', () => {
        resolveSelectedParticipant();
    });
    
    updateParticipantSearchVisibilityByMode();
}

function clearParticipantSearchSelection() {
    if (dom.participantSearch) dom.participantSearch.value = '';
    if (dom.selectedParticipantUid) dom.selectedParticipantUid.value = '';
    if (dom.selectedParticipantEmail) dom.selectedParticipantEmail.value = '';
    if (dom.selectedParticipantName) dom.selectedParticipantName.value = '';
}

function updateParticipantSearchVisibilityByMode() {
    const isIndividual = dom.communicationMode?.value === 'individual';
    const participantSearchHelp = document.getElementById('participantSearchHelp');

    if (participantSearchHelp) {
        participantSearchHelp.hidden = !isIndividual;
    }

    if (dom.participantSearch) {
        dom.participantSearch.disabled = !isIndividual;
        dom.participantSearch.setAttribute('aria-disabled', String(!isIndividual));

        if (!isIndividual) {
            dom.participantSearch.placeholder = 'No aplica para comunicación colectiva';
        } else {
            dom.participantSearch.placeholder = 'Escriba nombre o email del participante';
        }
    }

    if (!isIndividual) {
        clearParticipantSearchSelection();
    }
}

function ensureCollectiveModeHasNoIndividualSearch() {
    if (dom.communicationMode?.value === 'colectiva') {
        clearParticipantSearchSelection();
    }
}

// ==========================================
// CARGA, DATALIST Y FILTROS
// ==========================================

async function loadRegisteredParticipants() {
    dom.recipientSummary.textContent = "Cargando participantes, por favor espere...";
    try {
        const usersCol = collection(db, "usuarios");
        // Remove role restriction to allow admins/investigators to be selected for testing
        const q = query(usersCol, where("status", "==", "active"));
        const snapshot = await getDocs(q);
        
        allParticipants = [];
        for (const userDoc of snapshot.docs) {
            const data = userDoc.data();
            if (data.isTest && data.role !== "admin" && data.role !== "investigador") continue;

            const uid = userDoc.id;
            
            const progModSnap = await getDocs(collection(db, "usuarios", uid, "progresoModulos"));
            const modProgress = { modulo1: 0, modulo2: 0, modulo3: 0 };
            progModSnap.forEach(d => {
                const md = d.data();
                modProgress[d.id] = md.percentComplete || 0;
            });

            const foros = { general: false, modulo1: false, modulo2: false, modulo3: false };
            const checkForum = async (foroId) => {
                const fSnap = await getDocs(query(collection(db, "foros", foroId, "publicaciones"), where("uid", "==", uid), limit(1)));
                return !fSnap.empty;
            };

            foros.general = await checkForum("general");
            foros.modulo1 = await checkForum("modulo1");
            foros.modulo2 = await checkForum("modulo2");
            foros.modulo3 = await checkForum("modulo3");

            allParticipants.push({
                uid,
                email: data.email,
                displayName: data.displayName || data.nombre || data.name || "Participante sin nombre",
                progress: modProgress,
                forums: foros
            });
        }
        allParticipants = getParticipantsWithSingleAdmin(allParticipants);
        populateParticipantDatalist(allParticipants);
        dom.recipientSummary.textContent = `Se cargaron ${allParticipants.length} participantes activos.`;
    } catch (error) {
        console.error("Error cargando participantes:", error);
        dom.recipientSummary.textContent = "Error al cargar participantes.";
    }
}

function populateParticipantDatalist(participants) {
    const datalist = document.getElementById('participantOptions');
    if (!datalist) return;
    datalist.innerHTML = '';

    participants.forEach((participant) => {
        const option = document.createElement('option');
        const displayName = participant.displayName || 'Participante sin nombre visible';
        const email = participant.email || '';

        option.value = `${displayName} — ${email}`;
        option.dataset.uid = participant.uid || participant.id || '';
        option.dataset.email = email;
        option.dataset.name = displayName;
        option.dataset.isAdminInternal = participant.isAdminInternal ? 'true' : 'false';

        datalist.appendChild(option);
    });
}


function resolveSelectedParticipant() {
  const input = dom.participantSearch;
  const uidInput = dom.selectedParticipantUid;
  const emailInput = dom.selectedParticipantEmail;
  const nameInput = dom.selectedParticipantName;
  const datalist = document.getElementById('participantOptions');

  if (!input) return null;

  const typedValue = String(input.value || '').trim();
  const typedEmail = extractEmailFromParticipantInput(typedValue);

  let resolved = null;

  // Strategy 1: exact match against datalist option value
  if (datalist) {
    const selectedOption = Array.from(datalist.options).find(
      (option) => String(option.value || '').trim() === typedValue
    );
    if (selectedOption) {
      resolved = {
        uid: selectedOption.dataset.uid || '',
        email: String(selectedOption.dataset.email || '').toLowerCase(),
        displayName: selectedOption.dataset.name || '',
        isAdminInternal: selectedOption.dataset.isAdminInternal === 'true'
      };
    }
  }

  // Strategy 2: resolve by email extracted from input
  if (!resolved && typedEmail) {
    if (typedEmail === ADMIN_INTERNAL_EMAIL) {
      resolved = { ...ADMIN_INTERNAL_RECIPIENT };
    } else {
      const byEmail = (allParticipants || []).find(
        (p) => String(p.email || '').toLowerCase() === typedEmail
      );
      if (byEmail) {
        resolved = {
          uid: byEmail.uid || '',
          email: String(byEmail.email || '').toLowerCase(),
          displayName: byEmail.displayName || '',
          isAdminInternal: byEmail.isAdminInternal === true
        };
      }
    }
  }

  // Strategy 3: fuzzy name match for admin
  if (!resolved && (typedValue.toLowerCase().includes('administrador') || typedValue.toLowerCase() === 'admin')) {
    resolved = { ...ADMIN_INTERNAL_RECIPIENT };
  }

  if (!resolved) {
    if (uidInput) uidInput.value = '';
    if (emailInput) emailInput.value = '';
    if (nameInput) nameInput.value = '';
    return null;
  }

  if (uidInput) uidInput.value = resolved.uid || '';
  if (emailInput) emailInput.value = resolved.email || '';
  if (nameInput) nameInput.value = resolved.displayName || '';

  return resolved;
}

function validateIndividualSelectionIfNeeded() {
    const mode = dom.communicationMode?.value;
    if (mode !== 'individual') return true;

    const selectedParticipant = resolveSelectedParticipant();
    const typedValue = dom.participantSearch?.value?.trim() || '';

    if (!typedValue && !selectedParticipant?.uid) {
        alert('Seleccione un participante de la lista o escriba su nombre o email.');
        return false;
    }
    
    // If there is typed value but no resolved participant from datalist, we warn but allow prototype testing if we wish,
    // however for strictly preventing errors we will demand selection from the list unless it looks like an email.
    if (!selectedParticipant?.uid && typedValue) {
        alert('El participante ingresado no está en la lista. Por favor, seleccione un participante registrado para evitar errores.');
        return false;
    }

    return true;
}

async function getParticipantsByPadletEvidence(participants, padletFilter) {
    if (!padletFilter) return participants;

    const activityMap = {
        padlet_actividad1_2_missing: ['actividad1_2'],
        padlet_actividad2_1_missing: ['actividad2_1'],
        padlet_actividad3_1_missing: ['actividad3_1'],
        padlet_any_missing: ['actividad1_2', 'actividad2_1', 'actividad3_1'],
        padlet_all_completed: ['actividad1_2', 'actividad2_1', 'actividad3_1']
    };

    const activities = activityMap[padletFilter] || [];
    const evaluated = [];

    for (const participant of participants) {
        const uid = participant.uid;
        if (!uid) continue;

        const evidenceResults = {};
        for (const activityId of activities) {
            try {
                const evidenceRef = doc(db, 'evidenciasPadlet', activityId, 'participantes', uid);
                const evidenceSnap = await getDoc(evidenceRef);
                evidenceResults[activityId] = evidenceSnap.exists()
                    ? evidenceSnap.data()?.evidenceStatus || 'registrada'
                    : 'pendiente';
            } catch (error) {
                console.warn('[Comunicaciones] No se pudo leer evidencia Padlet:', activityId, uid, error);
                evidenceResults[activityId] = 'desconocida';
            }
        }

        const hasMissing = Object.values(evidenceResults).some((status) => status !== 'registrada');
        const allCompleted = Object.values(evidenceResults).every((status) => status === 'registrada');

        if ((padletFilter === 'padlet_all_completed' && allCompleted) || (padletFilter !== 'padlet_all_completed' && hasMissing)) {
            evaluated.push({
                ...participant,
                followUpReason: buildPadletReason(padletFilter, evidenceResults),
                padletEvidence: evidenceResults
            });
        }
    }
    return evaluated;
}

function buildPadletReason(padletFilter, evidenceResults) {
    const labels = {
        actividad1_2: 'Padlet Actividad 1.2',
        actividad2_1: 'Padlet Actividad 2.1',
        actividad3_1: 'Padlet Actividad 3.1'
    };

    if (padletFilter === 'padlet_all_completed') {
        return 'Evidencia registrada en todos los Padlet';
    }

    const missing = Object.entries(evidenceResults)
        .filter(([, status]) => status !== 'registrada')
        .map(([activityId]) => labels[activityId] || activityId);

    if (!missing.length) {
        return 'Evidencia Padlet registrada';
    }

    return `Sin evidencia registrada en: ${missing.join(', ')}`;
}

async function applyCommunicationFilters() {
    ensureCollectiveModeHasNoIndividualSearch();
    dom.recipientSummary.textContent = "Aplicando filtros...";
    
    if (dom.communicationMode.value === 'individual' && !validateIndividualSelectionIfNeeded()) {
        dom.recipientSummary.textContent = "Seleccione un participante.";
        return;
    }

    const mode = dom.communicationMode.value;
    const selectedUid = dom.selectedParticipantUid.value;
    const selectedEmail = dom.selectedParticipantEmail.value;
    const progFilter = dom.progressFilter.value;
    const forumFilter = dom.forumFilter.value;
    const padletFilter = dom.padletFilter.value;

    // Direct path for admin: bypass Firestore-based progress/forum filtering
    if (mode === 'individual' && (
      selectedUid === ADMIN_INTERNAL_RECIPIENT.uid ||
      String(selectedEmail || '').toLowerCase() === ADMIN_INTERNAL_EMAIL
    )) {
      filteredParticipants = [{ ...ADMIN_INTERNAL_RECIPIENT }];
      renderRecipientsTable();
      dom.recipientSummary.textContent = 'Mostrando 1 participante que coincide con los filtros.';
      if (filteredParticipants.length > 0) {
        const cb = document.querySelector('.recipient-checkbox');
        if (cb) cb.checked = true;
      }
      return;
    }
    
    let baseParticipants = allParticipants;
    
    if (mode === 'individual' && selectedUid) {
        baseParticipants = allParticipants.filter(p => p.uid === selectedUid);
    }
    
    filteredParticipants = baseParticipants.filter(p => {
        // Progress
        if (progFilter === 'anyIncomplete') {
            if (p.progress.modulo1 >= 100 && p.progress.modulo2 >= 100 && p.progress.modulo3 >= 100) return false;
        } else if (progFilter === 'modulo1Incomplete' && p.progress.modulo1 >= 100) return false;
        else if (progFilter === 'modulo2Incomplete' && p.progress.modulo2 >= 100) return false;
        else if (progFilter === 'modulo3Incomplete' && p.progress.modulo3 >= 100) return false;

        // Forum
        if (forumFilter === 'foro_general_missing' && p.forums.general) return false;
        else if (forumFilter === 'foro_modulo1_missing' && p.forums.modulo1) return false;
        else if (forumFilter === 'foro_modulo2_missing' && p.forums.modulo2) return false;
        else if (forumFilter === 'foro_modulo3_missing' && p.forums.modulo3) return false;

        return true;
    });

    if (padletFilter) {
        filteredParticipants = await getParticipantsByPadletEvidence(filteredParticipants, padletFilter);
    }

    renderRecipientsTable();
    
    if (dom.communicationMode.value === 'colectiva') {
        dom.btnSelectAllRecipients.style.display = 'inline-block';
        dom.btnClearRecipientSelection.style.display = 'inline-block';
    } else {
        dom.btnSelectAllRecipients.style.display = 'none';
        dom.btnClearRecipientSelection.style.display = 'none';
        
        // Si es individual, preseleccionar al usuario
        if (filteredParticipants.length > 0) {
            const cb = document.querySelector('.recipient-checkbox');
            if (cb) cb.checked = true;
        }
    }
}

function getFollowUpReason(p) {
    if (p.followUpReason) return p.followUpReason; // Padlet or override
    
    if (dom.communicationMode.value === 'individual' && !dom.progressFilter.value && !dom.forumFilter.value && !dom.padletFilter.value) {
        return "Comunicación individual seleccionada por administrador";
    }

    const reasons = [];
    if (p.progress.modulo1 < 100) reasons.push("M1 incomp.");
    if (p.progress.modulo2 < 100) reasons.push("M2 incomp.");
    if (p.progress.modulo3 < 100) reasons.push("M3 incomp.");
    if (!p.forums.general) reasons.push("Sin Foro Gen");
    if (!p.forums.modulo1) reasons.push("Sin Foro M1");
    if (!p.forums.modulo2) reasons.push("Sin Foro M2");
    if (!p.forums.modulo3) reasons.push("Sin Foro M3");
    
    return reasons.length > 0 ? reasons.join(', ') : "Completo";
}

function renderRecipientsTable() {
    dom.recipientSummary.innerHTML = `Mostrando ${filteredParticipants.length} participante(s).`;
    dom.recipientsTableBody.innerHTML = '';
    
    filteredParticipants.forEach(p => {
        const tr = document.createElement('tr');
        const type = dom.communicationMode.value === 'individual' ? 'radio' : 'checkbox';
        const reason = getFollowUpReason(p);
        
        tr.innerHTML = `
            <td><input type="${type}" name="recipientSelection" class="recipient-checkbox" value="${p.uid}" data-email="${p.email}" data-name="${p.displayName}" data-reason="${reason}"></td>
            <td>
                <div style="font-weight: 600;">${p.displayName}</div>
                <div style="font-size: 12px; color: var(--color-text-secondary);">${p.email}</div>
            </td>
            <td style="font-size: 13px; color: var(--color-text-secondary);">${reason}</td>
        `;
        dom.recipientsTableBody.appendChild(tr);
    });
}

function selectAllFilteredRecipients() {
    const checkboxes = document.querySelectorAll('.recipient-checkbox');
    checkboxes.forEach(cb => cb.checked = true);
}

function clearRecipientSelection() {
    const checkboxes = document.querySelectorAll('.recipient-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
}

// ==========================================
// REDACCIÓN Y VISTA PREVIA
// ==========================================

function applyMessageTemplate() {
    const tplId = dom.messageTemplate.value;
    if (tplId === 'blank' || tplId === '' || tplId === 'custom') {
        const messageField = dom.emailBody;
        if (messageField) {
            const hasUserText = messageField.value.trim().length > 0;
            if (hasUserText) {
                const confirmed = window.confirm(
                    'El campo mensaje ya tiene contenido. ¿Desea reemplazarlo por la plantilla seleccionada?'
                );
                if (!confirmed) {
                    // Revert selection
                    dom.messageTemplate.value = dom.messageTemplate.dataset.lastValue || '';
                    return;
                }
            }
        }
        if (tplId === 'blank' || tplId === 'custom') {
            dom.emailSubject.value = MESSAGE_TEMPLATES.blank.subject;
            dom.emailBody.value = ensureInstitutionalFooter(MESSAGE_TEMPLATES.blank.body);
        } else {
            dom.emailSubject.value = "";
            dom.emailBody.value = ensureInstitutionalFooter("");
        }
    } else if (tplId && MESSAGE_TEMPLATES[tplId]) {
        const messageField = dom.emailBody;
        if (messageField) {
            const hasUserText = messageField.value.trim().length > 0;
            if (hasUserText) {
                const confirmed = window.confirm(
                    'El campo mensaje ya tiene contenido. ¿Desea reemplazarlo por la plantilla seleccionada?'
                );
                if (!confirmed) {
                    // Revert selection
                    dom.messageTemplate.value = dom.messageTemplate.dataset.lastValue || '';
                    return;
                }
            }
        }
        dom.emailSubject.value = MESSAGE_TEMPLATES[tplId].subject;
        dom.emailBody.value = ensureInstitutionalFooter(MESSAGE_TEMPLATES[tplId].body);
    }
    
    dom.messageTemplate.dataset.lastValue = tplId;
    if (dom.btnPreviewCommunication) {
        renderCommunicationPreview();
    }
}

function getSelectedRecipients() {
    const checkboxes = document.querySelectorAll('.recipient-checkbox:checked');
    const selected = [];
    checkboxes.forEach(cb => {
        const uid = cb.value;
        const participantData = filteredParticipants.find(p => p.uid === uid) || {};
        
        selected.push({
            uid: uid,
            email: cb.getAttribute('data-email'),
            displayName: cb.getAttribute('data-name'),
            reason: cb.getAttribute('data-reason'),
            padletEvidence: participantData.padletEvidence || null,
            status: "simulated"
        });
    });
    return selected;
}

function personalizeMessage(templateBody, participant) {
    const displayName = participant?.displayName || participant?.nombre || participant?.name || 'participante';
    return templateBody
        .replaceAll('{{nombre}}', displayName)
        .replaceAll('{{lmsLink}}', `<a href="${LMS_LINK}" target="_blank" rel="noopener noreferrer">Acceder al LMS Docencia 4.0</a>`)
        .replaceAll('\n', '<br>');
}

function personalizeMessageRaw(templateBody, participant) {
    const displayName = participant?.displayName || participant?.nombre || participant?.name || 'participante';
    return templateBody
        .replaceAll('{{nombre}}', displayName)
        .replaceAll('{{lmsLink}}', LMS_LINK);
}

function renderCommunicationPreview() {
    ensureCollectiveModeHasNoIndividualSearch();
    if (!validateIndividualSelectionIfNeeded()) return;

    const selected = getSelectedRecipients();
    const subject = dom.emailSubject.value.trim();
    const body = dom.emailBody.value.trim();
    
    if (selected.length === 0) {
        dom.communicationPreview.innerHTML = `<div class="email-preview-empty"><span style="color:red;">Error: Debe seleccionar al menos un destinatario de la tabla de participantes encontrados.</span></div>`;
        return;
    }
    if (!subject || !body) {
        dom.communicationPreview.innerHTML = `<div class="email-preview-empty"><span style="color:red;">Error: El asunto y el mensaje son obligatorios.</span></div>`;
        return;
    }

    const firstRecipient = selected[0];
    const previewBodyHTML = personalizeMessage(body, firstRecipient);

    dom.communicationPreview.innerHTML = `
<div class="email-preview-header">
    <img src="assets/LLM_Docencia_4.0_logo.png" alt="Docencia 4.0" class="email-preview-logo">
    <div>
        <strong>Docencia 4.0</strong>
        <span>Comunicación institucional</span>
    </div>
</div>

<div class="email-preview-meta">
    <p><strong>Asunto:</strong> ${subject}</p>
    <p><strong>Para:</strong> ${firstRecipient.email} ${selected.length > 1 ? `(+${selected.length - 1} más de forma individualizada/BCC)` : ''}</p>
    <p><strong>Respuestas a:</strong> ${dom.replyToEmails.value}</p>
</div>

<div class="email-preview-body">${previewBodyHTML}</div>
<div style="margin-top: 16px; font-size: 11px; color: var(--color-text-muted);">
    <strong>Modo:</strong> Simulación (${dom.communicationMode.value})
</div>
`;
}

// ==========================================
// SIMULACIÓN Y REGISTRO
// ==========================================

function requireCommunicationConfirmation(recipientCount, requestedMode) {
    if (recipientCount === 0) return null;

    if (requestedMode === 'simulated') {
        const typed = window.prompt(
            `Está a punto de registrar una comunicación simulada para ${recipientCount} participante(s).\n\n` +
            `Para continuar, escriba:\nCOMUNICAR`
        );
        return typed === 'COMUNICAR' ? 'simulated' : null;
    } else if (requestedMode === 'real') {
        const typed = window.prompt(
            `Está a punto de enviar una comunicación real por email a ${recipientCount} destinatario(s).\n\n` +
            `ADVERTENCIA: Esta acción enviará correos reales a los destinatarios seleccionados. Verifique cuidadosamente la lista antes de continuar.\n\n` +
            `Para continuar, escriba:\nENVIAR REAL`
        );
        if (typed === 'ENVIAR REAL') {
            if (recipientCount > MAX_REAL_RECIPIENTS_PER_SEND) {
                alert(`Error: No puede enviar correos reales a más de ${MAX_REAL_RECIPIENTS_PER_SEND} participantes a la vez.`);
                return null;
            }
            return 'real';
        }
        return null;
    }
    return null;
}

async function processCommunication(requestedMode) {
    ensureCollectiveModeHasNoIndividualSearch();
    if (!validateIndividualSelectionIfNeeded()) return;

    const selected = getSelectedRecipients();
    const subject = dom.emailSubject.value.trim();
    const body = dom.emailBody.value.trim();
    
    if (selected.length === 0) return alert("Seleccione destinatarios de la tabla.");
    if (!subject || !body) return alert("El asunto y el mensaje son obligatorios.");

    const execMode = requireCommunicationConfirmation(selected.length, requestedMode);
    if (!execMode) {
        alert("Acción cancelada. No se registró ninguna comunicación ni se enviaron correos.");
        return;
    }

    const firstRecipient = selected[0];
    const rawPersonalizedBody = personalizeMessageRaw(body, firstRecipient);
    const htmlPersonalizedBody = personalizeMessage(body, firstRecipient);

    const commData = {
        type: dom.communicationMode.value,
        mode: execMode === 'real' ? "real_participant_send" : "simulada",
        status: execMode === 'real' ? "real_send_pending" : "simulated",
        realSendPhase: execMode === 'real' ? "participants_controlled" : null,
        subject: subject,
        messageBodyTemplate: body,
        messageBodyPreview: htmlPersonalizedBody,
        messageBodyRaw: rawPersonalizedBody,
        templateId: dom.messageTemplate.value || null,
        createdAt: serverTimestamp(),
        createdByUid: auth.currentUser.uid,
        createdByEmail: adminEmail,
        replyTo: dom.replyToEmails.value.split(','),
        recipientCount: selected.length,
        filtersApplied: {
            progressFilter: dom.progressFilter.value,
            forumFilter: dom.forumFilter.value,
            padletFilter: dom.padletFilter.value
        },
        recipients: selected,
        branding: {
            logoPath: "assets/LLM_Docencia_4.0_logo.png",
            senderName: "Docencia 4.0",
            emailHeaderTitle: "Docencia 4.0",
            emailHeaderSubtitle: "Comunicación institucional"
        },
        templateVariables: {
            lmsLink: LMS_LINK,
            investigatorEmail: INVESTIGATOR_EMAIL
        },
        lmsLink: LMS_LINK,
        investigatorContact: INVESTIGATOR_EMAIL
    };

    try {
        const docRef = await addDoc(collection(db, "comunicaciones"), commData);
        let alertMessage = `Comunicación registrada exitosamente. ID: ${docRef.id}`;

        if (execMode === 'real') {
            alertMessage += `\nLlamando a envío real de correos...`;
            try {
                await requestBackendDryRun(docRef.id, false);
                alertMessage += `\n✅ Envío real procesado correctamente.`;
            } catch (backendError) {
                console.error(`Error en envío real:`, backendError);
                alertMessage += `\n❌ Error en envío real: ${backendError.message}`;
            }
        } else if (ENABLE_EMAIL_DRY_RUN_BACKEND) {
            alertMessage += `\nLlamando a backend dry-run...`;
            try {
                await requestBackendDryRun(docRef.id, true);
                alertMessage += `\n✅ Backend dry-run procesado correctamente.`;
            } catch (backendError) {
                console.error(`Error en backend dry-run:`, backendError);
                alertMessage += `\n❌ Error en backend dry-run: ${backendError.message}`;
            }
        }

        alert(alertMessage);
        clearCommunicationForm();
        loadRecentCommunicationLogs();
    } catch (error) {
        console.error("Error registrando comunicación:", error);
        alert("Ocurrió un error al registrar la comunicación simulada.");
    }
}

async function requestBackendDryRun(communicationId, isDryRun) {
    const sendCommunicationEmail = httpsCallable(functionsClient, 'sendCommunicationEmail');

    return await sendCommunicationEmail({
        communicationId,
        dryRun: isDryRun 
    });
}

function clearCommunicationForm() {
    clearRecipientSelection();
    dom.messageTemplate.value = "";
    dom.emailSubject.value = "";
    dom.emailBody.value = "";
    dom.communicationPreview.innerHTML = '<div class="email-preview-empty">Complete destinatarios, asunto y mensaje para generar la vista previa.</div>';
}

// ==========================================
// HISTORIAL
// ==========================================

let showArchivedCommunications = false;
let cachedCommunicationHistory = [];

window.archiveCommunication = async function(communicationId) {
    if (!communicationId) return;

    const confirmed = window.confirm(
        '¿Desea archivar esta comunicación? Podrá conservarse para trazabilidad, pero dejará de aparecer en el historial activo.'
    );

    if (!confirmed) return;

    try {
        const ref = doc(db, 'comunicaciones', communicationId);
        await updateDoc(ref, {
            archived: true,
            archivedAt: new Date().toISOString(),
            archivedBy: auth.currentUser?.email || auth.currentUser?.uid || 'admin'
        });
        await loadRecentCommunicationLogs();
    } catch (e) {
        console.error("Error archiving communication:", e);
        alert("Error al archivar la comunicación.");
    }
};

window.softDeleteCommunication = async function(communicationId) {
    if (!communicationId) return;

    const typed = window.prompt(
        'Esta acción ocultará la comunicación del historial activo. Para confirmar, escriba BORRAR.'
    );

    if (typed !== 'BORRAR') return;

    try {
        const ref = doc(db, 'comunicaciones', communicationId);
        await updateDoc(ref, {
            deleted: true,
            deletedAt: new Date().toISOString(),
            deletedBy: auth.currentUser?.email || auth.currentUser?.uid || 'admin'
        });
        await loadRecentCommunicationLogs();
    } catch (e) {
        console.error("Error deleting communication:", e);
        alert("Error al borrar la comunicación.");
    }
};

window.toggleArchivedCommunications = function(checkbox) {
    showArchivedCommunications = checkbox.checked;
    renderCommunicationHistory(cachedCommunicationHistory);
};

function isPilotOrTestCommunication(item = {}) {
    const subject = String(item.subject || item.asunto || '').toLowerCase();
    const mode = String(item.mode || '').toLowerCase();
    const status = String(item.status || '').toLowerCase();
    const phase = String(item.realSendPhase || '').toLowerCase();

    return (
        mode.includes('dry_run') ||
        mode.includes('real_admin_test') ||
        status.includes('dry_run') ||
        status.includes('real_admin_test') ||
        phase.includes('admin_test') ||
        subject.includes('prueba') ||
        subject.includes('piloto')
    );
}

function filterCommunicationHistory(items = []) {
    return items.filter((item) => {
        if (item.deleted === true) return false;
        if (item.archived === true && !showArchivedCommunications) return false;
        if (isPilotOrTestCommunication(item) && !showArchivedCommunications) return false;
        return true;
    });
}

function getReadableCommunicationStatus(item = {}) {
    const mode = String(item.mode || '').toLowerCase();
    const status = String(item.status || '').toLowerCase();

    if (item.deleted) return 'Borrada';
    if (item.archived) return 'Archivada';

    if (mode === 'real_participant_send' || status === 'real_send_sent') {
        return 'Enviada';
    }

    if (status === 'real_send_partial') {
        return 'Enviada parcialmente';
    }

    if (status === 'real_send_failed') {
        return 'Fallida';
    }

    if (mode.includes('dry_run') || status.includes('dry_run')) {
        return 'Simulada';
    }

    return 'Registrada';
}

function renderCommunicationHistory(items) {
    const filtered = filterCommunicationHistory(items);
    
    let html = `
        <div style="margin-bottom: 1rem; display: flex; justify-content: flex-end;">
            <label class="history-toggle" style="cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                <input type="checkbox" id="showArchivedCommunications" onchange="toggleArchivedCommunications(this)" ${showArchivedCommunications ? 'checked' : ''}>
                <span style="font-size: 0.9rem; color: var(--color-text-secondary);">Mostrar archivados</span>
            </label>
        </div>
    `;

    if (filtered.length === 0) {
        html += '<p style="color: var(--color-text-secondary); font-style: italic;">No hay comunicaciones para mostrar.</p>';
        dom.communicationsHistory.innerHTML = html;
        return;
    }

    html += '<ul class="communications-history-list">';
    filtered.forEach(data => {
        const dateStr = data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toLocaleString() : new Date(data.createdAt).toLocaleString()) : 'Reciente';
        const readableStatus = getReadableCommunicationStatus(data);
        
        html += `
            <li class="history-item" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
                <div>
                    <strong>${data.subject}</strong> <span class="badge" style="background: #e2e8f0; color: #4a5568; font-size: 0.8rem; padding: 0.2rem 0.5rem; border-radius: 4px;">${readableStatus}</span>
                    <br>
                    <small style="color: var(--color-text-secondary);">
                        <strong>Fecha:</strong> ${dateStr} | 
                        <strong>Destinatarios:</strong> ${data.recipientCount} (${data.type}) |
                        <strong>Enviado por:</strong> ${data.createdByEmail}
                    </small>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button aria-label="Archivar comunicación" onclick="archiveCommunication('${data.id}')" title="Archivar" style="background: none; border: none; cursor: pointer; color: var(--color-text-secondary);"><i class="material-icons" style="font-size: 1.2rem;">archive</i></button>
                    <button aria-label="Borrar comunicación" onclick="softDeleteCommunication('${data.id}')" title="Borrar" style="background: none; border: none; cursor: pointer; color: var(--color-feedback-error);"><i class="material-icons" style="font-size: 1.2rem;">delete</i></button>
                </div>
            </li>
        `;
    });
    html += '</ul>';
    dom.communicationsHistory.innerHTML = html;
}

async function loadRecentCommunicationLogs() {
    try {
        const q = query(collection(db, "comunicaciones"), orderBy("createdAt", "desc"), limit(50));
        const snap = await getDocs(q);
        
        cachedCommunicationHistory = [];
        snap.forEach(doc => {
            cachedCommunicationHistory.push({ id: doc.id, ...doc.data() });
        });
        
        renderCommunicationHistory(cachedCommunicationHistory);
    } catch (error) {
        console.error("Error cargando historial:", error);
        dom.communicationsHistory.innerHTML = '<p style="color: var(--color-feedback-error);">Error al cargar el historial.</p>';
    }
}

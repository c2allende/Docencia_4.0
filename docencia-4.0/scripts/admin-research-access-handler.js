(function () {
  'use strict';

  var ADMIN_EMAIL_TO_REMOVE = 'carmelo.allende@gmail.com';

  var OFFICIAL_LINKS = {
    consent: 'https://forms.gle/TCx5has4pBDRQQQ57',
    posttest: 'https://forms.gle/of3qAs9kYcW4yZS36',
    focus: ''
  };

  var SELECTORS = {
    section: 'toggleSection',
    consent: 'toggleConsent',
    posttest: 'togglePosttest',
    focus: 'toggleFocus',
    urlConsent: 'urlConsent',
    urlPosttest: 'urlPosttest',
    urlFocus: 'urlFocus',
    focusAllowedEmails: 'focusAllowedEmails',
    focusParticipantSearch: 'focusParticipantSearch',
    focusParticipantsList: 'focusParticipantsList',
    focusParticipantsStatus: 'focusParticipantsStatus',
    focusSelectedParticipants: 'focusSelectedParticipants',
    offAll: 'btnOffAll',
    restore: 'btnRestore',
    save: 'btnSaveResearchConfig',
    preview: 'previewContainer',
    status: 'researchAccessStatus'
  };

  var registeredFocusParticipants = [];
  var selectedFocusEmails = [];

  function byId(id) {
    return document.getElementById(id);
  }

  function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
  }

  function isAdminEmail(email) {
    return normalizeEmail(email) === ADMIN_EMAIL_TO_REMOVE;
  }

  function setStatus(message, type) {
    var el = byId(SELECTORS.status);
    if (!el) return;
    el.textContent = message || '';
    el.dataset.status = type || 'info';
  }

  function parseEmailList(value) {
    return String(value || '')
      .split(/[\n,;]+/)
      .map(function (email) { return normalizeEmail(email); })
      .filter(function (email) { return email.length > 0 && email.indexOf('@') > -1; })
      .filter(function (email, index, arr) { return arr.indexOf(email) === index; });
  }

  function isActiveParticipantRecord(data) {
    var role = String(data.role || data.rol || '').toLowerCase().trim();
    var status = String(data.status || data.estado || '').toLowerCase().trim();

    var isParticipant = role === 'participante' || role === 'participant' || role === 'estudiante' || role === 'student';
    var isAdmin = role === 'admin' || role === 'administrador' || role === 'investigador';

    var explicitlyInactive = data.active === false ||
      data.isActive === false ||
      data.enabled === false ||
      data.disabled === true ||
      data.deleted === true ||
      data.archived === true ||
      Boolean(data.deletedAt) ||
      Boolean(data.removedAt) ||
      status === 'inactive' ||
      status === 'inactivo' ||
      status === 'removed' ||
      status === 'removido' ||
      status === 'deleted' ||
      status === 'eliminado' ||
      status === 'archived' ||
      status === 'archivado';

    return isParticipant && !isAdmin && !explicitlyInactive;
  }

  function removeAdminEmailsFromList(emails) {
    return (emails || []).filter(function (email) {
      return email && !isAdminEmail(email);
    });
  }

  function getAllowedEmailsFromSelection() {
    var activeEmails = registeredFocusParticipants.map(function (user) {
      return normalizeEmail(user.email);
    });

    return selectedFocusEmails
      .map(function (email) { return normalizeEmail(email); })
      .filter(function (email) { return email && email.indexOf('@') > -1; })
      .filter(function (email) { return !isAdminEmail(email); })
      .filter(function (email) { return activeEmails.indexOf(email) > -1; })
      .filter(function (email, index, arr) { return arr.indexOf(email) === index; });
  }

  function pruneSelectedEmailsToActiveParticipants() {
    var activeEmails = registeredFocusParticipants.map(function (user) {
      return normalizeEmail(user.email);
    });

    selectedFocusEmails = selectedFocusEmails
      .map(function (email) { return normalizeEmail(email); })
      .filter(function (email) { return activeEmails.indexOf(email) > -1; })
      .filter(function (email) { return !isAdminEmail(email); });
  }

  function syncTextareaFromSelectedEmails() {
    var textarea = byId(SELECTORS.focusAllowedEmails);
    if (!textarea) return;
    textarea.value = selectedFocusEmails.join('\n');
  }

  function syncSelectedEmailsFromTextarea() {
    var textarea = byId(SELECTORS.focusAllowedEmails);
    if (!textarea) return;
    selectedFocusEmails = parseEmailList(textarea.value);
    pruneSelectedEmailsToActiveParticipants();
    syncTextareaFromSelectedEmails();
    renderFocusParticipantList();
    renderSelectedParticipants();
    renderPreview();
  }

  function getState() {
    syncTextareaFromSelectedEmails();

    return {
      sectionEnabled: !!byId(SELECTORS.section)?.checked,

      consentPretest: {
        enabled: !!byId(SELECTORS.consent)?.checked,
        title: 'Consentimiento informado y preprueba',
        badge: 'Sesion inicial',
        url: byId(SELECTORS.urlConsent)?.value.trim() || '',
        buttonLabel: 'Acceder al consentimiento y preprueba'
      },

      posttest: {
        enabled: !!byId(SELECTORS.posttest)?.checked,
        title: 'Postprueba',
        badge: 'Cierre del proceso formativo',
        url: byId(SELECTORS.urlPosttest)?.value.trim() || '',
        buttonLabel: 'Acceder a la postprueba'
      },

      focusGroupConsent: {
        enabled: !!byId(SELECTORS.focus)?.checked,
        title: 'Consentimiento para grupo focal',
        badge: 'Solo participantes convocados',
        url: byId(SELECTORS.urlFocus)?.value.trim() || '',
        buttonLabel: 'Acceder al consentimiento del grupo focal',
        audienceMode: 'selected_only',
        allowedEmails: getAllowedEmailsFromSelection(),
        allowedUids: []
      }
    };
  }

  function setInitialUrlsIfEmpty() {
    var consentUrl = byId(SELECTORS.urlConsent);
    var posttestUrl = byId(SELECTORS.urlPosttest);
    var focusUrl = byId(SELECTORS.urlFocus);

    if (consentUrl && !consentUrl.value.trim()) consentUrl.value = OFFICIAL_LINKS.consent;
    if (posttestUrl && !posttestUrl.value.trim()) posttestUrl.value = OFFICIAL_LINKS.posttest;
    if (focusUrl && !focusUrl.value.trim()) focusUrl.value = OFFICIAL_LINKS.focus;
  }

  function hasActiveInstrument(state) {
    return Boolean(state.consentPretest.enabled || state.posttest.enabled || state.focusGroupConsent.enabled);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function descriptionFor(key) {
    if (key === 'consent') {
      return 'Acceso al formulario que incluye el consentimiento informado y la preprueba. Debe completarse solo despues de la orientacion presencial del investigador.';
    }
    if (key === 'posttest') {
      return 'Acceso al instrumento posterior que se habilitara al finalizar los talleres, actividades y foros correspondientes.';
    }
    return 'Acceso destinado unicamente a participantes invitados a la fase cualitativa de grupos focales. Requerira consentimiento aparte y se habilitara cuando el investigador tenga el documento o enlace final.';
  }

  function renderCard(item, key) {
    var url = item.url || '';
    var hasUrl = url.trim().length > 0;
    var action = hasUrl
      ? '<a class="btn btn-primary" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(item.buttonLabel) + '</a>'
      : '<button class="btn btn-secondary" type="button" disabled>Documento pendiente</button>';

    return ''
      + '<article class="research-access-preview-card" style="background:#fff;border:1px solid var(--color-border-default, #e5e7eb);border-radius:16px;padding:24px;box-shadow:var(--shadow-sm);">'
      + '<span class="badge" style="background-color:#ecfdf5;color:#065f46;padding:2px 10px;border-radius:999px;font-size:.75rem;border:1px solid #a7f3d0;text-transform:uppercase;letter-spacing:.08em;font-weight:700;">'
      + escapeHtml(item.badge)
      + '</span>'
      + '<h3 style="font-family:var(--font-family-heading);color:var(--color-text-display);margin:16px 0 12px;">'
      + escapeHtml(item.title)
      + '</h3>'
      + '<p style="color:var(--color-text-secondary);line-height:1.65;margin-bottom:20px;">'
      + escapeHtml(descriptionFor(key))
      + '</p>'
      + action
      + '</article>';
  }

  function renderPreview() {
    var preview = byId(SELECTORS.preview);
    if (!preview) return;

    var state = getState();

    if (!state.sectionEnabled || !hasActiveInstrument(state)) {
      preview.innerHTML = '<div style="border:1px dashed var(--color-border-default, #cbd5e1);border-radius:12px;padding:32px;text-align:center;color:var(--color-text-secondary);background:var(--color-background-surface-low, #f8fafc);">El bloque de investigacion no estara visible para los participantes.</div>';
      return;
    }

    var cards = [];

    if (state.consentPretest.enabled) cards.push(renderCard(state.consentPretest, 'consent'));
    if (state.posttest.enabled) cards.push(renderCard(state.posttest, 'posttest'));

    if (state.focusGroupConsent.enabled) {
      cards.push(renderCard(state.focusGroupConsent, 'focus'));
      var emailCount = state.focusGroupConsent.allowedEmails.length;
      if (emailCount === 0) {
        cards.push(
          '<div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:14px 18px;margin-top:4px;color:#92400e;font-size:0.9rem;">'
          + '<strong>Atencion:</strong> Grupo focal esta activo, pero no hay participantes autorizados. '
          + 'Ningun participante vera este acceso.'
          + '</div>'
        );
      } else {
        cards.push(
          '<div style="background:#ecfdf5;border:1px solid #10b981;border-radius:8px;padding:14px 18px;margin-top:4px;color:#065f46;font-size:0.9rem;">'
          + 'Visible solo para ' + emailCount + ' participante(s) seleccionado(s).'
          + '</div>'
        );
      }
    }

    preview.innerHTML =
      '<section style="background:#fff;border-radius:18px;padding:28px;border:1px solid var(--color-border-default, #e5e7eb);">'
      + '<p class="section-kicker" style="margin-bottom:8px;">Investigacion</p>'
      + '<h3 style="font-family:var(--font-family-heading);color:var(--color-text-display);font-size:1.6rem;margin:0 0 18px;">Participacion en la investigacion</h3>'
      + '<div style="background:var(--color-background-surface-low, #f1f5f9);border-left:4px solid var(--color-brand-primary);padding:14px 18px;border-radius:8px;margin-bottom:24px;">'
      + '<strong>Nota importante:</strong> Complete cada formulario o documento unicamente cuando el investigador lo indique. La participacion en la investigacion es voluntaria y el LMS no recopila sus respuestas a estos instrumentos.'
      + '</div>'
      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;">'
      + cards.join('')
      + '</div>'
      + '</section>';
  }

  function renderSelectedParticipants() {
    var container = byId(SELECTORS.focusSelectedParticipants);
    if (!container) return;

    if (selectedFocusEmails.length === 0) {
      container.innerHTML = '<span class="research-access-url-help">No hay participantes seleccionados.</span>';
      return;
    }

    container.innerHTML = selectedFocusEmails.map(function (email) {
      return '<span class="research-selected-chip">' + escapeHtml(email) + '</span>';
    }).join('');
  }

  function renderFocusParticipantList() {
    var list = byId(SELECTORS.focusParticipantsList);
    if (!list) return;

    var searchValue = normalizeEmail(byId(SELECTORS.focusParticipantSearch)?.value || '');

    var filtered = registeredFocusParticipants.filter(function (user) {
      if (isAdminEmail(user.email)) return false;
      var haystack = normalizeEmail((user.name || '') + ' ' + (user.email || ''));
      return !searchValue || haystack.indexOf(searchValue) > -1;
    });

    if (filtered.length === 0) {
      list.innerHTML = '<div class="research-access-empty-preview" style="padding:16px;text-align:center;color:var(--color-text-secondary);">No se encontraron participantes.</div>';
      return;
    }

    list.innerHTML = filtered.map(function (user) {
      var email = normalizeEmail(user.email);
      var checked = selectedFocusEmails.indexOf(email) > -1;

      return ''
        + '<label class="research-focus-participant-row">'
        + '<input type="checkbox" class="focus-participant-checkbox" data-email="' + escapeHtml(email) + '" ' + (checked ? 'checked' : '') + ' />'
        + '<span class="research-focus-participant-main">'
        + '<span class="research-focus-participant-name">' + escapeHtml(user.name || 'Participante') + '</span>'
        + '<span class="research-focus-participant-email">' + escapeHtml(email) + '</span>'
        + '</span>'
        + '</label>';
    }).join('');

    Array.prototype.forEach.call(list.querySelectorAll('.focus-participant-checkbox'), function (checkbox) {
      checkbox.addEventListener('change', function (event) {
        var email = normalizeEmail(event.target.getAttribute('data-email'));
        if (!email) return;

        if (event.target.checked) {
          if (selectedFocusEmails.indexOf(email) === -1) selectedFocusEmails.push(email);
        } else {
          selectedFocusEmails = selectedFocusEmails.filter(function (item) { return item !== email; });
        }

        syncTextareaFromSelectedEmails();
        renderSelectedParticipants();
        renderPreview();
      });
    });
  }

  function loadActiveParticipantsFromSnapshot(snap) {
    var users = [];
    snap.forEach(function (docSnap) {
      var data = docSnap.data() || {};
      users.push({
        uid: docSnap.id,
        name: data.displayName || data.nombre || data.name || data.fullName || data.email || 'Participante',
        email: normalizeEmail(data.email || data.correo || ''),
        role: String(data.role || data.rol || '').toLowerCase(),
        isActiveParticipant: isActiveParticipantRecord(data)
      });
    });

    registeredFocusParticipants = users
      .filter(function (user) { return user.email && user.isActiveParticipant === true; })
      .sort(function (a, b) { return String(a.name).localeCompare(String(b.name)); });

    if (byId(SELECTORS.focusParticipantsStatus)) {
      byId(SELECTORS.focusParticipantsStatus).textContent = registeredFocusParticipants.length + ' participante(s) activo(s) disponible(s) para seleccion.';
    }

    pruneSelectedEmailsToActiveParticipants();
    renderFocusParticipantList();
    syncTextareaFromSelectedEmails();
    renderSelectedParticipants();
    renderPreview();
  }

  function loadConfigFromFirestore() {
    try {
      var doLoad = function () {
        if (window.db && window.doc && window.getDoc) {
          return window.getDoc(window.doc(window.db, 'researchAccess', 'config'))
            .then(function (snap) {
              if (snap.exists()) {
                var config = snap.data();
                var savedEmails = (config.focusGroupConsent && config.focusGroupConsent.allowedEmails) || [];
                selectedFocusEmails = removeAdminEmailsFromList(savedEmails);
                pruneSelectedEmailsToActiveParticipants();
                renderFocusParticipantList();
                syncTextareaFromSelectedEmails();
                renderSelectedParticipants();
                renderPreview();
              }
            });
        }
        if (window.firebase && typeof window.firebase.firestore === 'function') {
          return window.firebase.firestore().collection('researchAccess').doc('config').get()
            .then(function (snap) {
              if (snap.exists) {
                var config = snap.data();
                var savedEmails = (config.focusGroupConsent && config.focusGroupConsent.allowedEmails) || [];
                selectedFocusEmails = removeAdminEmailsFromList(savedEmails);
                pruneSelectedEmailsToActiveParticipants();
                renderFocusParticipantList();
                syncTextareaFromSelectedEmails();
                renderSelectedParticipants();
                renderPreview();
              }
            });
        }
      };

      if (doLoad) {
        doLoad()['catch'](function (error) {
          console.warn('[ResearchAccess] No se pudo cargar configuracion guardada:', error);
        });
      }
    } catch (error) {
      console.warn('[ResearchAccess] Error al cargar configuracion:', error);
    }
  }

  function loadRegisteredParticipants() {
    var status = byId(SELECTORS.focusParticipantsStatus);
    if (status) status.textContent = 'Cargando participantes activos...';

    try {
      var doLoad = function () {
        if (window.db && window.collection && window.getDocs) {
          return window.getDocs(window.collection(window.db, 'usuarios'))
            .then(function (snap) {
              loadActiveParticipantsFromSnapshot(snap);
              loadConfigFromFirestore();
            });
        }
        if (window.firebase && typeof window.firebase.firestore === 'function') {
          return window.firebase.firestore().collection('usuarios').get()
            .then(function (snapLegacy) {
              loadActiveParticipantsFromSnapshot(snapLegacy);
              loadConfigFromFirestore();
            });
        }
        throw new Error('No hay API Firestore disponible para leer usuarios.');
      };

      doLoad()['catch'](function (error) {
        console.error('[ResearchAccess] Error cargando participantes:', error);
        if (status) status.textContent = 'No se pudo cargar la lista de participantes. Use la entrada manual de respaldo.';
        loadConfigFromFirestore();
      });
    } catch (error) {
      console.error('[ResearchAccess] Error cargando participantes:', error);
      if (status) status.textContent = 'No se pudo cargar la lista de participantes. Use la entrada manual de respaldo.';
      loadConfigFromFirestore();
    }
  }

  function turnOffAll() {
    var section = byId(SELECTORS.section);
    var consent = byId(SELECTORS.consent);
    var posttest = byId(SELECTORS.posttest);
    var focus = byId(SELECTORS.focus);

    if (section) section.checked = false;
    if (consent) consent.checked = false;
    if (posttest) posttest.checked = false;
    if (focus) focus.checked = false;

    renderPreview();
    setStatus('Accesos apagados. Recuerde guardar la configuracion.', 'warning');
  }

  function restoreLinks() {
    var consentUrl = byId(SELECTORS.urlConsent);
    var posttestUrl = byId(SELECTORS.urlPosttest);
    var focusUrl = byId(SELECTORS.urlFocus);

    if (consentUrl) consentUrl.value = OFFICIAL_LINKS.consent;
    if (posttestUrl) posttestUrl.value = OFFICIAL_LINKS.posttest;
    if (focusUrl) focusUrl.value = OFFICIAL_LINKS.focus;

    renderPreview();
    setStatus('Enlaces oficiales restaurados. Recuerde guardar la configuracion.', 'info');
  }

  async function saveConfig() {
    setStatus('Guardando configuracion...', 'info');

    try {
      var state = getState();
      var saved = await trySaveToFirestore(state);
      if (saved) {
        setStatus('Configuracion guardada correctamente.', 'success');
      } else {
        setStatus('Vista previa funcional. Firestore no esta disponible desde este script.', 'warning');
        console.warn('[ResearchAccess] UI funciona, pero no se encontro API Firestore compatible para guardar.');
      }
    } catch (error) {
      console.error('[ResearchAccess] Error al guardar:', error);
      setStatus('Error al guardar configuracion. Revise consola.', 'error');
      alert('No se pudo guardar la configuracion. Revise la consola.');
    }
  }

  async function trySaveToFirestore(state) {
    var payload = { ...state, updatedAt: new Date().toISOString() };

    if (window.firebase && typeof window.firebase.firestore === 'function') {
      await window.firebase.firestore().collection('researchAccess').doc('config').set(payload, { merge: true });
      return true;
    }
    if (window.db && window.doc && window.setDoc) {
      await window.setDoc(window.doc(window.db, 'researchAccess', 'config'), payload, { merge: true });
      return true;
    }
    return false;
  }

  function bindEvents() {
    var liveIds = [
      SELECTORS.section, SELECTORS.consent, SELECTORS.posttest, SELECTORS.focus,
      SELECTORS.urlConsent, SELECTORS.urlPosttest, SELECTORS.urlFocus,
      SELECTORS.focusAllowedEmails
    ];

    liveIds.forEach(function (id) {
      var el = byId(id);
      if (!el) { console.warn('[ResearchAccess] No se encontro elemento:', id); return; }
      el.addEventListener('change', renderPreview);
      el.addEventListener('input', renderPreview);
    });

    var searchInput = byId(SELECTORS.focusParticipantSearch);
    if (searchInput) searchInput.addEventListener('input', renderFocusParticipantList);

    var manualEmails = byId(SELECTORS.focusAllowedEmails);
    if (manualEmails) {
      manualEmails.addEventListener('change', syncSelectedEmailsFromTextarea);
      manualEmails.addEventListener('blur', syncSelectedEmailsFromTextarea);
    }

    if (byId(SELECTORS.offAll)) byId(SELECTORS.offAll).addEventListener('click', turnOffAll);
    if (byId(SELECTORS.restore)) byId(SELECTORS.restore).addEventListener('click', restoreLinks);
    if (byId(SELECTORS.save)) byId(SELECTORS.save).addEventListener('click', saveConfig);
  }

  function init() {
    console.log('[ResearchAccess] Inicializando control funcional aprobado.');

    var preview = byId(SELECTORS.preview);
    if (!preview) {
      console.error('[ResearchAccess] No se encontro #previewContainer.');
      return;
    }

    setInitialUrlsIfEmpty();
    bindEvents();
    renderPreview();
    renderSelectedParticipants();
    loadRegisteredParticipants();

    setStatus('Control de investigacion listo.', 'success');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

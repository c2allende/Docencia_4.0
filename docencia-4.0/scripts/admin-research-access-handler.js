import { db } from './firebase-config.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

(function () {
  'use strict';

  const OFFICIAL_RESEARCH_LINKS = {
    consentPretest: 'https://forms.gle/TCx5has4pBDRQQQ57',
    posttest: 'https://forms.gle/of3qAs9kYcW4yZS36',
    focusGroupConsent: ''
  };

  const defaultResearchAccessConfig = {
    sectionEnabled: false,
    consentPretest: {
      enabled: false,
      title: 'Consentimiento informado y preprueba',
      badge: 'Sesión inicial',
      url: OFFICIAL_RESEARCH_LINKS.consentPretest,
      buttonLabel: 'Acceder al consentimiento y preprueba'
    },
    posttest: {
      enabled: false,
      title: 'Postprueba',
      badge: 'Cierre del proceso formativo',
      url: OFFICIAL_RESEARCH_LINKS.posttest,
      buttonLabel: 'Acceder a la postprueba'
    },
    focusGroupConsent: {
      enabled: false,
      title: 'Consentimiento para grupo focal',
      badge: 'Solo participantes convocados',
      url: '',
      buttonLabel: 'Acceder al consentimiento del grupo focal'
    }
  };

  let researchAccessConfig = structuredClone(defaultResearchAccessConfig);

  function getElement(id) {
    return document.getElementById(id);
  }

  function setStatus(message, type = 'info') {
    const status = getElement('researchAccessStatus');
    if (!status) return;
    status.textContent = message || '';
    status.dataset.status = type;
  }

  function getFormState() {
    return {
      sectionEnabled: !!getElement('researchSectionEnabled')?.checked,
      consentPretest: {
        ...researchAccessConfig.consentPretest,
        enabled: !!getElement('researchConsentPretestEnabled')?.checked,
        url: getElement('researchConsentPretestUrl')?.value?.trim() || ''
      },
      posttest: {
        ...researchAccessConfig.posttest,
        enabled: !!getElement('researchPosttestEnabled')?.checked,
        url: getElement('researchPosttestUrl')?.value?.trim() || ''
      },
      focusGroupConsent: {
        ...researchAccessConfig.focusGroupConsent,
        enabled: !!getElement('researchFocusGroupEnabled')?.checked,
        url: getElement('researchFocusGroupUrl')?.value?.trim() || ''
      }
    };
  }

  function applyStateToForm(config) {
    getElement('researchSectionEnabled').checked = !!config.sectionEnabled;
    getElement('researchConsentPretestEnabled').checked = !!config.consentPretest?.enabled;
    getElement('researchPosttestEnabled').checked = !!config.posttest?.enabled;
    getElement('researchFocusGroupEnabled').checked = !!config.focusGroupConsent?.enabled;

    getElement('researchConsentPretestUrl').value =
      config.consentPretest?.url || OFFICIAL_RESEARCH_LINKS.consentPretest;

    getElement('researchPosttestUrl').value =
      config.posttest?.url || OFFICIAL_RESEARCH_LINKS.posttest;

    getElement('researchFocusGroupUrl').value =
      config.focusGroupConsent?.url || '';
  }

  function hasAnyActiveInstrument(config) {
    return Boolean(
      config.consentPretest?.enabled ||
      config.posttest?.enabled ||
      config.focusGroupConsent?.enabled
    );
  }

  function createAccessCard(item, fallbackText) {
    const hasUrl = item.url && item.url.trim().length > 0;

    const actionHtml = hasUrl
      ? `<a class="btn btn-primary" href="${item.url}" target="_blank" rel="noopener noreferrer">${item.buttonLabel}</a>`
      : `<button class="btn btn-secondary" type="button" disabled>${fallbackText || 'Documento pendiente'}</button>`;

    return `
      <article class="research-access-preview-card card" style="display: flex; flex-direction: column; padding: 24px; border: 1px solid var(--color-border); border-radius: 12px; background: white; box-shadow: var(--shadow-sm);">
        <div style="margin-bottom: 12px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
            <span class="badge" style="background-color: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: bold; border: 1px solid #a7f3d0;">${item.badge}</span>
        </div>
        <h3 style="font-family: var(--font-family-heading); font-size: 1.15rem; color: var(--color-text-display); margin-top: 0; margin-bottom: 12px;">${item.title}</h3>
        <p style="color: var(--color-text-body); font-size: 0.95rem; margin-bottom: 24px;">${getParticipantDescription(item.title)}</p>
        <div style="margin-top: auto; align-self: flex-start;">${actionHtml}</div>
      </article>
    `;
  }

  function getParticipantDescription(title) {
    if (title.includes('preprueba')) {
      return 'Acceso al formulario que incluye el consentimiento informado y la preprueba. Debe completarse solo después de la orientación presencial del investigador.';
    }

    if (title.includes('Postprueba')) {
      return 'Acceso al instrumento posterior que se habilitará al finalizar los talleres, actividades y foros correspondientes.';
    }

    return 'Acceso destinado únicamente a participantes invitados a la fase cualitativa de grupos focales. Requerirá consentimiento aparte y se habilitará cuando el investigador tenga el documento o enlace final.';
  }

  function renderParticipantPreview() {
    const preview = getElement('researchParticipantPreview');
    if (!preview) return;

    const config = getFormState();

    if (!config.sectionEnabled || !hasAnyActiveInstrument(config)) {
      preview.innerHTML = `
        <div class="research-access-empty-preview" style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 32px; text-align: center; color: #64748b;">
          El bloque de investigación no estará visible para los participantes.
        </div>
      `;
      return;
    }

    const cards = [];

    if (config.consentPretest.enabled) {
      cards.push(createAccessCard(config.consentPretest));
    }

    if (config.posttest.enabled) {
      cards.push(createAccessCard(config.posttest));
    }

    if (config.focusGroupConsent.enabled) {
      cards.push(createAccessCard(config.focusGroupConsent, 'Documento pendiente'));
    }

    preview.innerHTML = `
      <section class="research-access-preview-shell">
        <div class="research-access-header" style="margin-bottom: 24px;">
            <p class="section-kicker" style="color: var(--color-brand-primary); font-weight: bold; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; margin-bottom: 8px;">Investigación</p>
            <h2 style="font-family: var(--font-family-heading); font-size: 1.5rem; color: var(--color-text-display); margin-top: 0;">Participación en la investigación</h2>
            <div style="background-color: var(--color-brand-light, #f0f7ff); border-left: 4px solid var(--color-brand-primary); padding: 12px 16px; margin-top: 16px; border-radius: 4px;">
                <p style="margin: 0; font-size: 0.9rem; color: var(--color-text-display);"><strong>Nota ética:</strong> Complete cada formulario o documento únicamente cuando el investigador lo indique. La participación en la investigación es voluntaria y el LMS no recopila sus respuestas a estos instrumentos.</p>
            </div>
        </div>
        <div class="research-access-preview-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          ${cards.join('')}
        </div>
      </section>
    `;
  }

  function turnOffAll() {
    getElement('researchSectionEnabled').checked = false;
    getElement('researchConsentPretestEnabled').checked = false;
    getElement('researchPosttestEnabled').checked = false;
    getElement('researchFocusGroupEnabled').checked = false;
    renderParticipantPreview();
    setStatus('Accesos apagados. Recuerde guardar la configuración.', 'warning');
  }

  function restoreOfficialLinks() {
    getElement('researchConsentPretestUrl').value = OFFICIAL_RESEARCH_LINKS.consentPretest;
    getElement('researchPosttestUrl').value = OFFICIAL_RESEARCH_LINKS.posttest;
    getElement('researchFocusGroupUrl').value = '';
    renderParticipantPreview();
    setStatus('Enlaces oficiales restaurados. Recuerde guardar la configuración.', 'info');
  }

  async function saveResearchAccessConfig() {
    try {
      setStatus('Guardando configuración...', 'info');

      const configToSave = getFormState();

      if (!db) {
        throw new Error('Firestore no está disponible en db. Verifique firebase-config.js.');
      }

      await saveResearchConfigToFirestore(configToSave);

      researchAccessConfig = structuredClone(configToSave);
      setStatus('Configuración guardada correctamente.', 'success');
    } catch (error) {
      console.error('[ResearchAccess] Error al guardar configuración:', error);
      setStatus(`Error al guardar: ${error.message}`, 'error');
      alert(`No se pudo guardar la configuración: ${error.message}`);
    }
  }

  async function saveResearchConfigToFirestore(configToSave) {
    if (db && setDoc && doc) {
      await setDoc(
        doc(db, 'researchAccess', 'config'),
        {
          ...configToSave,
          updatedAt: serverTimestamp ? serverTimestamp() : new Date().toISOString()
        },
        { merge: true }
      );
      return;
    }

    throw new Error('No se encontró una API Firestore compatible.');
  }

  async function loadResearchAccessConfig() {
    try {
      setStatus('Cargando configuración...', 'info');

      const loadedConfig = await loadResearchConfigFromFirestore();

      researchAccessConfig = {
        ...defaultResearchAccessConfig,
        ...loadedConfig,
        consentPretest: {
          ...defaultResearchAccessConfig.consentPretest,
          ...(loadedConfig?.consentPretest || {})
        },
        posttest: {
          ...defaultResearchAccessConfig.posttest,
          ...(loadedConfig?.posttest || {})
        },
        focusGroupConsent: {
          ...defaultResearchAccessConfig.focusGroupConsent,
          ...(loadedConfig?.focusGroupConsent || {})
        }
      };

      applyStateToForm(researchAccessConfig);
      renderParticipantPreview();
      setStatus('Configuración cargada.', 'success');
    } catch (error) {
      console.error('[ResearchAccess] Error al cargar configuración:', error);

      applyStateToForm(defaultResearchAccessConfig);
      renderParticipantPreview();

      setStatus('No se pudo cargar Firestore. Se muestra configuración segura por defecto.', 'warning');
    }
  }

  async function loadResearchConfigFromFirestore() {
    if (db && getDoc && doc) {
      const snap = await getDoc(doc(db, 'researchAccess', 'config'));
      return snap.exists() ? snap.data() : null;
    }

    return null;
  }

  function bindResearchAccessEvents() {
    const ids = [
      'researchSectionEnabled',
      'researchConsentPretestEnabled',
      'researchPosttestEnabled',
      'researchFocusGroupEnabled',
      'researchConsentPretestUrl',
      'researchPosttestUrl',
      'researchFocusGroupUrl'
    ];

    ids.forEach((id) => {
      const element = getElement(id);
      if (!element) {
        console.warn(`[ResearchAccess] No se encontró #${id}`);
        return;
      }

      element.addEventListener('input', renderParticipantPreview);
      element.addEventListener('change', renderParticipantPreview);
    });

    getElement('researchTurnOffAllBtn')?.addEventListener('click', turnOffAll);
    getElement('researchRestoreLinksBtn')?.addEventListener('click', restoreOfficialLinks);
    getElement('researchSaveConfigBtn')?.addEventListener('click', saveResearchAccessConfig);
  }

  function initResearchAccessAdmin() {
    const panel = getElement('researchAccessAdminPanel');
    const preview = getElement('researchParticipantPreview');

    if (!panel || !preview) {
      console.warn('[ResearchAccess] Panel o vista previa no encontrados. No se inicializa.');
      return;
    }

    bindResearchAccessEvents();
    applyStateToForm(defaultResearchAccessConfig);
    renderParticipantPreview();
    loadResearchAccessConfig();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResearchAccessAdmin, { once: true });
  } else {
    initResearchAccessAdmin();
  }
})();

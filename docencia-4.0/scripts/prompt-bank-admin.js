(function () {
  'use strict';

  var prompts = [
    {
      id: 'comunicacion-padres',
      category: 'Comunicaci\u00F3n Institucional',
      title: 'Comunicaci\u00F3n con Padres',
      description: 'Redacta cartas formales pero c\u00E1lidas para fortalecer el v\u00EDnculo escuela-familia con empat\u00EDa y profesionalismo.',
      prompt: 'Prompt: Comunicaci\u00F3n con Padres\n### [Rol y Contexto]\nAct\u00FAa como un docente de [Grado/Nivel] con excepcionales habilidades de comunicaci\u00F3n asertiva, empat\u00EDa y profesionalismo acad\u00E9mico. Tu objetivo es fortalecer el v\u00EDnculo entre la escuela y la familia a trav\u00E9s de una comunicaci\u00F3n efectiva.\n\n### [Contexto del Estudiante]\n- **Estudiante:** [Iniciales del Estudiante]\n- **Asunto principal:** [Insertar asunto: ej. Desempe\u00F1o acad\u00E9mico, conducta positiva, organizaci\u00F3n de excursi\u00F3n, etc.]\n- **Detalles adicionales (opcional):** [Insertar cualquier dato espec\u00EDfico que deba mencionarse]\n\n### [Tarea]\nRedacta una carta formal pero c\u00E1lida dirigida a los padres o tutores legales. La carta debe sonar humana y cercana, evitando la frialdad administrativa, pero manteniendo el respeto institucional.\n\n### [Restricciones y Reglas]\n1. **Tono:** Constructivo, alentador y centrado en soluciones (si es un tema de mejora) o en el reconocimiento (si es un tema positivo).\n2. **Lenguaje:** Evita tecnicismos pedag\u00F3gicos complejos; usa un lenguaje claro y accesible para todas las familias.\n3. **Longitud:** M\u00E1ximo 250 palabras.\n4. **Empat\u00EDa:** Aseg\u00FArate de validar el esfuerzo del estudiante o la importancia de la colaboraci\u00F3n familiar.\n\n### [Formato de Salida]\n1. **Encabezado y Saludo:** Saludo formal personalizado.\n2. **Introducci\u00F3n:** Expresar claramente el prop\u00F3sito de la carta en las primeras dos oraciones.\n3. **Cuerpo (2-3 puntos):** Desarrollar la idea central con ejemplos espec\u00EDficos o datos relevantes.\n4. **Llamado a la Acci\u00F3n (CTA):** Invitaci\u00F3n clara a una reuni\u00F3n, a responder el mensaje o a colaborar en una tarea espec\u00EDfica.\n5. **Cierre y Firma:** Despedida cordial y espacio para la firma del docente.'
    },
    {
      id: 'referencia-academica',
      category: 'Recomendaci\u00F3n Acad\u00E9mica',
      title: 'Referencia Acad\u00E9mica',
      description: 'Genera cartas de recomendaci\u00F3n acad\u00E9mica profesionales y persuasivas para postulaciones estudiantiles.',
      prompt: 'Prompt: Referencia Acad\u00E9mica\n### [Rol]\nAct\u00FAa como un maestro(a) especializado(a) en [Materia]. Tu tono debe ser acad\u00E9mico, profesional, honesto y altamente persuasivo, utilizando un lenguaje que demuestre un conocimiento genuino del estudiante.\n\n### [Contexto y Datos Clave]\n- **Estudiante:** [Iniciales del Estudiante]\n- **Programa al que postula:** [Universidad/Beca/Programa]\n- **Relaci\u00F3n acad\u00E9mica:** Profesor de la asignatura [Materia] durante [Tiempo: ej. dos semestres/un a\u00F1o].\n- **Fortalezas a destacar:** [Mencionar 2-3 fortalezas espec\u00EDficas: ej. pensamiento cr\u00EDtico, iniciativa, madurez].\n- **Logro destacado (opcional):** [Breve descripci\u00F3n de un proyecto o nota sobresaliente].\n\n### [Instrucciones de Calidad]\n1. **Evita Clich\u00E9s:** No uses frases vac\u00EDas como "es un excelente estudiante" sin respaldarlas con una observaci\u00F3n.\n2. **Nivel de Detalle:** Si no se proporciona un ejemplo espec\u00EDfico en los datos clave, redacta un espacio entre corchetes para que el usuario lo complete o crea un ejemplo plausible basado en la [Materia].\n3. **Extensi\u00F3n:** La carta debe tener entre 400 y 500 palabras aproximadamente.\n\n### [Estructura Requerida]\n- **P\u00E1rrafo 1 (Introducci\u00F3n):** Presentaci\u00F3n del docente, relaci\u00F3n con el estudiante y el prop\u00F3sito de la recomendaci\u00F3n con una declaraci\u00F3n enf\u00E1tica de apoyo.\n- **P\u00E1rrafo 2 (Capacidad Intelectual):** An\u00E1lisis del desempe\u00F1o acad\u00E9mico, curiosidad y habilidades t\u00E9cnicas/cognitivas espec\u00EDficas en la materia.\n- **P\u00E1rrafo 3 (Evidencia Pr\u00E1ctica):** Relato detallado de una situaci\u00F3n, proyecto o debate donde el estudiante demostr\u00F3 las fortalezas mencionadas.\n- **P\u00E1rrafo 4 (Perfil Socioemocional):** Comentario sobre su \u00E9tica de trabajo, liderazgo, colaboraci\u00F3n con compa\u00F1eros y car\u00E1cter personal.\n- **P\u00E1rrafo 5 (Conclusi\u00F3n):** Resumen del potencial del estudiante para el programa y una invitaci\u00F3n abierta a ser contactado para m\u00E1s informaci\u00F3n.'
    },
    {
      id: 'generador-minutas',
      category: 'Documentaci\u00F3n Administrativa',
      title: 'Generador de Minutas Escolares',
      description: 'Transforma apuntes informales o transcripciones en minutas profesionales listas para archivo institucional.',
      prompt: 'Prompt: Generador de Minutas Escolares\n### [Rol]\nAct\u00FAa como un Secretario Administrativo Escolar de alta precisi\u00F3n, especializado en redacci\u00F3n institucional y s\u00EDntesis de informaci\u00F3n. Tu objetivo es transformar apuntes informales o transcripciones en documentos oficiales listos para archivo.\n\n### [Tarea]\nA partir de las "Notas de la Reuni\u00F3n" proporcionadas, genera una minuta profesional. Debes priorizar la objetividad y la claridad, asegur\u00E1ndote de que cualquier persona que no asisti\u00F3 pueda entender las decisiones tomadas.\n\n### [Instrucciones de Procesamiento]\n1. **S\u00EDntesis Inteligente:** Agrupa puntos relacionados bajo temas coherentes, incluso si se discutieron en momentos diferentes de la reuni\u00F3n.\n2. **Gesti\u00F3n de Vac\u00EDos:** Si en las notas no se menciona un responsable o una fecha l\u00EDmite para una acci\u00F3n, coloca "[PENDIENTE DE ASIGNAR]" en lugar de inventar el dato.\n3. **Tono:** Formal, neutro y en tercera persona.\n\n### [Notas de la Reuni\u00F3n]\n[Pegar aqu\u00ED las notas o la transcripci\u00F3n]\n\n### [Formato de Salida (Markdown)]\n# Minuta de Reuni\u00F3n: [Insertar T\u00EDtulo Basado en el Contenido]\n\n**Fecha:** [Extraer de notas o insertar marcador]  \n**Asistentes:** [Lista de nombres encontrados]\n\n## 1. Resumen Ejecutivo\nBreve p\u00E1rrafo (3-4 l\u00EDneas) sobre el prop\u00F3sito principal y el clima de la sesi\u00F3n.\n\n## 2. Puntos Tratados\n- [Tema A]: Descripci\u00F3n sint\u00E9tica.\n- [Tema B]: Descripci\u00F3n sint\u00E9tica.\n\n## 3. Acuerdos Alcanzados\n- [ ] Acuerdo 1: Detalle de la decisi\u00F3n.\n- [ ] Acuerdo 2: Detalle de la decisi\u00F3n.\n\n## 4. Tabla de Compromisos y Acciones\n| Acci\u00F3n | Responsable | Fecha L\u00EDmite |\n| :--- | :--- | :--- |\n| [Tarea] | [Nombre] | [D\u00EDa/Mes] |\n\n---\n*Fin del documento*'
    }
  ];

  var categories = [
    'Comunicaci\u00F3n Institucional',
    'Recomendaci\u00F3n Acad\u00E9mica',
    'Documentaci\u00F3n Administrativa'
  ];

  function init() {
    var grid = document.querySelector('[data-prompt-grid-admin]');
    var searchInput = document.querySelector('[data-prompt-search-admin]');
    var filterContainer = document.querySelector('[data-prompt-filters-admin]');
    var statusEl = document.querySelector('[data-prompt-status-admin]');

    if (!grid) return;

    renderFilters(filterContainer);
    renderCards(grid, prompts, searchInput ? searchInput.value.toLowerCase() : '', 'all');

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        renderCards(grid, prompts, searchInput.value.toLowerCase(), getActiveFilter(filterContainer));
      });
    }

    if (filterContainer) {
      filterContainer.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-filter]');
        if (!btn) return;
        filterContainer.querySelectorAll('[data-filter]').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        renderCards(grid, prompts, searchInput ? searchInput.value.toLowerCase() : '', btn.getAttribute('data-filter'));
      });
    }
  }

  function renderFilters(container) {
    if (!container) return;
    var html = '<button type="button" class="prompt-bank__filter is-active" data-filter="all">Todas</button>';
    categories.forEach(function (cat) {
      html += '<button type="button" class="prompt-bank__filter" data-filter="' + cat + '">' + cat + '</button>';
    });
    container.innerHTML = html;
  }

  function getActiveFilter(container) {
    if (!container) return 'all';
    var active = container.querySelector('[data-filter].is-active');
    return active ? active.getAttribute('data-filter') : 'all';
  }

  function renderCards(grid, data, query, filter) {
    var filtered = data.filter(function (p) {
      var matchFilter = filter === 'all' || p.category === filter;
      var matchSearch = !query ||
        p.title.toLowerCase().indexOf(query) !== -1 ||
        p.category.toLowerCase().indexOf(query) !== -1 ||
        p.description.toLowerCase().indexOf(query) !== -1 ||
        p.prompt.toLowerCase().indexOf(query) !== -1;
      return matchFilter && matchSearch;
    });

    var statusEl = document.querySelector('[data-prompt-status-admin]');
    if (filtered.length === 0) {
      if (grid) grid.innerHTML = '<p class="prompt-bank__empty">No se encontraron plantillas con esos criterios.</p>';
      if (statusEl) statusEl.textContent = '';
      return;
    }

    if (statusEl) statusEl.textContent = '';

    var html = '';
    filtered.forEach(function (p) {
      html +=
        '<article class="prompt-card" data-category="' + p.category + '">' +
          '<div class="prompt-card__header">' +
            '<span class="badge badge-info prompt-card__tag">' + p.category + '</span>' +
            '<h3 class="prompt-card__title">' + p.title + '</h3>' +
          '</div>' +
          '<p class="prompt-card__description">' + p.description + '</p>' +
          '<details class="prompt-card__details" data-prompt-details-admin>' +
            '<summary class="prompt-card__summary" tabindex="0">Ver plantilla completa</summary>' +
            '<div class="prompt-card__reader">' +
              '<div class="prompt-card__prompt">' + escapeHtml(p.prompt) + '</div>' +
              '<div class="prompt-card__reader-actions">' +
                '<button type="button" class="btn btn-primary prompt-card__copy" data-copy-admin="' + p.id + '">Copiar plantilla</button>' +
                '<button type="button" class="btn btn-tertiary prompt-card__close" data-close-admin="' + p.id + '">Cerrar plantilla</button>' +
              '</div>' +
            '</div>' +
          '</details>' +
        '</article>';
    });
    grid.innerHTML = html;

    // Single open + .is-expanded toggle
    grid.querySelectorAll('[data-prompt-details-admin]').forEach(function (det) {
      det.addEventListener('toggle', function () {
        var card = det.closest('.prompt-card');
        if (det.open) {
          grid.querySelectorAll('[data-prompt-details-admin]').forEach(function (other) {
            if (other !== det) {
              other.removeAttribute('open');
              var otherCard = other.closest('.prompt-card');
              if (otherCard) otherCard.classList.remove('is-expanded');
            }
          });
          if (card) card.classList.add('is-expanded');
        } else {
          if (card) card.classList.remove('is-expanded');
        }
      });
    });

    // Copy buttons
    grid.querySelectorAll('[data-copy-admin]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-copy-admin');
        var promptObj = null;
        for (var i = 0; i < data.length; i++) {
          if (data[i].id === id) { promptObj = data[i]; break; }
        }
        if (!promptObj) return;
        copyPrompt(promptObj.prompt, btn);
      });
    });

    // Close buttons
    grid.querySelectorAll('[data-close-admin]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-close-admin');
        var card = btn.closest('.prompt-card');
        var details = card ? card.querySelector('[data-prompt-details-admin]') : null;
        if (details) {
          var summary = details.querySelector('.prompt-card__summary');
          details.removeAttribute('open');
          if (card) card.classList.remove('is-expanded');
          if (summary) summary.focus();
        }
      });
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function copyPrompt(text, btn) {
    if (!navigator.clipboard) {
      fallbackCopy(text, btn);
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      showCopiedFeedback(btn);
    }, function () {
      fallbackCopy(text, btn);
    });
  }

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showCopiedFeedback(btn);
    } catch (e) {
      showCopiedFeedback(btn, true);
    }
    document.body.removeChild(ta);
  }

  function showCopiedFeedback(btn, failed) {
    var statusEl = document.querySelector('[data-prompt-status-admin]');
    if (statusEl) {
      statusEl.textContent = failed ? 'No se pudo copiar autom\u00E1ticamente. Selecciona el texto manualmente.' : 'Plantilla copiada al portapapeles.';
      setTimeout(function () {
        if (statusEl) statusEl.textContent = '';
      }, 3000);
    }
    if (!failed) {
      var orig = btn.textContent;
      btn.textContent = '\u2713 Copiado';
      btn.disabled = true;
      setTimeout(function () {
        var card = btn.closest('.prompt-card');
        var details = card ? card.querySelector('[data-prompt-details-admin]') : null;
        if (details) {
          details.removeAttribute('open');
          if (card) card.classList.remove('is-expanded');
          var summary = details.querySelector('.prompt-card__summary');
          if (summary) summary.focus();
        }
        btn.textContent = orig;
        btn.disabled = false;
      }, 800);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

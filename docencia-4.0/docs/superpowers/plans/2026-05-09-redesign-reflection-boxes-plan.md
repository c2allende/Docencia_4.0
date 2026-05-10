# Rediseño de Cajas Reflexivas Implementation Plan (v3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear un prototipo visual comparativo (`reflection_box_alternatives_prototype.html`) con 4 variantes de diseño, asegurando accesibilidad y métricas de altura detalladas.

**Architecture:** Archivo HTML único con carga de `main.css`. Inyecta contenido de Módulos 1, 2 y 3 y calcula alturas comparativas.

**Tech Stack:** HTML5, CSS3, JavaScript.

---

### Task 1: Estructura, Dashboard y Estilos (v3)

**Files:**
- Create: `docencia-4.0/reflection_box_alternatives_prototype.html`

- [ ] **Step 1: Crear el esqueleto HTML y el Dashboard de Medición**
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prototipo: Rediseño Cajas Reflexivas - Docencia 4.0</title>
    <link rel="stylesheet" href="styles/main.css">
    <style>
        body { background: var(--color-background-page); padding: var(--spacing-md); font-family: var(--font-family-body); }
        .proto-header { 
            position: sticky; top: 0; background: var(--color-background-surface);
            padding: var(--spacing-md); border-bottom: var(--border-width-1) solid var(--color-border-default);
            z-index: 100; margin-bottom: var(--spacing-lg); border-radius: var(--radius-md);
            box-shadow: var(--shadow-md);
        }
        .proto-controls { display: flex; gap: var(--spacing-md); align-items: center; flex-wrap: wrap; }
        .global-height-report { margin-left: auto; color: var(--color-brand-primary); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); }
        .proto-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: var(--spacing-lg); }
        .proto-card { background: var(--color-background-surface); padding: var(--spacing-md); border-radius: var(--radius-lg); border: 1px solid var(--color-border-default); display: flex; flex-direction: column; }
        .proto-label { font-weight: bold; font-size: var(--font-size-xs); color: var(--color-text-muted); text-transform: uppercase; margin-bottom: var(--spacing-sm); display: block; }
        .height-report { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: auto; padding-top: var(--spacing-sm); border-top: 1px dashed var(--color-border-default); }

        /* Clases utilitarias */
        .u-text-white { color: var(--color-white); }
        .u-opacity-90 { opacity: 0.9; }
        .u-mb-sm { margin-bottom: var(--spacing-sm); }
        .u-mb-md { margin-bottom: var(--spacing-md); }
        .u-mt-md { margin-top: var(--spacing-md); }
        .u-italic { font-style: italic; }
        .u-bold { font-weight: var(--font-weight-bold); }
        .u-small { font-size: var(--font-size-sm); }
    </style>
</head>
<body>
    <header class="proto-header">
        <div class="proto-controls">
            <strong>Módulo:</strong>
            <select id="moduleSelect">
                <option value="m1">Módulo 1</option>
                <option value="m2">Módulo 2</option>
                <option value="m3">Módulo 3</option>
            </select>
            <div id="globalHeightReport" class="global-height-report"></div>
        </div>
    </header>
    <div class="proto-grid" id="mainGrid"></div>
    <script>
        const contentData = {
            m1: { title: "Pregunta reflexiva para iniciar", intro: "Antes de profundizar en los contenidos, reflexionen por un momento:", question: "“¿Qué tarea de mi gestión docente me toma más tiempo cada semana? ¿Podría un recurso como un LLM o una aplicación basada en LLM ayudarme a hacerla mejor o más rápido, sin sacrificar calidad o creatividad pedagógica?”", note: "No hay respuesta \"correcta\"; la intención es que vean de inmediato la pertinencia práctica de lo que van a aprender." },
            m2: { title: "Pregunta reflexiva para iniciar", intro: "Antes de entrar en los contenidos técnicos, tómese un momento para pensar y, si lo desea, anotar en su cuaderno de trabajo:", question: "“Si pudiera automatizar solo UNA parte de mi proceso de planificación (por ejemplo: escribir objetivos, diseñar actividades de inicio, nivelar lecturas, crear rúbricas), ¿cuál elegiría y por qué? ¿Qué esperaría de un bot o aplicación basada en LLM para que ese apoyo realmente respete mi criterio profesional y el contexto de mi escuela?”", note: "No hay respuestas “correctas”; esta reflexión busca que conecte de inmediato la ingeniería de prompts y el diseño con IA con las tareas concretas que más tiempo y energía le consumen en su práctica docente diaria." },
            m3: { title: "Reflexión Inicial", intro: "Antes de entrar en las actividades del módulo, tómese un momento para pensar y, si lo desea, anotar en su cuaderno de trabajo:", question: "“Si pudiera automatizar solo UNA parte de mi carga evaluativa o administrativa (por ejemplo: redactar comentarios en las notas, crear rúbricas, escribir cartas a familias, preparar informes de progreso), ¿cuál elegiría y por qué? ¿Qué necesitaría que hiciera un bot o aplicación basada en LLM para que ese apoyo respete mi criterio profesional, la confidencialidad de mis estudiantes y las normas de mi escuela?”", note: "No hay respuestas correctas o incorrectas; esta reflexión busca que conecte de inmediato los contenidos del módulo con las tareas administrativas y evaluativas que más tiempo y energía le consumen, y que visualice cómo la IA puede convertirse en un apoyo estratégico bajo su propio liderazgo profesional." }
        };

        const moduleSelect = document.getElementById('moduleSelect');
        moduleSelect.addEventListener('change', () => renderAlternatives(contentData[moduleSelect.value]));

        function renderAlternatives(data) {
            const grid = document.getElementById('mainGrid');
            grid.innerHTML = '';
            const alts = [
                { id: '0', label: 'Alt 0: Diseño Actual', render: renderAlt0 },
                { id: 'A', label: 'Alt A: Tarjeta Compacta', render: renderAltA },
                { id: 'B', label: 'Alt B: Doble Columna', render: renderAltB },
                { id: 'C', label: 'Alt C: Acordeón Parcial', render: renderAltC }
            ];
            alts.forEach(alt => {
                const section = document.createElement('section');
                section.className = 'proto-card';
                section.id = `card-alt${alt.id}`;
                section.innerHTML = `<span class="proto-label">${alt.label}</span><div class="render-area"></div><div class="height-report"></div>`;
                grid.appendChild(section);
                alt.render(section.querySelector('.render-area'), data);
            });
            setTimeout(measureHeights, 200);
        }
    </script>
</body>
</html>
```

### Task 2: Implementación de Alternativas (v3)

- [ ] **Step 1: Implementar Alt 0, A y B con clases de utilidad**
    - (Similar al Plan v2 pero usando las clases `u-*` y verificando tokens).

- [ ] **Step 2: Implementar Alt C con accesibilidad reforzada y medición dual**
```javascript
function renderAltC(container, data) {
    const instanceId = `acc-content-${Math.random().toString(36).substr(2, 9)}`;
    container.innerHTML = `
        <div class="altC-box">
            <div class="altC-header">
                <span class="altC-title-label">${data.title}</span>
                <p class="altC-question-text">${data.question}</p>
            </div>
            <button class="altC-trigger js-accordion-trigger" 
                    aria-expanded="false" 
                    aria-controls="${instanceId}"
                    aria-label="Ver orientación completa de la reflexión inicial">
                <span>Ver orientación completa</span>
                <span class="trigger-icon" aria-hidden="true">↓</span>
            </button>
            <div id="${instanceId}" class="altC-content-wrapper" role="region">
                <div class="altC-inner-padding">
                    <p class="u-mb-sm"><span class="u-bold">Guía:</span> ${data.intro}</p>
                    <p class="u-small u-italic">${data.note}</p>
                </div>
            </div>
        </div>
    `;
    const trigger = container.querySelector('.js-accordion-trigger');
    const content = container.querySelector('.altC-content-wrapper');
    const icon = container.querySelector('.trigger-icon');

    trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        const nextState = !isExpanded;
        trigger.setAttribute('aria-expanded', nextState);
        content.style.maxHeight = nextState ? `${content.scrollHeight}px` : '0';
        icon.innerText = nextState ? '↑' : '↓';
        trigger.querySelector('span').innerText = nextState ? 'Ocultar orientación' : 'Ver orientación completa';
        setTimeout(measureHeights, 300);
    });
}
```

### Task 3: Lógica de Medición de Altura Dual (v3)

- [ ] **Step 1: Implementar `measureHeights` que reporte C Cerrada y C Expandida**
```javascript
function measureHeights() {
    const globalReport = document.getElementById('globalHeightReport');
    const h0 = document.querySelector('#card-alt0 .render-area').offsetHeight;
    const hA = document.querySelector('#card-altA .render-area').offsetHeight;
    const hB = document.querySelector('#card-altB .render-area').offsetHeight;
    
    // Para C:
    const cardC = document.querySelector('#card-altC .render-area');
    const headerC = cardC.querySelector('.altC-header').offsetHeight;
    const triggerC = cardC.querySelector('.altC-trigger').offsetHeight;
    const contentC = cardC.querySelector('.altC-content-wrapper');
    
    const hC_closed = headerC + triggerC;
    const hC_expanded = hC_closed + contentC.scrollHeight;

    document.querySelector('#card-alt0 .height-report').innerText = `Altura: ${h0}px`;
    document.querySelector('#card-altA .height-report').innerText = `Altura: ${hA}px`;
    document.querySelector('#card-altB .height-report').innerText = `Altura: ${hB}px`;
    document.querySelector('#card-altC .height-report').innerText = `C Cerrada: ${hC_closed}px | C Expandida: ${hC_expanded}px`;

    globalReport.innerText = `Comparativa: 0:${h0}px | A:${hA}px | B:${hB}px | C(C):${hC_closed}px | C(E):${hC_expanded}px`;
}
```

- [ ] **Step 2: Inicializar**
```javascript
renderAlternatives(contentData.m1);
```

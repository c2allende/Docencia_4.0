const fs = require('fs');
const css = `
/* =========================================================
   DOCENCIA 4.0 — COMPONENTES REUTILIZABLES LMS
   Centralización de patrones repetidos de lecciones,
   actividades, foros, introducciones y recursos.
   ========================================================= */

/* 1. Lecciones */
.lesson-summary-card,
.lesson-objective-card,
.lesson-progressive-card,
.lesson-remember,
.lesson-role-connection,
.lesson-toolbox,
.lesson-media-card,
.concept-review,
.checkpoint-card,
.references-section {
  background: var(--color-background-surface);
  border: var(--border-width-1) solid var(--color-border-default);
  border-radius: var(--radius-xl);
  padding: clamp(1.25rem, 3vw, 2rem);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-flat);
}

.lesson-objective-card h2,
.lesson-objective-card h3 {
  color: var(--color-brand-primary);
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-extrabold);
  margin-bottom: var(--spacing-sm);
}

.lesson-progressive-summary {
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-text-display);
}

.lesson-progressive-content {
  margin-top: var(--spacing-md);
  color: var(--color-text-secondary);
}

.lesson-remember-item {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-secondary);
}

.lesson-toolbox {
  background: var(--color-background-subtle);
  border-left: var(--border-width-4) solid var(--color-brand-secondary);
}

.lesson-toolbox-summary {
  font-family: var(--font-family-code);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-display);
}

.lesson-meta-achieved {
  text-align: center;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-bold);
}

.checkpoint-iframe {
  width: 100%;
  border-radius: var(--radius-md);
  border: none;
}

.completion-section-wrap {
  margin-top: var(--spacing-2xl);
  text-align: center;
}

/* 2. Introducciones de módulo */
.module-intro-hero {
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-md);
}

.module-intro-title {
  color: var(--color-brand-primary);
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-extrabold);
}

.module-key-message {
  font-family: var(--font-family-heading);
  color: var(--color-text-display);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-extrabold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-lg);
}

.module-reflection-card,
.module-route-card,
.module-objective-card,
.module-outcomes-card,
.module-research-connection,
.module-role-transfer,
.module-audio-card,
.module-closing-card {
  background: var(--color-background-surface);
  border: var(--border-width-1) solid var(--color-border-default);
  border-radius: var(--radius-xl);
  padding: clamp(1.25rem, 3vw, 2rem);
  margin-bottom: var(--spacing-lg);
}

.module-learning-route {
  margin-top: var(--spacing-lg);
}

/* 3. Actividades */
.activity-summary-card,
.activity-purpose-card,
.activity-objective-card,
.activity-phase-card,
.activity-tab-card,
.activity-evidence-card,
.activity-ethics-card {
  background: var(--color-background-surface);
  border: var(--border-width-1) solid var(--color-border-default);
  border-radius: var(--radius-xl);
  padding: clamp(1.25rem, 3vw, 2rem);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-ambient);
}

.activity-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.activity-steps,
.padlet-steps-list {
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
}

.padlet-step-item {
  margin-bottom: var(--spacing-sm);
}

.padlet-cta {
  display: inline-block;
  background: var(--color-brand-secondary);
  color: var(--color-background-base);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-full);
  text-decoration: none;
  font-weight: var(--font-weight-bold);
  transition: opacity 0.2s ease;
}

.padlet-cta:hover {
  opacity: 0.9;
}

/* 4. Foros */
.forum-shell {
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.forum-intro-card,
.forum-purpose-card,
.forum-participation-card,
.forum-reminder-card,
.forum-dynamic-section {
  background: var(--color-background-surface);
  border: var(--border-width-1) solid var(--color-border-default);
  border-radius: var(--radius-xl);
  padding: clamp(1.25rem, 3vw, 2rem);
  margin-bottom: var(--spacing-lg);
}

.forum-alert {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.forum-alert-warning {
  background-color: var(--color-feedback-warning-container);
  border-left: var(--border-width-4) solid var(--color-feedback-warning);
  color: var(--color-text-display);
}

.forum-guide-question {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  color: var(--color-brand-primary);
  font-weight: var(--font-weight-extrabold);
  margin-bottom: var(--spacing-sm);
}

/* 5. Recursos */
.resource-bank-shell {
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.resource-summary-card,
.resource-guidance-card,
.resource-section-card,
.resource-video-card,
.resource-infographic-card,
.professional-kit-card,
.commitment-card {
  background: var(--color-background-surface);
  border: var(--border-width-1) solid var(--color-border-default);
  border-radius: var(--radius-xl);
  padding: clamp(1.25rem, 3vw, 2rem);
  margin-bottom: var(--spacing-lg);
}

.resource-index {
  background: var(--color-background-subtle);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.bibliographic-resources {
  margin-top: var(--spacing-xl);
}

.bibliographic-resource {
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
  border-bottom: var(--border-width-1) solid var(--color-border-subtle);
  padding-bottom: var(--spacing-sm);
}

.professional-kit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}
`;
fs.appendFileSync('c:/Users/Carmelo Allende/.antigravity/Docencia_4.0/docencia-4.0/styles/main.css', '\n' + css + '\n');
console.log('Appended to main.css successfully');

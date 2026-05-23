const fs = require("fs");
let html = fs.readFileSync("docencia-4.0/leccion3_4_maincss_migration_prototype.html", "utf8");

// 1. Remove .lesson-summary-card from comma separated list
html = html.replace(/\s*\.lesson-summary-card,/, "");

// 2. Remove standalone .lesson-summary-card block
html = html.replace(/\s*\.lesson-summary-card\s*\{[^}]+\}/, "");

// 3. Remove .role-compact-card container block
html = html.replace(/\s*\.role-compact-card\s*\{\s*margin: var\(--spacing-lg\) 0;\s*padding: var\(--spacing-lg\);\s*border: var\(--border-width-1\) solid var\(--color-border-default\);\s*border-radius: var\(--radius-xl\);\s*background: var\(--color-background-surface\);\s*box-shadow: var\(--shadow-flat\);\s*\}/, "");

// 4. Remove .lesson-progressive-card__title block
html = html.replace(/\s*\.lesson-progressive-card__title\s*\{[^}]+\}/, "");

// 5. Remove .lesson-progressive-card__hint block
html = html.replace(/\s*\.lesson-progressive-card__hint\s*\{[^}]+\}/, "");

// 6. Remove .remember-panel block
html = html.replace(/\s*\.remember-panel\s*\{[^}]+\}/, "");

// 7. Simplify .completion-card block
html = html.replace(/\.completion-card\s*\{([^}]+)\}/, (match, inner) => {
    return `.completion-card {\n            position: relative;\n            margin-top: var(--spacing-16);\n        }`;
});

// 8. Remove .references-section block
html = html.replace(/\s*\.references-section\s*\{[^}]+\}/g, "");

// HTML Replacements

// Role connection card
html = html.replace(/class="role-compact-card"/, `class="role-compact-card lesson-progressive-card lesson-role-connection"`);
html = html.replace(/class="lesson-progressive-card__title"/, `class="lesson-progressive-summary"`);
html = html.replace(/class="lesson-progressive-card__hint"/, `class="lesson-progressive-content"`);

// Remember panel
html = html.replace(/class="remember-panel"/, `class="lesson-remember remember-panel"`);
html = html.replace(/class="remember-text"/g, `class="lesson-remember-item remember-text"`);

// Completion card
html = html.replace(/class="completion-card"/, `class="completion-card checkpoint-card"`);

// References section
html = html.replace(/<section class="text-section" aria-labelledby="referencias-title">/, `<section class="text-section references-section" aria-labelledby="referencias-title">`);

// Remove padding, border-radius from media queries that apply to deleted classes
html = html.replace(/\.lesson-card,\s*\.ethics-shield-component,\s*\.completion-card,\s*\.references-section,\s*\.remember-panel\s*\{([^}]+)\}/g, `.lesson-card,\n            .ethics-shield-component {\n$1}`);

html = html.replace(/\.lesson-card,\s*\.ethics-shield-component,\s*\.completion-card,\s*\.references-section,\s*\.ethics-panel,\s*\.comp-card,\s*\.protocol-step,\s*\.pii-card,\s*\.remember-panel\s*\{([^}]+)\}/g, `.lesson-card,\n            .ethics-shield-component,\n            .ethics-panel,\n            .comp-card,\n            .protocol-step,\n            .pii-card {\n$1}`);

fs.writeFileSync("docencia-4.0/leccion3_4_maincss_migration_prototype.html", html);
console.log("Refactoring done.");


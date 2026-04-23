/*
 * Docencia 4.0 — Design System Tokens
 * Source: docencia-4.0/styles/main.css + Aura Docencia.png design reference
 * Fonts: Plus Jakarta Sans (display), Manrope (body) — served via Google Fonts
 */

/* ─── Google Fonts Import ─────────────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

:root {

  /* ─── BRAND COLOR PALETTE ─────────────────────────────────────────────── */

  /* Primary — Teal Blue (#006688 base / #00C2FF light) */
  --color-primary-900: #001e2b;
  --color-primary-800: #003a55;
  --color-primary-700: #004c66;
  --color-primary-600: #005580;
  --color-primary-500: #006688;   /* base primary */
  --color-primary-400: #0080aa;
  --color-primary-300: #00a1cc;
  --color-primary-200: #00c2ff;   /* primary-container */
  --color-primary-100: #b3ecff;
  --color-primary-50:  #e6f9ff;

  /* Secondary — Salmon/Orange (#9d4318 base / #FF8D5C light) */
  --color-secondary-900: #3a1400;
  --color-secondary-800: #5c2200;
  --color-secondary-700: #722700;
  --color-secondary-600: #8a3210;
  --color-secondary-500: #9d4318;  /* base secondary */
  --color-secondary-400: #c05a28;
  --color-secondary-300: #e07040;
  --color-secondary-200: #ff8c5b;  /* secondary-container / main CTA */
  --color-secondary-100: #ffcab0;
  --color-secondary-50:  #fff0ea;

  /* Tertiary — Amber (#FF9E2A) */
  --color-tertiary-500: #e08000;
  --color-tertiary-400: #ff9e2a;   /* tertiary accent */
  --color-tertiary-300: #ffbc70;
  --color-tertiary-200: #ffd9a8;
  --color-tertiary-100: #fff0d8;

  /* Neutral — Dark Navy (#0A192F) */
  --color-neutral-900: #0a192f;
  --color-neutral-800: #171c1f;    /* on-surface (body text) */
  --color-neutral-700: #3d484f;    /* on-surface-variant */
  --color-neutral-600: #6d7980;    /* outline */
  --color-neutral-500: #bcc8d1;    /* outline-variant */
  --color-neutral-400: #dfe3e7;    /* surface-container-highest */
  --color-neutral-300: #e4e9ed;    /* surface-container-high */
  --color-neutral-200: #eaeef2;    /* surface-container */
  --color-neutral-100: #f0f4f8;    /* surface-container-low */
  --color-neutral-50:  #f6fafe;    /* surface (page background) */
  --color-white:       #ffffff;    /* surface-container-lowest */

  /* ─── SEMANTIC / MATERIAL TOKENS ─────────────────────────────────────── */
  --primary:                  var(--color-primary-500);
  --primary-container:        var(--color-primary-200);
  --on-primary:               var(--color-white);
  --on-primary-container:     var(--color-primary-700);
  --on-primary-fixed:         var(--color-primary-900);

  --secondary:                var(--color-secondary-500);
  --secondary-container:      var(--color-secondary-200);
  --on-secondary:             var(--color-white);
  --on-secondary-container:   var(--color-secondary-700);

  --tertiary:                 #4e5f7e;
  --tertiary-container:       #a4b5d9;

  --surface:                  var(--color-neutral-50);
  --surface-container-lowest: var(--color-white);
  --surface-container-low:    var(--color-neutral-100);
  --surface-container:        var(--color-neutral-200);
  --surface-container-high:   var(--color-neutral-300);
  --surface-container-highest:var(--color-neutral-400);

  --on-surface:               var(--color-neutral-800);
  --on-surface-variant:       var(--color-neutral-700);
  --outline:                  var(--color-neutral-600);
  --outline-variant:          var(--color-neutral-500);

  /* ─── GRADIENTS ──────────────────────────────────────────────────────── */
  --gradient-primary:         linear-gradient(135deg, #0056b3 0%, #00a1ff 100%);
  --gradient-hero:            linear-gradient(to bottom right, var(--primary), var(--primary-container));
  --gradient-cta:             linear-gradient(135deg, var(--secondary-container), var(--color-tertiary-400));

  /* ─── TYPOGRAPHY ─────────────────────────────────────────────────────── */
  --font-display: 'Plus Jakarta Sans', sans-serif;  /* headings, labels, buttons */
  --font-body:    'Manrope', sans-serif;             /* body text, UI copy */

  /* Type Scale */
  --text-xs:   0.75rem;    /*  12px */
  --text-sm:   0.875rem;   /*  14px */
  --text-base: 1rem;       /*  16px */
  --text-lg:   1.125rem;   /*  18px */
  --text-xl:   1.25rem;    /*  20px */
  --text-2xl:  1.5rem;     /*  24px */
  --text-3xl:  1.875rem;   /*  30px */
  --text-4xl:  2.25rem;    /*  36px */
  --text-5xl:  3rem;       /*  48px */
  --text-6xl:  3.5rem;     /*  56px */

  /* Font Weights */
  --fw-regular: 400;
  --fw-medium:  500;
  --fw-semibold:600;
  --fw-bold:    700;
  --fw-extrabold:800;

  /* Line Heights */
  --lh-tight:  1.1;
  --lh-snug:   1.3;
  --lh-normal: 1.6;
  --lh-relaxed:1.75;

  /* ─── SEMANTIC TYPE ROLES ────────────────────────────────────────────── */
  /* Use these class-like vars to guide consistent type usage */
  --type-h1-size:   var(--text-5xl);
  --type-h1-weight: var(--fw-bold);
  --type-h1-family: var(--font-display);

  --type-h2-size:   var(--text-4xl);
  --type-h2-weight: var(--fw-bold);
  --type-h2-family: var(--font-display);

  --type-h3-size:   var(--text-2xl);
  --type-h3-weight: var(--fw-bold);
  --type-h3-family: var(--font-display);

  --type-h4-size:   var(--text-xl);
  --type-h4-weight: var(--fw-semibold);
  --type-h4-family: var(--font-display);

  --type-body-size:   var(--text-base);
  --type-body-weight: var(--fw-regular);
  --type-body-family: var(--font-body);

  --type-label-size:   var(--text-sm);
  --type-label-weight: var(--fw-semibold);
  --type-label-family: var(--font-display);

  --type-caption-size:   var(--text-xs);
  --type-caption-weight: var(--fw-regular);
  --type-caption-family: var(--font-body);

  /* ─── SPACING SCALE ──────────────────────────────────────────────────── */
  --space-1: 0.25rem;   /*  4px */
  --space-2: 0.5rem;    /*  8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */

  /* Named aliases (from codebase) */
  --spacing-xs: var(--space-2);
  --spacing-sm: var(--space-4);
  --spacing-md: var(--space-8);
  --spacing-lg: var(--space-12);
  --spacing-xl: var(--space-16);

  /* ─── BORDER RADIUS ──────────────────────────────────────────────────── */
  --radius-xs:   0.25rem;   /*  4px  — tags, small badges */
  --radius-sm:   0.5rem;    /*  8px  — inputs tight */
  --radius-md:   1.5rem;    /* 24px  — inputs, secondary elements */
  --radius-lg:   2rem;      /* 32px  — cards */
  --radius-xl:   3rem;      /* 48px  — hero/section roundings */
  --radius-full: 9999px;    /* pill  — buttons, chips */

  /* ─── SHADOWS / ELEVATION ────────────────────────────────────────────── */
  --shadow-sm:      0 2px 8px rgba(0, 102, 136, 0.06);
  --shadow-ambient: 0 24px 40px rgba(0, 102, 136, 0.06);   /* cards */
  --shadow-md:      0 4px 20px rgba(0, 86, 179, 0.08);     /* module cards */
  --shadow-lg:      0 25px 50px rgba(0, 86, 179, 0.12);    /* module cards hover */
  --shadow-focus:   0 0 0 2px var(--primary-container);    /* inputs */

  /* ─── ANIMATION ──────────────────────────────────────────────────────── */
  --ease-standard:  cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:    cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --duration-fast:  0.2s;
  --duration-base:  0.3s;
  --duration-slow:  0.8s;
}

/* ─── BASE ELEMENT STYLES ───────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--lh-normal);
  color: var(--on-surface);
  background-color: var(--surface);
  -webkit-font-smoothing: antialiased;
}

h1 { font-family: var(--font-display); font-size: var(--type-h1-size); font-weight: var(--fw-bold); color: var(--on-primary-fixed); line-height: var(--lh-tight); }
h2 { font-family: var(--font-display); font-size: var(--type-h2-size); font-weight: var(--fw-bold); color: var(--on-primary-fixed); line-height: var(--lh-snug); }
h3 { font-family: var(--font-display); font-size: var(--type-h3-size); font-weight: var(--fw-bold); color: var(--on-primary-fixed); line-height: var(--lh-snug); }
h4 { font-family: var(--font-display); font-size: var(--type-h4-size); font-weight: var(--fw-semibold); color: var(--on-surface); }
p  { font-family: var(--font-body); font-size: var(--text-base); line-height: var(--lh-normal); }
small { font-family: var(--font-body); font-size: var(--text-sm); color: var(--on-surface-variant); }

/* ─── UTILITY CLASSES ───────────────────────────────────────────────────── */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.gradient-header {
  background: var(--gradient-primary);
  color: var(--on-primary);
}

.gradient-text {
  background: var(--gradient-hero);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card {
  background: var(--surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-ambient);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2.5rem;
  border-radius: var(--radius-full);
  font-family: var(--font-display);
  font-weight: var(--fw-bold);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-standard);
  border: none;
  text-decoration: none;
  letter-spacing: 0.02em;
}
.btn-primary   { background: var(--secondary-container); color: var(--on-secondary-container); }
.btn-secondary { background: var(--surface-container-highest); color: var(--on-surface); }
.btn-inverted  { background: var(--on-primary-fixed); color: var(--on-primary); }
.btn-outlined  { background: transparent; color: var(--on-surface); border: 2px solid var(--outline-variant); }

.btn-primary:hover,
.btn-inverted:hover { transform: translateY(-2px); box-shadow: var(--shadow-ambient); filter: brightness(1.08); }
.btn-outlined:hover { border-color: var(--primary); color: var(--primary); }

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeIn var(--duration-slow) var(--ease-standard) forwards; }

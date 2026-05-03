# Reporte de Auditoría: Microfase 2.0F-1
## Verificación de Control de Acceso por Módulos
**Fecha:** 2026-05-02 | **Estado:** FALLA CRÍTICA CONFIRMADA — Corrección Requerida

---

## Archivos Revisados

| Archivo | Existe | Observación |
|---|---|---|
| `admin_dashboard.html` | ✅ | Contiene toggles de acceso por módulo |
| `admin_accesos.html` | ✅ | Contiene "Configuración detallada" de accesos |
| `admin_configuracion.html` | ✅ | Configuración general de plataforma |
| `scripts/admin-ui.js` | ✅ | Solo maneja sidebar y assets — sin lógica de acceso |
| `scripts/admin-dashboard-handler.js` | ❌ | **NO EXISTE** |
| `scripts/module-access-service.js` | ❌ | **NO EXISTE** |
| `scripts/access-control.js` | ❌ | **NO EXISTE** |
| `modulo1_intro.html` / `modulo2_intro.html` / `modulo3_intro.html` | ✅ | Sin verificación de acceso |

---

## Hallazgos Críticos

### 1. Fuente de datos: localStorage (NO Firestore)

**`admin_dashboard.html` (toggles rápidos):**
- Los 6 toggles (Módulo 1/2/3 × Lecciones/Actividades) son **puramente visuales**.
- Solo cambian `aria-pressed` con este código:
```javascript
document.querySelectorAll('.toggle-pill').forEach((button) => {
    button.addEventListener('click', () => {
        const isPressed = button.getAttribute('aria-pressed') === 'true';
        button.setAttribute('aria-pressed', String(!isPressed));
    });
});
```
- **No se guardan en ningún lado.** Al recargar, vuelven a sus valores HTML por defecto.

**`admin_accesos.html` (Configuración detallada):**
- Usa `localStorage` con clave `docencia40_admin_access_v1`.
- Persiste entre recargas *en el mismo navegador y dispositivo*.
- **No escribe ni lee de Firestore.**

**`admin_configuracion.html`:**
- Usa `localStorage` con clave `docencia40_admin_settings_v1`.
- El aviso en el HTML lo confirma: *"Modo prototipo: la configuración se guarda temporalmente en este navegador."*

---

### 2. Tabla de Resultados QA

| Pregunta | Resultado |
|---|---|
| ¿Dónde se guardan los toggles del dashboard? | **En ningún lugar** — solo estado DOM temporal |
| ¿Los toggles del dashboard persisten al recargar? | ❌ **NO** — se resetean al valor HTML |
| ¿La config detallada persiste al recargar? | ✅ Sí, pero solo en localStorage del mismo navegador |
| ¿Panel rápido y config detallada están sincronizados? | ❌ **NO** — son sistemas completamente independientes |
| ¿Existe una sola fuente de verdad? | ❌ **NO** — son dos sistemas desconectados |
| ¿Los toggles afectan al participante? | ❌ **NO** — ningún módulo verifica acceso en absoluto |
| ¿Las páginas de módulos verifican acceso? | ❌ **NO** — ninguna lee config de acceso |
| ¿Firestore Rules protegen escritura de configuración? | ❌ **NO** — no hay colección de config en Firestore |
| ¿Hay valores por defecto seguros? | ⚠️ Parcial — `defaultPages` en `admin_accesos.html` pero no en Firestore |

---

### 3. Desconexión Panel Rápido ↔ Configuración Detallada

```
admin_dashboard.html  →  toggles DOM (desaparecen al recargar)
         ↓ NO SE CONECTA
admin_accesos.html    →  localStorage['docencia40_admin_access_v1']
         ↓ NO SE CONECTA
Módulos (modulo1_intro.html, etc.)  →  No leen configuración alguna
```

### 4. Seguridad

- `admin_accesos.html` tiene `admin-guard.js` → solo admin puede abrir la página. ✅
- Pero el `localStorage` **no tiene protección real**: cualquier usuario en la misma máquina puede modificarlo desde consola. ❌
- Un participante no puede acceder a las páginas admin (guard activo), pero si conoce la URL de un módulo "bloqueado", puede acceder igualmente. ❌

---

## Causa Raíz

El sistema fue construido como **prototipo frontend** y nunca se conectó a Firestore. Los toggles del dashboard son decorativos. La "Configuración detallada" usa localStorage como almacenamiento provisional. No hay ningún mecanismo que traslade las reglas de acceso a las páginas de los participantes.

---

## Recomendación para Microfase 2.0F-1 (Corrección)

Se requiere implementar desde cero un sistema de control de acceso real. Alcance mínimo:

### Fase A — Firestore como fuente única
1. Crear colección `configuracion/modulos` en Firestore con campos:
   - `modulo1.lecciones: boolean`
   - `modulo1.actividades: boolean`
   - `modulo2.lecciones: boolean`, etc.
2. Crear `scripts/module-access-service.js` con `getModuleAccess()` y `setModuleAccess()`.
3. Reglas Firestore: solo admin puede escribir, todos los autenticados pueden leer.

### Fase B — Admin Dashboard (Toggles reales)
4. Conectar los toggles de `admin_dashboard.html` a Firestore (leer al cargar, escribir al hacer clic).
5. Conectar `admin_accesos.html` a Firestore (eliminar localStorage).
6. Sincronizar ambos paneles al mismo documento Firestore.

### Fase C — Páginas de participantes
7. En cada página de módulo (`modulo1_intro.html`, etc.), leer `configuracion/modulos` al cargar.
8. Si el módulo está desactivado: mostrar mensaje de "Contenido no disponible" o redirigir al dashboard.

---

## Estado para Auditoría Integral

> ⚠️ **NO LISTO** para auditoría integral.
> El control de acceso por módulos es un sistema prototipo sin funcionalidad real.
> Se debe implementar antes de certificar el sistema.


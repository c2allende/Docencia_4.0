# Nota Técnica v1.8B-A - Docencia 4.0

**Fecha de cierre:** 29 de abril de 2026  
**Estado:** Completado y Validado en Producción  
**URL Oficial:** [https://docencia-4-lms.web.app](https://docencia-4-lms.web.app)

## 1. Objetivo de la Fase
Implementar una herramienta de diagnóstico administrativo capaz de detectar documentos huérfanos o inconsistentes de progreso en Firestore. Esta fase se ejecuta estrictamente en **modo auditoría (solo lectura)** para garantizar la integridad de los datos antes de cualquier acción correctiva.

## 2. Alcance Técnico
### Archivos Modificados:
- `scripts/progress-service.js`: Creación de la lógica de detección cruzada `detectUserOrphanData(uid)`.
- `scripts/admin-progreso-handler.js`: Integración de la UI de auditoría en el modal de detalle del participante.

## 3. Funcionalidad Implementada
- **`detectUserOrphanData(uid)`**: Función asíncrona que cruza la colección de progreso del usuario contra la constante `COURSE_STRUCTURE`.
- **UI de Auditoría**: Sección colapsable “Datos huérfanos detectados” con icono de advertencia (⚠️), visible únicamente si existen hallazgos.
- **Visualización Detallada**: Tabla con tipo de documento, ID, módulo asociado, razón del hallazgo, fecha de última actualización y recomendación técnica.
- **Modo Solo Lectura**: El botón de acción aparece como "Pendiente de revisión" y está deshabilitado para evitar cambios accidentales.

## 4. Tipos de Huérfanos Detectados
- **Páginas inexistentes**: `pageId` que no forma parte de la estructura actual del curso.
- **Inconsistencia de Módulo**: Documentos de página registrados en un módulo que no les corresponde según la estructura oficial.
- **Módulos no reconocidos**: Documentos en `progresoModulos` con IDs antiguos o erróneos (ej: `modulo_antiguo`).
- **Documentos Incompletos**: Registros que carecen de campos obligatorios como `status` o `updatedAt`.

## 5. Validaciones de Seguridad y QA
- **Protección de Datos**: Se ha confirmado que no se realizan escrituras (`setDoc`, `updateDoc`, `addDoc`) ni eliminaciones durante el proceso de detección.
- **Seguridad Perimetral**: Los participantes tienen el acceso bloqueado a la ruta administrativa y no pueden visualizar la lógica de auditoría.
- **Integridad Pedagógica**: El cálculo del progreso oficial (Módulos 1-3) permanece inalterado y correcto.
- **Escalabilidad**: La detección se realiza bajo demanda (por usuario) para optimizar el rendimiento de Firestore.

## 6. Próxima Fase Recomendada
- **Fase 1.8B-B**: Archivado lógico controlado. Habilitar la funcionalidad para marcar documentos huérfanos con el estado `archived`, incluyendo la actualización de `firestore.rules` para permitir esta acción específica y el registro de auditoría en `adminLogs`.

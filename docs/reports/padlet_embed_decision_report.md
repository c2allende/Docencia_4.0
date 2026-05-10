# Reporte de Decisión: Rediseño de Integración de Padlet

## 1. Definición Estratégica Final
Tras el análisis de prototipos y la validación con el usuario, se ha tomado la decisión de **eliminar cualquier tipo de contenido embebido (Iframe/Preview)** de Padlet dentro del LMS.

### Decisiones Críticas:
- **Descartar Iframe:** No se cargará el tablero completo dentro de Docencia 4.0.
- **Descartar Vista Previa Oficial:** Se descarta el uso de códigos embed de Padlet para evitar la carga de scripts de terceros.
- **Dato Técnico Único:** El único dato necesario para la integración es la **URL directa** del tablero.

## 2. Solución Recomendada: Tarjeta CTA Externa
La integración se realizará mediante un componente `.padlet-cta-card` diseñado específicamente para Docencia 4.0.

### Atributos de la Tarjeta:
- **Identidad:** Encabezado visual claro con el texto "Muro colaborativo en Padlet".
- **Estructura:** Título específico del tablero, propósito breve e instrucciones claras.
- **Interacción:** Botón principal "Abrir tablero en Padlet" con icono de enlace externo.
- **Seguridad y Navegación:** Implementación obligatoria de `target="_blank"` y `rel="noopener noreferrer"`.
- **Feedback:** Nota informativa indicando que el tablero se abrirá en una nueva pestaña.

## 3. Estrategia para Actividad 2.1
Dado que esta actividad requiere un seguimiento más riguroso, la tarjeta incluirá un flujo de pasos instruccionales:
1. Revisa tu producto final.
2. Abre el tablero en Padlet (Acceso externo).
3. Publica tu evidencia según las instrucciones del muro.
4. Regresa a Docencia 4.0 para continuar.
5. Marca la actividad como completada.

## 4. Beneficios Esperados
- **Rendimiento:** Reducción drástica del peso de la página y tiempo de carga.
- **Usabilidad:** Eliminación de scroll doble y problemas de encuadre en dispositivos móviles.
- **Mantenibilidad:** Menor dependencia de cambios en los códigos de inserción de Padlet.

---
**Ubicación del Archivo:** Este reporte se encuentra en `docs/reports/`, fuera del directorio público de producción.

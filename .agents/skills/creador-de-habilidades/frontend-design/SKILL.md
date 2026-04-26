---
- Usar `fade-in`, `slide-up`, `pulse-glow` o transiciones CSS basadas en los tokens de motion.
- En React, usar Framer Motion si ya está disponible y el proyecto lo permite.
- Respetar usuarios sensibles al movimiento cuando sea posible.

### Espaciado

- Usar la escala oficial de `main.css`.
- Priorizar respiración visual en pantallas de marketing y claridad funcional en dashboard.
- Evitar layouts apretados, especialmente en formularios educativos o instrucciones.

### Radio y sombras

- Usar radios amplios y consistentes.
- No mezclar tarjetas de 4px con contenedores de 32px o 48px dentro de la misma sección.
- Usar sombras suaves para elevación, no sombras negras pesadas.

## Accesibilidad y semántica

Toda implementación debe cumplir:

- Estructura semántica: `header`, `main`, `section`, `nav`, `footer` cuando aplique.
- Jerarquía correcta de encabezados.
- Alt text en imágenes informativas.
- Estados `hover`, `focus`, `active`, `disabled`.
- Contraste adecuado en texto, botones y badges.
- Navegación usable con teclado.
- Tamaños táctiles adecuados en botones y controles.
- Texto visible y comprensible en español.

## Responsive

Mobile no es una versión reducida sin diseño. Debe tener intención.

- Reducir display headings de forma controlada.
- Reorganizar columnas en una sola columna cuando sea necesario.
- Mantener CTA visible y claro.
- Evitar que tarjetas con mucho contenido se vuelvan demasiado largas sin jerarquía.
- Ocultar solo elementos decorativos, no información esencial.

## Patrones permitidos

- Hero asimétrico con gradiente cyan/teal.
- Dashboard con tarjetas grandes de módulos y columna lateral de progreso.
- Login dividido: panel visual + formulario.
- Cards con borde superior de color para módulos.
- Badges tipo pill para estados.
- Barras de progreso cyan o verde según contexto.
- Tarjeta inversa teal para recursos destacados.
- Microinteracciones sutiles en CTAs y cards.

## Antipatrones

Evitar:

- Duplicar `tokens.css` o crear sistemas paralelos al `main.css`.
- Usar valores hexadecimales sueltos si ya existe token.
- Usar fuentes externas distintas a las oficiales.
- Usar purple gradients o estilos genéricos de IA.
- Usar `<Button>` de shadcn como CTA principal si visualmente no coincide con `.btn-primary`.
- Repetir grids idénticos en todas las secciones.
- Crear diseños donde todo compite por atención.
- Mezclar demasiados estilos de radio y sombra.
- Cambiar la identidad visual para “hacerlo más llamativo”.

## Criterios de salida

Cuando entregue diseño o código, debe incluir:

1. Código funcional o especificación visual clara.
2. Uso explícito de clases o tokens de `main.css`.
3. Estados interactivos principales.
4. Consideración responsive.
5. Recomendaciones breves si falta algún token o componente.

## Definición de listo

Una pantalla está lista cuando:

- Usa `src/styles/main.css` como única fuente visual.
- Se alinea con la identidad Docencia 4.0.
- Tiene jerarquía visual clara.
- Es responsive.
- Tiene estados interactivos completos.
- Cumple criterios básicos de accesibilidad.
- El CTA principal es evidente.
- No usa colores, fuentes, sombras o radios inventados.
- El contenido se siente educativo, profesional y cercano.
---
name: accessibility-ux
description: 'Diseña y verifica accesibilidad y UX de interfaces, componentes interactivos y ejemplos con teclado, foco y estados perceptibles.'
---

# accessibility-ux

Empieza por HTML semántico y controles nativos. Revisa WCAG 2.2 AA y el patrón WAI aplicable a la interacción; ARIA no aporta comportamiento de teclado por sí sola.

1. Define nombres accesibles, roles y estados observables. Evita roles redundantes o elementos con click sin teclado. Documenta cualquier semántica que no atraviese Shadow DOM automáticamente.
2. Recorre la interacción con Tab, Shift+Tab, Enter, Espacio y las teclas del patrón correspondiente. Comprueba orden, foco visible, foco tras actualización y ausencia de trampas.
3. Para formularios, enlaza etiquetas, instrucciones y errores con el control; comunica invalidación y recuperación. Usa regiones vivas para mensajes oportunos, no para anunciar todo el DOM.
4. Comprueba reflow a 320, 375, 768, 1280 y 1440 px y zoom. Usa propiedades CSS lógicas, prueba RTL, texto largo, reduced motion y forced colors. No uses color como única señal ni suprimas outlines.
5. Evalúa contraste de texto, estados interactivos y foco en tema claro y oscuro. Prueba tamaños de interacción y contenido ampliado; una auditoría axe no sustituye estas comprobaciones.
6. Ejecuta axe desde Playwright sobre el build de producción e inspecciona sus hallazgos. Comprueba manualmente lo que la automatización no cubra, incluyendo lectura y anuncios con tecnología de asistencia si está disponible.

Entrega evidencia: ruta, viewport, navegador, pasos y resultado. Distingue pruebas manuales ejecutadas, comprobaciones automáticas y revisión de código. No afirmes conformidad WCAG completa por no encontrar errores en axe. Referencias: https://www.w3.org/TR/WCAG22/ y https://www.w3.org/WAI/ARIA/apg/.

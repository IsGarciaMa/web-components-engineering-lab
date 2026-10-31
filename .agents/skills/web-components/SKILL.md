---
name: web-components
description: 'Implementa o revisa Custom Elements y APIs nativas: lifecycle, Shadow DOM, slots, eventos y formularios; distingue el estándar de Lit.'
---

# web-components

Consulta WHATWG HTML/DOM y MDN para soporte. Explica qué proporciona el navegador y qué debe implementar el autor.

1. Define nombre con guion y API de atributos y propiedades. Los atributos serializan cadenas; las propiedades pueden representar datos ricos. Decide conversión, reflexión, eliminación y recuperación de propiedades previas al upgrade.
2. Limita el constructor a inicializar estado y nodos propios. No dependas de atributos o hijos ya disponibles ni escribas atributos del host durante su construcción. Usa connectedCallback para trabajo que requiera conexión.
3. Haz conexión y desconexión repetibles. Retira listeners externos, observers, timers y suscripciones. Comprueba reconexión y movimientos del DOM antes de elegir callbacks avanzados.
4. Elige Light DOM o Shadow DOM según composición, encapsulación y acceso requerido. Explica slots, contenido asignado y slotchange; evita clonar nodos del consumidor sin un contrato explícito.
5. Define CustomEvent con nombre, detail, bubbles y composed deliberados. Emite por interacciones relevantes; no notifiques una asignación del consumidor como si fuera una interacción.
6. Define styling público con propiedades CSS, parts o slots según necesidad. Shadow DOM no es una frontera de seguridad ni garantiza accesibilidad.
7. Para formularios, revisa `static formAssociated`, `attachInternals()`, `setFormValue()`, validez, labels, reset, disabled y restauración. Comprueba soporte y fallback antes de usar ElementInternals.

No modifiques DOM ajeno sin entender propiedad de nodos y lifecycle. Para el contrato modificado, selecciona los casos afectados entre upgrade tardío, atributos iniciales/modificados/eliminados, propiedades, eventos entre raíces, reconexión y teclado. No revalides toda la suite por un cambio documental; conserva la cobertura integral en el cierre y CI según `AGENTS.md`. Fuentes: https://html.spec.whatwg.org/multipage/custom-elements.html y https://dom.spec.whatwg.org/.

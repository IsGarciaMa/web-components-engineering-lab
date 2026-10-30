---
name: quality-engineering
description: 'Diseña, ejecuta o depura pruebas unitarias, de componentes, integración y E2E del portal y de sus contratos públicos.'
---

# quality-engineering

Elige la capa que reproduce el riesgo: Vitest para lógica y contratos rápidos; Playwright sobre producción para navegador, búsqueda, teclado, estilos y composición real. JSDOM no demuestra interoperabilidad de Custom Elements ni accesibilidad de un navegador.

- Prueba valores por defecto, atributos iniciales/modificados/eliminados, conversión, propiedades, reflexión y límites. Diferencia DOM síncrono nativo de actualizaciones Lit con `updateComplete`.
- Valida nombre, payload, bubbles/composed y número de eventos; incluye un consumidor con Shadow DOM. Comprueba que asignaciones programáticas no generen notificaciones de usuario.
- Cubre upgrade tardío, conexión, desconexión y reconexión cuando haya recursos o listeners. No dependas del nombre de un campo privado ni de árboles internos que el contrato no exponga.
- Reutiliza casos de comportamiento entre implementaciones nativa y Lit sin ocultar diferencias temporales. Añade integración cuando varios componentes coordinen estado.
- En E2E usa roles y nombres accesibles cuando representen el contrato; usa selectores estructurales solo para integraciones externas que no tengan una API estable. Evita esperas fijas.
- Comprueba responsive en los cinco anchos acordados, axe, navegación, 404 y búsqueda Pagefind después del build. Revisa interacciones manuales fuera del alcance de axe.

Ejecuta `pnpm test`, `pnpm build` y `pnpm test:e2e`. Si falla, conserva stack, test, navegador y condiciones; corrige la causa en lugar de aumentar reintentos o debilitar expectativas. No fabriques resultados, porcentajes ni cobertura. Informa también de suites no ejecutadas y sus bloqueos. Fuentes: https://vitest.dev/guide/ y https://playwright.dev/docs/best-practices.

---
name: quality-engineering
description: 'Diseña, ejecuta o depura pruebas unitarias, de componentes, integración y E2E del portal y de sus contratos públicos.'
---

# quality-engineering

Prueba el comportamiento afectado por el cambio y reutiliza resultados correctos de archivos/dependencias sin modificar. No conviertas una funcionalidad o corrección pequeña en una auditoría completa. Elige la capa que reproduce el riesgo: Vitest para lógica y contratos rápidos; Playwright sobre producción para navegador, búsqueda, teclado, estilos y composición real. JSDOM no demuestra interoperabilidad de Custom Elements ni accesibilidad de un navegador.

- Al cambiar un contrato, cubre los casos afectados: valores por defecto, atributos iniciales/modificados/eliminados, conversión, propiedades, reflexión y límites. Diferencia DOM síncrono nativo de actualizaciones Lit con `updateComplete`.
- Valida nombre, payload, bubbles/composed y número de eventos; incluye un consumidor con Shadow DOM. Comprueba que asignaciones programáticas no generen notificaciones de usuario.
- Cubre upgrade tardío, conexión, desconexión y reconexión cuando haya recursos o listeners. No dependas del nombre de un campo privado ni de árboles internos que el contrato no exponga.
- Reutiliza casos de comportamiento entre implementaciones nativa y Lit sin ocultar diferencias temporales. Añade integración cuando varios componentes coordinen estado.
- En E2E usa roles y nombres accesibles cuando representen el contrato; usa selectores estructurales solo para integraciones externas que no tengan una API estable. Evita esperas fijas.
- Conserva responsive en los cinco anchos acordados, axe, navegación, 404 y Pagefind como puertas de CI antes del merge. Usa casos selectivos para cambios relacionados en un entorno compatible; no repitas toda la suite por cambios ajenos a la interfaz. Revisa manualmente solo las interacciones afectadas fuera del alcance de axe.

Durante el desarrollo ejecuta pruebas relacionadas; usa `check:fast` cuando proceda por alcance. En el cierre de PR ejecuta una vez `check:build`, que incluye rápidas y build. `check:e2e` admite filtros y se ejecuta en CI o un entorno compatible; `check:full` combina ambos niveles sin duplicarlos. No ejecutes Playwright localmente en Monterey ni repitas el lanzamiento fallido conocido. Ante un fallo nuevo conserva test, stack y condiciones y corrige la causa sin debilitar expectativas. Resume únicamente resultados y bloqueos relevantes; no fabriques porcentajes ni cobertura ni abras una página de auditoría por tarea. Fuentes: https://vitest.dev/guide/ y https://playwright.dev/docs/best-practices.

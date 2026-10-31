# Avanzado · Tabs accesibles

## Enunciado y objetivos

Implementa Tabs con activación manual, selección externa y composición de paneles; contrasta después el resultado con Lit. Define una predicción y una prueba observable por requisito.

## Requisitos

- Definir items, selected, disabled y label y validar IDs antes de modificar el conjunto.
- Enlazar tab y tabpanel en la misma raíz mediante IDs estables.
- Implementar roving tabindex, flechas, Home/End, Enter y Espacio.
- Emitir intención cancelable y cambio confirmado solo por interacción.
- Cubrir vacío, deshabilitados, cambios dinámicos, recuperación de foco y reconexión.

## Criterios de aceptación

- Flechas cambian foco sin modificar selección; Enter/Espacio activan una sola vez.
- Solo un tab habilitado tiene tabindex=0; los paneles inactivos están hidden.
- Escribir selected no emite eventos ni roba foco exterior.
- Retirar el tab enfocado recupera foco en un destino válido.
- Cancelar before-tab-change mantiene selección; el payload no contiene nodos internos.
- Dos instancias conservan IDs distintos y pueden sincronizarse sin bucles.
- La versión Lit usa templates y updateComplete sin mutar su DOM arbitrariamente.

## Verificación

Ejecuta `pnpm test tests/unit/dom-tabs.test.ts` durante el desarrollo. La suite de navegador del capítulo comprueba teclado, foco, relaciones ARIA y propagación en CI compatible. Al cierre usa `pnpm check:build` una vez; no ejecutes Playwright localmente en Monterey.

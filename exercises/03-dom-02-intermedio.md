# Intermedio · Evento con alcance

## Enunciado y objetivos

Construye un emisor en Shadow DOM y un consumidor que observe y cancele eventos según sus opciones. Define una predicción y una prueba observable por requisito.

## Requisitos

- Usar CustomEvent con detail mínimo y tipos explícitos.
- Permitir configurar bubbles, composed y cancelable.
- Registrar target, currentTarget y composedPath dentro del listener.
- Retirar listeners con función y captura correspondientes.

## Criterios de aceptación

- composed=false impide que el evento del botón alcance al consumidor exterior en este árbol.
- bubbles=false no elimina la captura de ancestros de su recorrido.
- preventDefault hace devolver false a dispatchEvent cuando el evento es cancelable.
- Con cancelable=false la cancelación no surte efecto.
- Desconectar y reconectar el consumidor no multiplica observaciones.

## Verificación

Ejecuta `pnpm test tests/unit/dom-labs.test.ts` durante el desarrollo. La suite de navegador del capítulo comprueba teclado, foco, relaciones ARIA y propagación en CI compatible. Al cierre usa `pnpm check:build` una vez; no ejecutes Playwright localmente en Monterey.

# Solución · Intermedio · Evento con alcance

EventProbe despacha desde su botón interno. El consumidor toma snapshots síncronos y conserva funciones de limpieza para cada destino y captura. La cancelación no llama a stopPropagation: los listeners posteriores pueden seguir registrando el estado cancelado. El payload comunica una acción sin exponer nodos internos.

Fuente: `src/examples/dom/event-probe.ts`. Pruebas: `tests/unit/dom-labs.test.ts` y `tests/e2e/working-with-dom.spec.ts`.

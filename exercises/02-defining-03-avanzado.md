# Avanzado · Recursos y reconexión

## Enunciado y objetivos

Construye lab-lifecycle-probe con atributo label, contador de señales externas y recursos ligados a conexión. Justifica el contrato y demuestra el comportamiento mediante operaciones DOM, sin invocar callbacks manualmente.

## Requisitos

- Crear estado y nodos propios en constructor.
- Escuchar lab-probe-ping en ownerDocument.defaultView al conectar.
- Retirar el listener del destino exacto al desconectar.
- Registrar callbacks reales con un historial máximo de 20 entradas.
- Tolerar adopción hacia un documento sin ventana; no simular movimiento preservado.

## Criterios de aceptación

- Crear una instancia desconectada registra constructor sin inventar connectedCallback.
- Cambiar label desconectado genera una reacción observada.
- Una señal conectada suma uno; desconectada no suma.
- Tras cinco reconexiones una señal sigue sumando exactamente uno.
- Adoptar a otro Document genera adoptedCallback y conectar devuelve la instancia al visible.
- El historial conserva el orden de las últimas 20 entradas y reiniciar libera la instancia anterior.

## Verificación

En desarrollo ejecuta `pnpm test tests/unit/defining-lifecycle.test.ts`. Los casos de composición y navegador están en `tests/e2e/defining-web-components.spec.ts` y se ejecutan en CI compatible. Al cerrar capítulo se usa una sola ejecución de `pnpm check:build`; no ejecutes Playwright localmente en Monterey.

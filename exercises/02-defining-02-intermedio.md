# Intermedio · Tarjeta compuesta

## Enunciado y objetivos

Construye lab-slot-card con Shadow DOM, título nombrado y contenido por defecto. El consumidor conserva sus nodos. Justifica el contrato y demuestra el comportamiento mediante operaciones DOM, sin invocar callbacks manualmente.

## Requisitos

- Usar una raíz abierta con estilos internos.
- Proporcionar slot title, slot por defecto y fallback para ambos.
- Exponer inspectSlots() con recuentos de nodos y elementos.
- Notificar composición a partir de slotchange real.

## Criterios de aceptación

- Retirar el span del título activa el fallback.
- Un span con slot heading queda sin asignarse al título.
- El parentNode de un nodo proyectado sigue siendo el host.
- Cambiar texto dentro del mismo span no se interpreta como reasignación.
- Los estilos internos no requieren acceder desde fuera a nodos shadow.

## Verificación

En desarrollo ejecuta `pnpm test tests/unit/defining-components.test.ts`. Los casos de composición y navegador están en `tests/e2e/defining-web-components.spec.ts` y se ejecutan en CI compatible. Al cerrar capítulo se usa una sola ejecución de `pnpm check:build`; no ejecutes Playwright localmente en Monterey.

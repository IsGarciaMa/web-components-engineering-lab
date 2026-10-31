# Básico · Medidor con contrato

## Enunciado y objetivos

Construye lab-native-meter con una propiedad numérica value entre 0 y 100 y un booleano muted por presencia. Justifica el contrato y demuestra el comportamiento mediante operaciones DOM, sin invocar callbacks manualmente.

## Requisitos

- Extender HTMLElement y registrar el nombre una sola vez.
- Crear un output con nombre accesible; no depender de atributos/hijos en el constructor.
- Definir observedAttributes y getters/setters públicos sin recursión.

## Criterios de aceptación

- value=25 muestra 25; el setter limita 250 a 100 y convierte NaN en 0.
- Eliminar value devuelve el getter a 0.
- muted="false" sigue activado; muted=false elimina el atributo.
- La vista responde a mutaciones externas y la instancia puede reconectarse sin duplicarse.

## Verificación

En desarrollo ejecuta `pnpm test tests/unit/defining-components.test.ts`. Los casos de composición y navegador están en `tests/e2e/defining-web-components.spec.ts` y se ejecutan en CI compatible. Al cerrar capítulo se usa una sola ejecución de `pnpm check:build`; no ejecutes Playwright localmente en Monterey.

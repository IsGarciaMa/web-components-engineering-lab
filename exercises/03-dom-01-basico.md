# Básico · Controlar el contrato

## Enunciado y objetivos

Controla lab-native-tabs usando selected, disabled e items y explica qué entradas se serializan. Define una predicción y una prueba observable por requisito.

## Requisitos

- Importar el registro desde un script de navegador.
- Asignar un array de metadatos con IDs únicos y contenido en slots correspondientes.
- Probar escritura de atributo, propiedad, eliminación y presencia booleana.

## Criterios de aceptación

- Una asignación de selected activa el panel correcto sin emitir tab-change.
- Un ID inválido o eliminado vuelve al primer habilitado.
- disabled="false" bloquea las pestañas hasta retirar el atributo.
- items sigue siendo un array; no aparece un atributo con [object Object].

## Verificación

Ejecuta `pnpm test tests/unit/dom-tabs.test.ts` durante el desarrollo. La suite de navegador del capítulo comprueba teclado, foco, relaciones ARIA y propagación en CI compatible. Al cierre usa `pnpm check:build` una vez; no ejecutes Playwright localmente en Monterey.

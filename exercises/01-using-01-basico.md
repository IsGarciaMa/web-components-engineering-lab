# Básico · Consumir y configurar

## Enunciado

Configura una tarjeta con atributos sin modificar su implementación.

## Objetivos

- Registrar la etiqueta desde un módulo de navegador.
- Cambiar un encabezado mediante DOM APIs.

## Requisitos

- Usar lab-reading-card y el módulo de referencia.
- Conservar una nota de Light DOM.

## Criterios de aceptación

- El encabezado inicial será “Primera lectura”.
- Al ejecutar setAttribute, el encabezado será “Lectura revisada” tras updateComplete.
- compact="false" sigue siendo verdadero; explica y corrige el caso retirando el atributo.
- No acceder a shadowRoot desde el consumidor.

## Verificación

Escribe una predicción y una prueba observable por cada criterio. Usa `pnpm test` para el contrato y `pnpm build` seguido de `pnpm test:e2e` en un sistema soportado para DOM, estilos e interacción. El caso sin JavaScript necesita una recarga con ese entorno desactivado.

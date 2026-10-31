# Avanzado · Integración e inicialización

## Enunciado

Integra el componente con un renderer y distingue el HTML inicial de su comportamiento cliente.

## Objetivos

- Usar propiedades y eventos desde React o Astro.
- Justificar inicialización, propiedad del DOM y alternativa sin JavaScript.

## Requisitos

- Elegir React 19.3.1 o Astro de las integraciones del capítulo.
- Mantener el módulo de Custom Element en el lado del navegador.

## Criterios de aceptación

- Cambiar el lector desde el consumidor actualiza la tarjeta.
- lesson-select muestra el nombre actualizado.
- La raíz o los listeners del consumidor se limpian al desconectar.
- El informe distingue host HTML, registro y render Lit cliente.
- El ejemplo static-summary conserva su texto con JavaScript desactivado.
- No se afirma SSR completo de Lit ni se añade un wrapper sin necesidad.

## Verificación

Escribe una predicción y una prueba observable por cada criterio. Usa `pnpm test` para el contrato y `pnpm build` seguido de `pnpm test:e2e` en un sistema soportado para DOM, estilos e interacción. El caso sin JavaScript necesita una recarga con ese entorno desactivado.

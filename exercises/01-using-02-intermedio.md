# Intermedio · Datos, eventos y estilo

## Enunciado

Conecta una propiedad rica a un resultado observable y personaliza mediante una API pública.

## Objetivos

- Pasar un objeto por propiedad y validar un evento.
- Diseñar limpieza y personalización desde el consumidor.

## Requisitos

- Usar una tarjeta y un resultado [data-exercise-result].
- Permitir desmontar el consumidor sin dejar una suscripción activa.

## Criterios de aceptación

- reader contiene { name: “Ada” } y no crea un atributo reader.
- La acción muestra “Ada: Lectura del ejercicio”.
- Una asignación programática no escribe un resultado de evento.
- El radio se personaliza con --reader-radius.
- Después de ejecutar la limpieza no se actualiza el resultado al activar de nuevo.

## Verificación

Escribe una predicción y una prueba observable por cada criterio. Usa `pnpm test` para el contrato y `pnpm build` seguido de `pnpm test:e2e` en un sistema soportado para DOM, estilos e interacción. El caso sin JavaScript necesita una recarga con ese entorno desactivado.

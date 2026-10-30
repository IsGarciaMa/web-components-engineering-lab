# ADR-0004: experiencia educativa y progreso local opcional

Estado: aceptado; build y pruebas unitarias/integración validados, E2E pendiente.

## Contexto

PR-00 necesita demostrar el recorrido educativo completo sin desarrollar prematuramente los once capítulos. La documentación navegable por sí sola no permite comparar implementaciones ni distinguir publicación editorial de avance personal.

## Decisión

Extender Astro/Starlight mediante componentes propios y dos overrides de presentación. Usar un índice tipado de capítulos con objetivos y estado editorial, una plantilla MDX reutilizable y un recorrido inicial independiente de los capítulos.

El laboratorio compone ejemplos existentes, código real importado y registro limitado de eventos. No incorpora ejecución de código proporcionado por el usuario ni editor en navegador. Los ejercicios se resuelven localmente.

El progreso es un componente Lit optativo, con almacenamiento versionado en el navegador y borrado explícito. Solo cuenta la lección inicial publicada. El estado editorial no depende del progreso personal. No añadir backend, cuenta ni sincronización.

## Consecuencias

Se conserva el shell documental, la búsqueda y los temas de Starlight. Los ejemplos siguen reutilizables. Es posible recorrer lección, laboratorio, ejercicio y presentación sin autenticación ni seguimiento.

Publicar más lecciones exigirá revisar el esquema de progreso, denominador y migración de datos. El almacenamiento puede fallar o ser eliminado; la interfaz debe comunicarlo sin impedir el acceso al material. El build y la prueba real en navegador son necesarios antes de cerrar PR-00.

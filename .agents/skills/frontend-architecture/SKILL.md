---
name: frontend-architecture
description: 'Diseña límites, APIs públicas, composición y estado al añadir módulos o cambiar responsabilidades del frontend.'
---

# frontend-architecture

Aplica los límites existentes mientras implementas el caso de uso y su contrato observable. Consulta una vez la arquitectura y los ADR pertinentes, reutilizando el contexto vigente. Añadir un componente o lección que respeta esos límites no exige una revisión global de arquitectura.

- Mantén el contenido en `src/content/docs`, envoltorios de portal en `src/components` y ejemplos en `src/examples/native` o `lit`. Los contratos puros compartidos van en `shared`; no escondas ahí servicios de propósito general.
- Define entradas, salidas, valores por defecto, estados inválidos, sincronía y semántica de eventos antes de implementar. Explica compatibilidad al cambiar una API.
- Prefiere estado local y composición. Eleva estado al ancestro que deba coordinar consumidores; no añadas un store global para un único ejemplo.
- Aplica responsabilidad única e inversión de dependencias cuando reduzcan acoplamiento demostrable. Una interfaz o un patrón debe resolver una variación real.
- Evita herencia más allá de HTMLElement/LitElement sin una razón específica; usa funciones puras o controllers para comportamiento compartido cuando lo justifique el caso.
- Conserva separados acceso al navegador, conversión de datos y representación. No importes módulos que evalúan HTMLElement desde el servidor de Astro.

Revisa nombres, dependencias, duplicaciones y responsabilidades del área modificada. Si un módulo cambia por razones distintas, separa responsabilidades cuando resuelva el problema. Actualiza mapa o ADR existentes solo ante decisiones duraderas; prueba los contratos afectados y resume los cambios sin un informe arquitectónico adicional por funcionalidad.

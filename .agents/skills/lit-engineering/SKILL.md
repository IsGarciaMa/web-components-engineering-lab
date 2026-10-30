---
name: lit-engineering
description: 'Implementa o revisa LitElement, propiedades reactivas, templates, lifecycle, directives, controllers y Context en ejemplos Lit.'
---

# lit-engineering

Lee `tsconfig.json` antes de usar decorators. Este repositorio usa decorators experimentales con `experimentalDecorators: true` y `useDefineForClassFields: false`. No mezcles ese modelo con auto-accessors estándar sin revisar compilador y transformación de Astro.

- Usa `@property` para API pública y `@state` para estado interno que afecte al template. Define tipo, conversor y reflexión de atributos; evita reflejar objetos o datos sensibles. Una propiedad de clase no debe ocultar el accessor reactivo.
- Usa asignaciones inmutables cuando cambie una colección. `requestUpdate` sirve para cambios que Lit no detecta; no lo añadas si el accessor decorado ya solicita la actualización.
- Mantén `render()` puro. Distingue `attr=${value}`, `.property=${value}`, `?boolean=${condition}` y `@event=${handler}`. No conviertas booleanos en cadenas ni pases objetos como atributos por accidente.
- Calcula datos derivados en getters o `willUpdate` cuando corresponda. Si sobrescribes `update`, preserva `super.update`. Reserva `firstUpdated` para integración inicial con DOM y `updated` para efectos concretos protegidos por propiedades cambiadas; no lo uses como arquitectura de estado genérica.
- Espera `updateComplete` al comprobar el DOM; no prometas que espere tareas externas o actualizaciones de todos los descendientes. No generes bucles asignando estado incondicionalmente desde `updated`.
- Elige directives por una necesidad concreta: listas con identidad, reutilización o integración de nodos. No uses `unsafeHTML` para contenido no confiable.
- Usa Reactive Controllers para ciclos de comportamiento reutilizables. Limpia recursos en desconexión. Introduce `@lit/context` como dependencia solo si existe comunicación real entre consumidores distantes; Context no es una API nativa del navegador.
- Mantén CSS estático en `static styles`, usa variables CSS para personalización y no construyas `unsafeCSS` con entrada externa.

No modifiques manualmente nodos gestionados por Lit salvo integración encapsulada y justificada. Mide antes de optimizar con `shouldUpdate`; no bloquees actualizaciones legítimas. Prueba propiedades, templates, eventos y lifecycle desde la API pública. Fuentes: https://lit.dev/docs/components/ y https://lit.dev/docs/components/decorators/.

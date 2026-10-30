---
name: security-performance
description: 'Revisa contenido dinámico, dependencias, recursos y rendimiento cuando un cambio introduce entradas no confiables o una hipótesis medible.'
---

# security-performance

Identifica entrada, frontera de confianza y salida antes de proponer defensas. El portal estático no necesita una arquitectura de autenticación o sanitización global sin una amenaza concreta.

- Conserva interpolación de texto escapada. Revisa `innerHTML`, `unsafeHTML`, `set:html` y `unsafeCSS`; solo admite constantes locales o un proceso de confianza explícito. Markdown/MDX del repositorio es código revisado, no un formato aceptable para entrada arbitraria de usuarios.
- Valida esquemas y destinos de URLs cuando procedan de fuera del código. No permitas `javascript:` ni interpolación de entradas en scripts. Comprueba errores y tamaños según el uso real.
- Mermaid debe ejecutarse con nivel de seguridad estricto y sobre fuentes revisadas. No permitas links o HTML arbitrarios para facilitar un ejemplo.
- Antes de añadir dependencias comprueba necesidad, procedencia, compatibilidad y superficie añadida. Ejecuta `pnpm audit` con red y evalúa alcance de avisos; no marques como limpio un audit que no pudo consultar el registro.
- Inspecciona listeners globales, observers, timers, tareas asíncronas y desconexión. Usa cancelación cuando evite escrituras tardías o retención de recursos. Un listener de un nodo propio no exige un servicio global de limpieza.
- Carga JavaScript solo en las páginas que lo usan. Formula una hipótesis de rendimiento con escenario, métrica, umbral razonado y medición antes/después antes de introducir memoización, throttling o render optimizado.

Entrega hallazgos reproducibles y separa amenaza demostrada, sospecha e hipótesis de rendimiento. No registres secretos, no añadas telemetría externa y no compliques el ejemplo educativo sin beneficio verificable.

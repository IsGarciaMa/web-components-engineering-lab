---
name: security-performance
description: 'Revisa contenido dinámico, dependencias, recursos y rendimiento cuando un cambio introduce entradas no confiables o una hipótesis medible.'
---

# security-performance

Activa revisión profunda solo ante riesgos reales, cambios relacionados o una petición expresa: entradas no confiables, seguridad, datos, dependencias críticas o una hipótesis medible. Documentación y estilos sin esos cambios no requieren auditorías de seguridad ni de dependencias. Identifica entrada, frontera de confianza y salida antes de proponer defensas. El portal estático no necesita una arquitectura de autenticación o sanitización global sin una amenaza concreta.

- Conserva interpolación de texto escapada. Revisa `innerHTML`, `unsafeHTML`, `set:html` y `unsafeCSS`; solo admite constantes locales o un proceso de confianza explícito. Markdown/MDX del repositorio es código revisado, no un formato aceptable para entrada arbitraria de usuarios.
- Valida esquemas y destinos de URLs cuando procedan de fuera del código. No permitas `javascript:` ni interpolación de entradas en scripts. Comprueba errores y tamaños según el uso real.
- Mermaid debe ejecutarse con nivel de seguridad estricto y sobre fuentes revisadas. No permitas links o HTML arbitrarios para facilitar un ejemplo.
- Antes de añadir dependencias comprueba necesidad, procedencia, compatibilidad y superficie añadida. Cuando el cambio de dependencias o un aviso nuevo justifique la auditoría, consulta el registro y evalúa el alcance relevante; no la repitas por cambios documentales/visuales ni marques como limpio un audit sin consulta válida.
- Inspecciona listeners globales, observers, timers, tareas asíncronas y desconexión. Usa cancelación cuando evite escrituras tardías o retención de recursos. Un listener de un nodo propio no exige un servicio global de limpieza.
- Carga JavaScript solo en las páginas que lo usan. Formula una hipótesis de rendimiento con escenario, métrica, umbral razonado y medición antes/después antes de introducir memoización, throttling o render optimizado.

Comunica solo hallazgos reproducibles y riesgos relevantes del área afectada, distinguiendo amenaza, sospecha e hipótesis de rendimiento. Reutiliza auditorías vigentes mientras no cambie su base; no generes informes extensos ni revises toda la aplicación sin necesidad. No registres secretos, no añadas telemetría externa y no compliques el ejemplo educativo sin beneficio verificable.

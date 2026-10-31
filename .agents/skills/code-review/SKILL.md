---
name: code-review
description: 'Revisa el cierre de PR, cambios arquitectónicos importantes, seguridad crítica o una solicitud expresa; comunica defectos del laboratorio con evidencias.'
---

# code-review

Reserva esta Skill para cierre de PR, cambios arquitectónicos importantes, seguridad crítica o solicitud del usuario; no la ejecutes automáticamente tras cada funcionalidad. Reutiliza contexto y resultados de CI vigentes. Lee el objetivo, las instrucciones y el diff del alcance que se revisa. Comprueba callers, pruebas y documentación alrededor de cada cambio; no inventes defectos a partir de preferencias de estilo.

Prioriza contrato observable, corrección de APIs nativas/Lit, accesibilidad, limpieza de recursos, seguridad y coherencia pedagógica. Revisa responsabilidades mezcladas, herencia innecesaria, duplicación, dependencia evitable y complejidad accidental. El formato lo verifica Prettier.

Clasifica cada hallazgo:

- P0: crítico; impacto grave e inmediato demostrado.
- P1: importante o bloqueante; impide el objetivo, el build o una interacción principal.
- P2: mejora relevante; defecto o riesgo concreto con alcance limitado.
- P3: mejora opcional; explica el beneficio y evita presentarla como bloqueo.

Cada hallazgo debe incluir archivo/línea, escenario que lo activa, impacto y evidencia. Diferencia un fallo reproducido de una inferencia por lectura. Propón la corrección mínima viable; no reescribas arquitectura fuera de alcance.

Revisa brevemente errores funcionales y problemas importantes al cerrar una PR; profundiza solo por riesgo o petición expresa. Ejecuta comprobaciones relacionadas que falten, sin repetir las correctas sobre la misma base. Resume hallazgos, verificaciones y límites relevantes; si no hay hallazgos, basta indicarlo sin otro informe. No atribuyas éxito a CI no ejecutada ni crees microtareas de auditoría. No apruebes merge con instalación reproducible o pruebas requeridas sin completar. La revisión no autoriza push, merge ni despliegue.

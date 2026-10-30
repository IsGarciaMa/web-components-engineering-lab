---
name: code-review
description: 'Revisa una PR o un diff del laboratorio y comunica defectos funcionales, arquitectura, accesibilidad, seguridad y desviaciones educativas con evidencias.'
---

# code-review

Lee el objetivo de la PR, `AGENTS.md`, los ADR relacionados y el diff completo. Comprueba callers, pruebas y documentación alrededor de cada cambio; no inventes defectos a partir de preferencias de estilo.

Prioriza contrato observable, corrección de APIs nativas/Lit, accesibilidad, limpieza de recursos, seguridad y coherencia pedagógica. Revisa responsabilidades mezcladas, herencia innecesaria, duplicación, dependencia evitable y complejidad accidental. El formato lo verifica Prettier.

Clasifica cada hallazgo:

- P0: crítico; impacto grave e inmediato demostrado.
- P1: importante o bloqueante; impide el objetivo, el build o una interacción principal.
- P2: mejora relevante; defecto o riesgo concreto con alcance limitado.
- P3: mejora opcional; explica el beneficio y evita presentarla como bloqueo.

Cada hallazgo debe incluir archivo/línea, escenario que lo activa, impacto y evidencia. Diferencia un fallo reproducido de una inferencia por lectura. Propón la corrección mínima viable; no reescribas arquitectura fuera de alcance.

Ejecuta verificaciones proporcionales cuando sea posible. Enumera comando, resultado y limitación; no atribuyas éxito a CI que no se haya ejecutado. Si no hay hallazgos, dilo e identifica riesgos residuales o pruebas pendientes. No apruebes merge con instalación reproducible o pruebas requeridas sin completar. La revisión no autoriza push, merge ni despliegue.

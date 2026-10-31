# Contrato de desarrollo

Web Components Engineering Lab enseña los estándares web y su aplicación con Lit mediante contenido original y ejemplos ejecutables. Cada capítulo tiene su propia PR; PR-00 establece infraestructura.

## Ingeniería

- Documentación, contenido y explicaciones en español. Identificadores de código en inglés y terminología técnica precisa.
- TypeScript estricto; no silencies errores con `any` o casts sin justificar. Prettier es obligatorio. Separa visualmente bloques, conserva funciones pequeñas y nombres coherentes: clases PascalCase, variables camelCase, archivos y Custom Elements kebab-case con prefijo `lab-`.
- Consulta `code-readability` al desarrollar funcionalidades, corregir errores, refactorizar, implementar TypeScript/Lit, generar ejemplos educativos o revisar una PR. Aplica sus convenciones al código nuevo y a los bloques modificados, sin refactorizaciones masivas para adoptar la Skill.
- Separa contenido, UI del portal, ejemplos, contratos y herramientas. Prefiere composición; aplica SOLID y patrones solo si resuelven una necesidad real.
- Distingue APIs del navegador de abstracciones de Lit. Respeta el ciclo de vida, la propiedad de los nodos y los decorators configurados. `render()` es puro; no manipules DOM gestionado por Lit sin una integración justificada.
- Diseña accesibilidad desde el inicio: semántica, teclado, foco, nombres, contraste y estados de error. Revisa responsive, RTL, reduced motion y forced colors cuando afecten al cambio.
- Prueba comportamiento observable y APIs públicas. Combina pruebas rápidas con navegador real cuando importe el DOM, estilos o interacción. No fabriques resultados ni sustituyas pruebas pendientes por afirmaciones.

## Contenido, dependencias y seguridad

- No copies materiales privados de BlueSpire ni de otros cursos. Crea explicaciones originales desde fuentes públicas oficiales y enlázalas.
- Añade dependencias solo con necesidad técnica, licencia y compatibilidad revisadas. Fija versiones directas y pnpm; actualiza el lockfile mediante pnpm. No añadas React ni herramientas globales por defecto.
- Escapa texto dinámico. No uses HTML/CSS inseguro con entradas externas; valida URLs según su procedencia. Revisa recursos y limpieza de efectos. No añadas mecanismos de seguridad sin amenaza concreta ni optimizaciones sin hipótesis medible.
- No incluyas secretos. Documenta avisos de dependencias y fallos reales de auditoría.

## Entrega y Git

Trabaja esta entrega en `chore/00-foundation`; para capítulos usa `feat/01-<tema>` y equivalentes. Usa Conventional Commits con alcance concreto. Cada PR explica problema, resultado, ADR relevantes, evidencia y límites. No hagas push, merge ni despliegues sin autorización.

Antes de entregar ejecuta `pnpm install --frozen-lockfile` y `pnpm check` (Skills, formato, lint, tipos, Vitest, build, Playwright y diff). No ocultes fallos; detalla comandos no ejecutables y su causa. Los cambios de infraestructura deben actualizar documentación y ADR cuando cambien decisiones duraderas.

## Skills según la tarea

Consulta solo las Skills aplicables según la tabla, antes de implementar o revisar el área correspondiente. Sus procedimientos viven en cada `SKILL.md`; este contrato mantiene únicamente las reglas comunes.

| Skill                 | Activación                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------- |
| project-scaffolding   | Entorno, dependencias, scripts o configuración inicial                                       |
| frontend-architecture | Límites de módulos, contratos públicos o gestión del estado                                  |
| web-components        | Custom Elements, lifecycle, Shadow/Light DOM, slots, eventos o formularios nativos           |
| lit-engineering       | Reactividad, templates, decorators, controllers o Context de Lit                             |
| technical-education   | Capítulos, explicaciones, ejemplos, diagramas, ejercicios o presentaciones                   |
| accessibility-ux      | Interacciones, semántica, teclado, foco o adaptaciones visuales                              |
| quality-engineering   | Estrategia, implementación, ejecución o depuración de pruebas                                |
| security-performance  | Entradas externas, contenido dinámico, recursos o mediciones de rendimiento                  |
| devops-vercel         | CI, build, caché, previews y preparación de despliegue                                       |
| code-review           | Revisión de diff o PR con hallazgos P0–P3 y evidencias                                       |
| code-readability      | Funcionalidades, correcciones, refactorizaciones, TypeScript, Lit, ejemplos y revisión de PR |

Las once Skills están instaladas en `.agents/skills/<nombre>/SKILL.md`. Las diez originales aparecían en el catálogo de esta sesión; la nueva `code-readability` se ha leído explícitamente y su descubrimiento automático debe comprobarse en una sesión que actualice el catálogo. No existe un segundo directorio `codex-skills/`. Este entorno mantiene `.agents` en solo lectura y requiere elevación para instalar la nueva Skill. `pnpm skills:check` valida la estructura instalada, sin certificar reconocimiento automático. Consulta `docs/skills.md` para el estado y la verificación.

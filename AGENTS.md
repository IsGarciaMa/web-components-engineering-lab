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

## Flujo de trabajo y validación

Prioriza, en este orden: corrección funcional, contenido educativo, legibilidad y mantenibilidad, accesibilidad, pruebas relevantes, rendimiento y validación proporcional al riesgo. Aplica la calidad mientras implementas; no conviertas cada funcionalidad en una auditoría independiente.

- Implementa unidades completas y activa solo las Skills relevantes. Conserva el contexto y los resultados correctos mientras no cambien sus archivos, dependencias o entorno.
- Para cambios pequeños de documentación, estilos, nombres o refactorizaciones locales, comprueba el formato de los archivos y las pruebas directamente afectadas cuando corresponda. No ejecutes auditorías generales.
- Para funcionalidades, añade y ejecuta pruebas de su comportamiento; comprueba tipos o lint cuando afecten al cambio. No repitas build por cada archivo.
- En el cierre de cada PR/capítulo ejecuta una vez `pnpm check:build` (también disponible como `pnpm check`) y `git diff --check`. `check:build` incluye `check:fast`, build con Marp/Pagefind y referencias locales; no ejecutes además `check:fast` sobre el mismo estado.
- `pnpm check:fast` reúne formato, lint, tipos, tooling y Vitest. `pnpm check:e2e` conserva los tests de navegador y acepta filtros; presupone un build vigente. `pnpm check:full` combina build y E2E solo en entornos compatibles.
- Antes del merge, ambos jobs de CI —calidad y navegador— deben pasar, incluidas accesibilidad, responsive y consola. Los fallos reales siguen siendo bloqueantes; la CI es la evidencia de navegador habitual.
- Reserva revisiones profundas para APIs públicas, seguridad, datos, arquitectura compartida, dependencias críticas, comportamientos fundamentales de Web Components/Lit o peticiones expresas. Revisa el área afectada; no añadas una auditoría integral si basta una comprobación específica.
- Reinstala con `pnpm install --frozen-lockfile` en entornos nuevos/CI o cuando cambie la resolución de dependencias. Cambiar solo scripts, contenido o instrucciones no exige reinstalar.

### Problemas conocidos

Registra una restricción demostrada de forma concisa, continúa con trabajo independiente y reintenta solo si cambia el entorno o aparece evidencia nueva. Monterey no dispone de los navegadores requeridos: no ejecutes Playwright ni intentes instalarlos localmente para repetir ese bloqueo; se ejecutan en CI Ubuntu compatible. Su ausencia no equivale a E2E superados ni impide continuar el desarrollo.

`pnpm skills:check` es la validación estructural habitual. La ausencia conocida de PyYAML para el validador Python auxiliar no bloquea el desarrollo: no lo instales ni reinvestigues esa restricción sin nueva evidencia.

### Comunicación

Para tareas habituales responde brevemente con **Implementado**, **Verificado** y **Pendiente** (solo problemas relevantes). Para una PR completa incluye resultado funcional, validaciones, bloqueos, límites y estado para commit/merge. No crees una página de auditoría por cada tarea ni repitas informes sin hallazgos. Aprovecha la evidencia vigente de CI.

## Entrega y Git

Continúa en la rama de la entrega: una PR grande por capítulo, sin microtareas ni ramas artificiales de estabilización. Para capítulos usa `feat/01-<tema>` y equivalentes; no inicies el siguiente sin autorización. Usa Conventional Commits con alcance concreto. Cada PR explica problema, resultado, ADR pertinentes, evidencia y límites, sin duplicar logs completos. No hagas commit, push, merge ni despliegues sin autorización.

Actualiza documentación y ADR existentes cuando cambien decisiones duraderas; evita documentos o procesos que no aporten valor. No ocultes fallos ni atribuyas éxito a comprobaciones no ejecutadas.

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
| code-review           | Cierre de PR, cambios arquitectónicos importantes, seguridad crítica o petición expresa      |
| code-readability      | Funcionalidades, correcciones, refactorizaciones, TypeScript, Lit, ejemplos y revisión de PR |

Las once Skills están instaladas, reconocidas y validadas según el estado confirmado del proyecto. Sus fuentes viven en `.agents/skills/<nombre>/SKILL.md`, sin duplicado `codex-skills/`. Este entorno requiere elevación para escribir `.agents`. Ejecuta `pnpm skills:check` si cambian las Skills o su catálogo; comprueba estructura, no comportamiento. Consulta `docs/skills.md` para responsabilidades y adopción incremental.

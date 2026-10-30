# ADR-0002: versiones fijadas y soporte del entorno

Estado: aceptado con limitación de entorno para E2E.

## Contexto

El equipo disponible es macOS 12.7.6 Intel con Node 24.22.1. Las versiones actuales de Node y Playwright no ofrecen soporte oficial para Monterey. La auditoría requiere acceso npm fuera del sandbox.

## Decisión

Fijar Node 24.22.1 y pnpm 10.34.9, ya disponibles. Seleccionar Astro 7.4.4 y Starlight 0.42.8 según sus metadatos oficiales compatibles. Usar TypeScript 5.9.3, ESLint 9.39.5 y Vitest 4.0.18 como una base estable conservadora del tooling con sus APIs conocidas, en vez de migrar simultáneamente al compilador TypeScript 7 y Vitest 5. No se afirma que sean las últimas versiones. La revisión final valida instalación congelada, peers estrictos, tipos, tests y build. La auditoría registra avisos de tooling en [seguridad](../security.md); E2E sigue pendiente.

Mantener decorators experimentales de Lit con `useDefineForClassFields: false` para este ejemplo. Un accessor decorado solicita su actualización; no añadir `requestUpdate` redundante.

Ejecutar navegadores actuales en Ubuntu 24.04 en CI y en macOS 14+ cuando esté disponible. No actualizar el SO, instalar herramientas globales ni rebajar navegadores para presentar soporte Monterey inexistente.

## Consecuencias

El trabajo parcial local no certifica soporte oficial. Mac M1 con macOS 14+ cumple los requisitos de arquitectura/SO, pero no se ha probado físicamente. El lockfile ya está generado y comprobado en instalación limpia, sin descargas, desde el store local. No se declara ausencia de vulnerabilidades: la auditoría completa registra nueve avisos de tooling y la de producción cero. Playwright rechaza explícitamente macOS 12; el cierre depende de un sistema compatible.

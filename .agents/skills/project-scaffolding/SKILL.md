---
name: project-scaffolding
description: 'Configura o modifica entorno, dependencias, scripts y herramientas del laboratorio; úsala al iniciar el proyecto o cambiar su infraestructura.'
---

# project-scaffolding

Lee `docs/environment.md`, `package.json` y los ADR antes de cambiar versiones. Consulta requisitos, engines y peerDependencies oficiales para el conjunto, no para cada paquete de forma aislada.

1. Registra SO, arquitectura, Node, pnpm y Git antes de instalar. Distingue ejecución observada de soporte oficial; Monterey puede ejecutar Node sin estar soportado.
2. Revisa el árbol actual. Conserva un único proyecto mientras no exista una necesidad concreta de paquetes independientes.
3. Fija dependencias directas necesarias y la versión de pnpm. Mantén `pnpm-lock.yaml` generado por pnpm y comprueba una instalación limpia con `--frozen-lockfile`. No escribas un lockfile a mano.
4. Mantén Astro/Starlight para contenido, Lit solo en ejemplos y tooling en devDependencies. No dupliques MDX si Starlight ya lo configura; no añadas React por conveniencia del scaffold.
5. Conserva TypeScript estricto, formato Astro, lint de Astro/TS y separación entre Vitest y Playwright. Verifica scripts contra los archivos reales.
6. Ejecuta `pnpm check` cuando el entorno lo permita. Si falla instalación o falta navegador, conserva el error y enumera las comprobaciones pendientes.

Para una actualización mayor, comprueba migraciones de Astro, integración Starlight, compilador y testing; registra un ADR si cambia el soporte del entorno. El resultado debe explicar versiones, comandos, lockfile, compatibilidad y bloqueos. No instales herramientas globales ni actualices el SO como efecto incidental.

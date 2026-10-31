---
name: project-scaffolding
description: 'Configura o modifica entorno, dependencias, scripts y herramientas del laboratorio; úsala al iniciar el proyecto o cambiar su infraestructura.'
---

# project-scaffolding

Lee `docs/environment.md`, `package.json` y los ADR antes de cambiar versiones. Consulta requisitos, engines y peerDependencies oficiales para el conjunto, no para cada paquete de forma aislada.

1. Reutiliza el estado conocido de SO, arquitectura, Node, pnpm y Git; compruébalo de nuevo si cambia el entorno o una actualización lo requiere. Distingue ejecución observada de soporte oficial; Monterey puede ejecutar Node sin estar soportado.
2. Revisa el árbol actual. Conserva un único proyecto mientras no exista una necesidad concreta de paquetes independientes.
3. Fija dependencias directas necesarias y la versión de pnpm. Mantén `pnpm-lock.yaml` generado por pnpm y comprueba una instalación limpia con `--frozen-lockfile` al cambiar su resolución o preparar un entorno nuevo; no reinstales por editar solo scripts o documentación. No escribas un lockfile a mano.
4. Mantén Astro/Starlight para contenido, Lit solo en ejemplos y tooling en devDependencies. No dupliques MDX si Starlight ya lo configura; no añadas React por conveniencia del scaffold.
5. Conserva TypeScript estricto, formato Astro, lint de Astro/TS y separación entre Vitest y Playwright. Verifica scripts contra los archivos reales.
6. Valida el tooling que cambie. Para comprobar una composición nueva o cerrar la PR, ejecuta una vez `pnpm check:build` (alias `pnpm check`); ya incluye `check:fast`. No repitas verificaciones vigentes ni ejecutes Playwright local en Monterey. Registra bloqueos nuevos sin reiterar restricciones ya demostradas.

Para una actualización mayor, comprueba migraciones de Astro, integración Starlight, compilador y testing; registra un ADR si cambia el soporte del entorno. Resume solo las versiones, compatibilidad y bloqueos que cambien; no generes un informe de entorno en cada tarea. No instales herramientas globales ni actualices el SO como efecto incidental.

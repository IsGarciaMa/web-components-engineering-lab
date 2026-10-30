---
name: devops-vercel
description: 'Configura o depura GitHub Actions, build estático, instalación reproducible y preparación de previews o hosting en Vercel.'
---

# devops-vercel

Lee `docs/deployment.md`, `docs/environment.md` y `vercel.json`. El objetivo actual es un sitio estático: `pnpm build` produce `dist` y no requiere adaptador SSR ni secretos de runtime.

1. Usa `.node-version`, `packageManager` y el lockfile versionado. La CI debe ejecutar `pnpm install --frozen-lockfile`; no generes un lockfile en CI para ocultar su ausencia.
2. Usa caché del store de pnpm con clave asociada al lockfile; no caches node_modules entre plataformas. Mantén permisos de Actions mínimos y evita secretos en jobs de PR de forks.
3. Ejecuta Skills, formato, ESLint, tipos, Vitest, build con Marp, Playwright y `git diff --check`. Instala navegadores/dependencias en el runner Linux soportado, no rebajes Playwright para simular soporte Monterey.
4. Valida búsqueda Pagefind y rutas sobre `pnpm preview`, incluidos 404 y recursos de presentaciones. Guarda trazas/reportes en fallos sin subir credenciales.
5. Para Vercel define raíz, Node, pnpm, comando de build y salida. Revisa cómo se habilitan previews y protección de acceso; conectar Git puede iniciar despliegues automáticamente.

No realices despliegues reales sin autorización. La configuración inicial desactiva despliegues por Git. Una petición de preparar configuración no autoriza habilitarlos. Antes de solicitar aprobación deja build y cambios concretos listos para revisar; informa de cualquier validación bloqueada.

Si falla un build, reproduce el comando exacto y distingue instalación, engines, compilación, generación y hosting. Documenta el error original y el resultado de la corrección. Fuentes: https://vercel.com/docs/frameworks/frontend/astro y https://docs.github.com/en/actions.

---
name: devops-vercel
description: 'Configura o depura GitHub Actions, build estático, instalación reproducible y preparación de previews o hosting en Vercel.'
---

# devops-vercel

Lee `docs/deployment.md`, `docs/environment.md` y `vercel.json`. El objetivo actual es un sitio estático: `pnpm build` produce `dist` y no requiere adaptador SSR ni secretos de runtime.

1. Usa `.node-version`, `packageManager` y el lockfile versionado. La CI debe ejecutar `pnpm install --frozen-lockfile`; no generes un lockfile en CI para ocultar su ausencia.
2. Usa caché del store de pnpm con clave asociada al lockfile; no caches node_modules entre plataformas. Mantén permisos de Actions mínimos y evita secretos en jobs de PR de forks.
3. Mantén dos jobs obligatorios: calidad instala una vez, comprueba Skills y ejecuta `check:build`; navegador instala sus dependencias y los tres motores en Ubuntu compatible, descarga el `dist` de calidad y ejecuta `check:e2e`. No repitas build ni las comprobaciones rápidas en el job de navegador. Conserva `git diff --check` en calidad. No instales ni ejecutes Playwright en el Monterey conocido.
4. Conserva en CI búsqueda Pagefind, rutas, 404, recursos, accesibilidad, responsive y consola sobre producción. Publica reportes/trazas ante fallos y conserva las capturas de referencia explícitas. Al editar CI comprueba su sintaxis; reutiliza resultados vigentes y no ejecutes E2E localmente por cada cambio de configuración.
5. Para Vercel define raíz, Node, pnpm, comando de build y salida. Revisa cómo se habilitan previews y protección de acceso; conectar Git puede iniciar despliegues automáticamente.

No realices despliegues reales sin autorización. La configuración inicial desactiva despliegues por Git. Una petición de preparar configuración no autoriza habilitarlos. Antes de solicitar aprobación deja build y cambios concretos listos para revisar; informa de cualquier validación bloqueada.

Si aparece un fallo nuevo de build, reproduce el comando afectado y distingue instalación, engines, compilación, generación y hosting. Resume error y corrección; no repitas bloqueos conocidos ni generes informes adicionales. Fuentes: https://vercel.com/docs/frameworks/frontend/astro y https://docs.github.com/en/actions.

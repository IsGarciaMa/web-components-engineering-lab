# Preparación para Vercel

El sitio es estático. No necesita adaptador `@astrojs/vercel`, funciones ni variables secretas. La configuración propuesta usa raíz del repositorio, Node 24.x, pnpm 10.34.9, instalación con lockfile, `pnpm build` y salida `dist`.

`vercel.json` desactiva despliegues por Git con `git.deploymentEnabled: false`. Esta entrega no conecta cuentas ni repositorios y no ha publicado ninguna preview. Habilitar despliegues o conectar una integración que publique requiere autorización explícita.

## Validación en CI

El job `quality` instala una vez y ejecuta Skills y `check:build`; publica `dist` para el job `browser`, que instala sus dependencias/motores y ejecuta `check:e2e` en Ubuntu 24.04 sin reconstruir. La caché comparte el store de pnpm, no node_modules. Reportes y trazas se publican ante fallos; las capturas de referencia explícitas se conservan también en éxito.

Antes del merge se requieren ambos resultados, `quality` y `browser`. Las reglas de protección del repositorio deben exigir los dos; un resultado de calidad por sí solo no acredita E2E. No se modifican protecciones remotas ni se atribuye éxito a CI no ejecutada desde esta intervención.

## Antes de habilitar hosting

- Cerrar las verificaciones en navegador descritas en `validation.md`, incluir el lockfile existente en el primer commit y obtener CI verde.
- Ejecutar build y probar con `pnpm preview`, incluida búsqueda, 404, recursos y presentaciones.
- Confirmar cuenta/proyecto Vercel, dominio y política de acceso a previews.
- Revisar la configuración exacta en Vercel. El proveedor puede escoger otro patch de Node 24; confirmar el build en ese runtime.

## Previews y producción

Tras autorización, crear/conectar el proyecto y habilitar los despliegues por Git o el mecanismo autorizado. Vercel puede generar previews por PR. No incluyas tokens en repositorio ni concedas a PR de forks acceso a secretos. Esta propuesta no añade una GitHub Action de despliegue para evitar duplicar el mecanismo de Vercel.

En un fallo distingue primero resolución del lockfile, engines, compilación Astro, generación de contenido y subida de artefactos. Conserva el comando y log originales. No cambies a SSR ni añadas reescrituras globales para ocultar un 404 de rutas estáticas.

Fuente: [Astro en Vercel](https://vercel.com/docs/frameworks/frontend/astro).

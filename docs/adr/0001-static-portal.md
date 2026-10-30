# ADR-0001: portal estático y ejemplos independientes

Estado: aceptado; build estático validado en la revisión final.

## Contexto

La plataforma necesita documentación navegable, búsqueda y ejemplos interactivos nativos/Lit. Los capítulos se desarrollarán progresivamente y no necesitan datos de servidor.

## Decisión

Usar un proyecto Astro + Starlight estático. El contenido está en Markdown/MDX; los Custom Elements se registran mediante scripts de Astro en el navegador. No usar React, monorepo ni adaptador Vercel mientras no exista una necesidad funcional.

## Consecuencias

El portal aprovecha navegación, búsqueda Pagefind y temas de Starlight sin duplicarlos. La búsqueda requiere build. Los ejemplos conservan APIs reutilizables fuera del portal. Una futura necesidad de SSR exige revisar la decisión, no añadir un adaptador por defecto.

# ADR-0005: capítulo de consumo e integración

Estado: aceptado para PR-01; comprobaciones de navegador pendientes de entorno compatible.

## Contexto

El primer capítulo debe enseñar consumo real, personalización e integración sin adelantar la implementación profunda de contratos de PR-03. PR-00 conserva el portal estático, los ejemplos y once posiciones editoriales. Un host con JavaScript cliente no demuestra SSR de Lit.

## Decisión

Publicar **Using Web Components** como capítulo 01 con siete lecciones, ocho laboratorios y tres ejercicios. Los otros diez capítulos conservan sus rutas y estado pendiente. La antigua URL `/capitulos/01-plataforma-web/` se conserva mediante redirección estática Astro a `/capitulos/01-using-web-components/`. La navegación enumera explícitamente el mapa y las siete lecciones para no duplicar entradas.

Usar Web Awesome 3.14.0 (MIT) como biblioteca npm real; importar solo el botón y su tema base en el consumidor correspondiente. La revisión de la documentación descartó Shoelace para trabajo nuevo porque su sitio indica que está sin desarrollo activo y remite a Web Awesome. No copiar una biblioteca local para simular distribución npm.

Añadir React y React DOM 19.3.1 (MIT), con tipos 19.3.0, para demostrar el soporte actual de propiedades complejas, eventos y referencias. Se monta una raíz cliente solamente en su demo; no se añade `@astrojs/react`, JSX, otro proyecto ni un pipeline SSR. React posee su contenedor y Lit su raíz shadow. Las recetas Angular/Vue se ofrecen como código de referencia, con pasos para verificarlas en sus proyectos, sin afirmar que se han compilado aquí.

Las demos reutilizan una envoltura Astro con objetivo, vista, explicación y fuentes importadas con `?raw`. Cada una importa su script de navegador; el frontmatter no evalúa clases DOM. Los elementos de referencia viven en `src/examples/using`, los consumidores en `src/labs/using` y las integraciones en `src/examples/frameworks`. No hay un editor de código arbitrario.

Mantener SSG. `lab-static-summary` mejora Light DOM previsto en su contrato y conserva texto legible sin JavaScript. El ejemplo DSD usa un host nativo sin registro para distinguir parseo declarativo, upgrade e hidratación. No se instala un pipeline SSR de Lit.

El progreso pasa a `lab-learning-progress-v2`, con IDs de las ocho lecciones disponibles. Lee v1 si falta v2, transforma el booleano anterior en la lección inicial, elimina duplicados y filtra IDs no publicados. Leer no escribe ni activa un seguimiento antes inexistente. La primera acción persiste v2; borrar retira ambas claves. No se añaden cuentas, sincronización ni estado global.

## Calidad y herramientas

La CI heredada de main ya falla en E2E: regiones con scroll inaccesibles por teclado y selectores ambiguos. Se añaden `tabindex="0"` estáticos a código y tablas mediante los hooks públicos de Expressive Code y Sätteri. `@astrojs/markdown-satteri` 0.4.6 (MIT), ya transitiva en Astro, se declara como devDependency directa para configurar su factory pública; no se cambia de procesador ni se añade `@astrojs/markdown-remark`. Los selectores se acotan al control visible o al propósito de la acción, sin desactivar reglas axe.

`pnpm docs:check` usa el JSDOM ya instalado para verificar archivos, fragmentos y acceso por teclado en HTML generado, sin ejecutar scripts. Se añade a `pnpm check` y CI después del build. No sustituye responsive ni estilos computados.

## Consecuencias

Se añaden tres dependencias runtime por necesidades educativas concretas, tipos y una declaración directa del procesador existente. Las nuevas entradas se fijan y el lockfile se actualiza exclusivamente con pnpm. React y Web Awesome se cargan en las páginas que los consumen, no en todo el portal.

La migración de progreso mantiene la lectura anterior y evita contar capítulos pendientes. Publicar más lecciones exige ampliar la lista de IDs admitidos. La redirección estática conserva enlaces anteriores, pero no se presenta como respuesta HTTP 301 del hosting.

Las demos de CSS, DSD, teclado y acceso con tecnología de asistencia necesitan navegador real. Monterey rechaza los navegadores de Playwright 1.64.1 y Docker no tiene daemon en esta sesión. No se rebajan navegadores ni se publica una rama para obtener un runner sin autorización. Evidencia y estado final en [PR-01](../pr-01-validation.md).

## Referencias

- [Web Awesome: instalación](https://webawesome.com/docs) y [Shoelace: estado del proyecto](https://shoelace.style/).
- [React DOM: Custom Elements](https://react.dev/reference/react-dom/components).
- [Astro: scripts](https://docs.astro.build/en/guides/client-side-scripts/).
- [Lit: SSR](https://lit.dev/docs/ssr/overview/).

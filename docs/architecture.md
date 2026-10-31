# Arquitectura del laboratorio

Un único proyecto Astro estático integra Starlight para documentación, navegación, Pagefind y temas. La academia extiende la portada y la identidad mediante los overrides `Hero` y `SiteTitle`; conserva el shell documental de Starlight en las demás rutas.

## Dependencias entre módulos

```text
content/docs → components/portal, learning, labs, progress
learning → data/curriculum
progress → data/curriculum + Lit + localStorage
components/labs → CounterDemo + examples?raw + labs/counter-lab
CounterDemo → scripts del navegador → examples/native + examples/lit
examples/native + examples/lit → examples/shared
```

`src/data/curriculum.ts` contiene el índice editorial y los objetivos de once capítulos. Las páginas MDX de los nueve capítulos pendientes mantienen sus URLs y componen `chapter-overview.astro`. Los capítulos 01 y 02 están publicados con mapas y siete/nueve lecciones respectivamente; sus URLs iniciales del scaffold redirigen a las actuales. La lección introductoria de PR-00 sigue siendo independiente. La plantilla reúne objetivos, índice, documentación, ejemplos/laboratorios, ejercicios, presentaciones, referencias y siguiente contenido; distingue recursos iniciales disponibles de material futuro.

El contenido de la lección permanece en Markdown/MDX. El laboratorio es un consumidor independiente: registra `count-change`, valida el payload, conserva hasta ocho filas y limpia únicamente el registro. No altera el Shadow DOM de los ejemplos. Sus listeners se retiran al desconectar. Los archivos fuente se importan con `?raw` y se muestran escapados con `Code` público de Starlight, sin ejecutar entradas editables.

Los Custom Elements solo se importan en scripts de navegador, nunca en frontmatter SSR. `CounterDemo` registra las implementaciones y no les impone dependencias del portal. El contrato compartido conserva conversión, estilos constantes y emisión de eventos; las diferencias de rendering nativo/Lit son explícitas.

## Estado y persistencia

Cada contador y cada demo mantienen su estado local. `lab-learning-progress` usa Lit y persistencia optativa en `lab-learning-progress-v2`. El esquema versionado guarda IDs de lecciones completadas, limita el denominador a las diecisiete disponibles y valida los datos al leer. Los datos v1 se leen como avance de la lección inicial cuando falta v2; esta migración de lectura no escribe hasta una acción posterior del usuario.

Se puede marcar/desmarcar una lección y borrar/desactivar el seguimiento, retirando ambas claves. Los fallos de lectura, guardado o borrado se comunican sin bloquear contenido. No hay autenticación, telemetría, sincronización entre dispositivos ni store global. Publicar más lecciones requiere ampliar el índice admitido; no se contabilizan capítulos pendientes ni se certifica aprendizaje.

## Diseño y recursos

Tokens CSS propios definen superficies, texto, acentos, espaciados y bordes para ambos temas. El diseño usa tipografía del sistema sin peticiones externas, CSS Grid, propiedades lógicas, foco visible, controles nativos, reduced motion y forced colors. Starlight sigue gestionando el selector de tema, búsqueda y menú responsive. La validación visual efectiva está pendiente; revisar código no sustituye navegador.

Mermaid se carga solo donde se usa `Diagram.astro`, con fuentes revisadas y alternativa textual. Marp genera HTML en `public/slides` antes del build; se enlaza desde lección, capítulo, recursos y laboratorio. Las salidas y `dist` se ignoran en Git.

## Entrega

Los scripts requieren dependencias locales de la versión declarada. La CI prepara instalación congelada, comprobaciones y tres motores Playwright en Ubuntu. Vercel está configurado para salida estática `dist`, con despliegues Git desactivados. El lockfile y el build están validados localmente; E2E y ejecución remota de CI siguen pendientes por el entorno.

Decisiones: [ADR-0001](adr/0001-static-portal.md), [ADR-0002](adr/0002-toolchain-and-support.md), [ADR-0003](adr/0003-skills-contract.md) y [ADR-0004](adr/0004-learning-experience.md). Resultados reales en [validación](validation.md).

## Evolución en PR-01

El [ADR-0005](adr/0005-using-web-components.md) incorpora el capítulo Using Web Components sin crear otro proyecto:

```text
content/docs/capitulos/01-using-web-components → components/using
components/using → envoltura lab-panel + ejemplos?raw + scripts de navegador
labs/using → examples/using + Lit
examples/frameworks → examples/using + React (solo en la demo React)
using-web-components (datos puros) → curriculum → progreso v2
```

Los ocho laboratorios comparten una estructura visual sencilla. La tarjeta de referencia publica propiedades, métodos, eventos, tokens y partes; el consumidor nunca modifica sus nodos shadow. El frame reexporta partes. El registro diferido es explícito y solo se deshace al crear un documento nuevo. Astro genera el contenido de la mejora progresiva; el elemento nativo mejora esos nodos sin un segundo renderer.

El capítulo 01 está disponible; los otros diez permanecen pendientes. Se conservan las URLs posteriores y una redirección estática para la primera. El progreso cuenta ocho lecciones disponibles, migra la lectura de v1 y conserva el consentimiento optativo. La nueva presentación se genera con el mismo script Marp. Las referencias locales y fragmentos se verifican sobre el build con `pnpm docs:check`.

## Capítulo 02: definición y lifecycle

`data/defining-web-components.ts` define las nueve lecciones y los ocho labs. `components/defining` compone navegación, mapa y el panel existente de PR-01; las fuentes se importan con `?raw` y las clases solo en scripts de navegador. `labs/defining` consume APIs públicas de `examples/defining`, sin dependencia inversa ni nuevas bibliotecas. Se reutilizan los estilos y el panel de laboratorios existentes.

El visualizador crea una sonda nativa separada de Lit. Las dos regiones vacías de montaje pertenecen al laboratorio: Lit gestiona sus contenedores, pero no genera sus hijos; únicamente ahí el consumidor inserta, mueve y retira la sonda. Los restantes nodos de Lit se actualizan mediante templates. El historial de 20 entradas procede de los callbacks de la sonda y se muestra como lista consultable, con estado breve aparte. La suscripción directa a la instancia y el listener externo se retiran al reiniciar o desconectar sus propietarios.

Los medidores nativo y Lit comparten normalización y contrato de datos, con diferencias explícitas de actualización y representación intermedia del atributo. La asignación de slots no modifica la propiedad de los hijos Light DOM. Las plantillas reciben datos con textContent. moveBefore y el built-in personalizado detectan soporte; nunca condicionan la navegación del portal.

La ruta antigua del capítulo 02 redirige estáticamente. Se añaden nueve IDs al esquema v2 de progreso sin cambiar clave ni perder los IDs publicados antes. No cambia el sistema de navegación ni se inicia PR-03. La presentación se descubre mediante el directorio Marp existente.

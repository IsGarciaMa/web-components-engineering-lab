---
title: Acerca del laboratorio
description: Cómo recorrer, ejecutar y ampliar esta academia abierta de Web Components y Lit.
---

Web Components Engineering Lab propone entender qué aporta el navegador y qué añade una biblioteca. La experiencia inicial puede recorrerse sin registro y sin activar el progreso local.

## Empieza aquí

1. Consulta [la ruta de aprendizaje](/ruta/) para ver los once capítulos, sus objetivos y su estado editorial.
2. Lee [Un contrato, dos contadores](/guias/contador/), la lección inicial disponible.
3. Compara las implementaciones en [el laboratorio](/laboratorios/contador/): vista funcional, código fuente y eventos.
4. Resuelve [el ejercicio](/ejercicios/contador/) y repasa [la presentación](/slides/foundation.html).

El capítulo [Using Web Components](/capitulos/01-using-web-components/) está publicado con siete lecciones. Los otros diez capítulos siguen pendientes. La lección de PR-00 conserva su papel de introducción. Cada capítulo se desarrolla en una PR propia.

## Ejecutar en local

Usa las versiones fijadas de Node y pnpm del repositorio. Instala las versiones del lockfile con `pnpm install --frozen-lockfile` y ejecuta `pnpm dev`. La búsqueda se genera durante el build; para probarla usa `pnpm build` y `pnpm preview`.

El README y `docs/environment.md` explican la instalación y las restricciones del entorno. `docs/validation.md` recoge qué comprobaciones se han ejecutado realmente.

## Progreso y privacidad

Puedes activar el progreso al final de la lección o en la ruta. Se guarda solo en el almacenamiento de este navegador, sin cuenta ni sincronización entre dispositivos. Puedes desmarcar la lección o borrar y desactivar el seguimiento. Si el navegador bloquea el almacenamiento, el contenido sigue disponible.

## Participar

El código se publica bajo MIT. El contenido es original en español y enlaza fuentes oficiales. Lee `AGENTS.md` y las Skills aplicables antes de modificar el proyecto. Todavía no hay una URL de repositorio configurada; se añadirá a la navegación cuando exista una dirección válida.

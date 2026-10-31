---
name: technical-education
description: 'Crea o revisa capítulos, explicaciones, ejercicios, diagramas y presentaciones originales del laboratorio con progresión pedagógica.'
---

# technical-education

Consulta el índice de capítulos para no adelantar contenidos sin contexto. Define audiencia, prerrequisitos, objetivos observables y qué podrá verificar el lector al terminar.

Para cada concepto relevante cubre, con la extensión que necesite:

1. Qué es y si pertenece a especificación, API de navegador, herramienta o abstracción.
2. Qué problema resuelve.
3. Cómo funciona, con secuencia o diagrama si facilita entenderlo.
4. Cuándo utilizarlo.
5. Cuándo evitarlo.
6. Implementación nativa cuando corresponda.
7. Implementación con Lit cuando corresponda, distinguiendo lo añadido por Lit.
8. Ventajas, limitaciones y errores frecuentes.
9. Ejemplo práctico verificable y criterios de aceptación.
10. Referencias oficiales y posibles preguntas de entrevista con razonamiento.

Coloca capítulos en `src/content/docs/capitulos`, código ejecutable en `src/examples`, diagramas con título/descripción en `diagrams`, decks Marp en `presentations` y ejercicios/soluciones separados en `exercises`. Importa código fuente o enlaza su ubicación para evitar snippets que diverjan silenciosamente.

Revisa que cada término nuevo esté explicado o enlazado. El ejercicio debe exigir una decisión, incluir comportamiento observable y tener una solución razonada. Evita preguntas que solo premien memorizar sintaxis.

Ejecuta los ejemplos y pruebas relacionados con el contenido modificado. Si cambia una presentación, comprueba su generación dentro del build de integración; no repitas el build completo por cada archivo. Reúne la validación integral una vez al cerrar el capítulo y reutiliza la evidencia de CI. Marca material futuro como pendiente y nunca presentes una demostración no ejecutada como verificada. Produce material original: no reproduzcas ni parafrasees contenido privado de BlueSpire; trabaja desde estándares públicos y experimentos propios.

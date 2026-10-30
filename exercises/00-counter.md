# Ejercicio de infraestructura: restablecer el contador

Objetivo: extender un contrato manteniendo equivalencia entre implementaciones.

Añade un botón «Restablecer» a ambos contadores. Una interacción debe poner `count` a cero y emitir exactamente un `count-change` solo si el valor cambia. Una asignación programática debe seguir siendo silenciosa.

Criterios de aceptación: funcionamiento con teclado, foco conservado, mismo contrato de evento, valor reflejado después del ciclo correspondiente y ausencia de eventos al restablecer cero. Prueba los dos componentes y su reconexión. No modifiques el DOM gestionado por Lit.

Consulta la solución solo después de proponer tus pruebas.

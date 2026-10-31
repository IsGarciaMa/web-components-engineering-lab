# Solución · Básico · Consumir y configurar

Importa `reading-card.ts` en el script del navegador, incluye `<lab-reading-card heading="Primera lectura">` y conserva una nota como hijo. Selecciona el host con `querySelector`, comprueba que existe y usa `setAttribute('heading', 'Lectura revisada')`. Espera `updateComplete` antes de verificar su texto y atributo. Quita `compact` con `removeAttribute()`; la presencia de una cadena “false” no representa el booleano falso.

No es necesario un listener global ni un wrapper para cambiar un atributo. El componente se encarga de interpretar el contrato.

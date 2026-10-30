# Solución razonada

En la implementación nativa, crea el botón una vez en el constructor. Su listener captura el valor anterior, asigna `this.count = 0` y llama a `emitCountChange` únicamente si el valor cambió.

En Lit, declara el botón en `render()` y enlaza `@click` a un método privado con la misma secuencia. Deja que el setter solicite la actualización. No uses `innerHTML` ni busques el botón desde `updated()`.

Prueba desde `count = 3`: enfoca «Restablecer», pulsa Enter y verifica cero, foco estable y un evento con `{ count: 0 }`. Repite y verifica que no aparece otro evento. Para Lit espera `updateComplete` antes de comprobar el output y el atributo. Comprueba también una asignación programática silenciosa.

No se incluye la extensión en el ejemplo de PR-00 para conservar pequeño el primer contrato.

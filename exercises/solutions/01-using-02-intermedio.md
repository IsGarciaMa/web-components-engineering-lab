# Solución · Intermedio · Datos, eventos y estilo

La función `connectExercise()` es una solución ejecutable: fija un atributo, asigna el objeto, escribe un token en el host y escucha solo eventos cuyo payload supera el guard. Devuelve `controller.abort()` para que el propietario retire la suscripción al desmontar.

Esta solución usa una variable porque cambia un valor documentado. Si necesitaras decorar el botón, emplearías `::part(action)`, sin buscarlo dentro de la raíz. Las pruebas llaman a la función real y comprueban el efecto de su limpieza.

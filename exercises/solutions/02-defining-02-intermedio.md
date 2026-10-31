# Solución · Intermedio · Tarjeta compuesta

La raíz contiene la estructura estable y los slots. El consumidor inserta sus hijos una sola vez; el navegador calcula la distribución. assignedNodes y assignedElements permiten inspeccionarla. El listener de la raíz vive con la propia raíz; no hay una suscripción global que retirar.

Fuente ejecutable: `src/examples/defining/slot-card.ts`.

Prueba el contrato con `tests/unit/defining-components.test.ts`; la distribución y el movimiento dependiente de soporte necesitan CI en navegador.

# Solución · Básico · Medidor con contrato

El atributo es la fuente de verdad. El getter interpreta el texto y el setter serializa solo si difiere. El callback actualiza el output sin volver a escribir el atributo. La recuperación de propiedades tempranas ocurre al conectar. El código publicado incluye el registro y el mapa de etiquetas para TypeScript.

Fuente ejecutable: `src/examples/defining/native-meter.ts`.

Prueba el contrato con `tests/unit/defining-components.test.ts`; la distribución y el movimiento dependiente de soporte necesitan CI en navegador.

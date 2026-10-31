# Solución · Avanzado · Recursos y reconexión

La función del listener mantiene identidad estable. La instancia conserva el Window donde se suscribió y lo limpia antes de instalar otro. Desconectar no destruye su estado. La sonda registra desde sus callbacks; el laboratorio escucha directamente esa instancia y deja de retenerla al reiniciar. No confunde señales externas con callbacks nativos.

Fuente ejecutable: `src/examples/defining/lifecycle-probe.ts`.

Prueba el contrato con `tests/unit/defining-lifecycle.test.ts`; la distribución y el movimiento dependiente de soporte necesitan CI en navegador.

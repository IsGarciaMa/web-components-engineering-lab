# Solución · Avanzado · Integración e inicialización

La integración React de referencia importa el registro antes de `createRoot`, pasa el objeto `reader`, escucha `onlesson-select` y usa una referencia para `reset()`. Desmonta su raíz al desconectar. La alternativa Astro asigna propiedades desde un script de navegador y retira listeners con funciones estables.

Para contenido imprescindible usa el patrón `static-summary`: genera texto en HTML y mejora su comportamiento después. No conviertas el host de la tarjeta React en una prueba de SSR. La solución debe explicar qué experiencia permanece si no hay JavaScript, además de conseguir que un clic funcione.

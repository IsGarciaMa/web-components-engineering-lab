# Solución · Avanzado · Tabs accesibles

La solución nativa mantiene un mapa por ID y sincroniza estados sin reconstruir todos los nodos. La versión Lit usa propiedades reactivas y repeat con claves. Comparten funciones puras de navegación, validación y protocolo; la restauración de foco depende de qué nodo ya pertenecía al widget. items se copia al asignar; selected refleja el ID efectivo tras configurar.

Fuente: `src/examples/dom/native-tabs.ts`. Pruebas: `tests/unit/dom-tabs.test.ts` y `tests/e2e/working-with-dom.spec.ts`.

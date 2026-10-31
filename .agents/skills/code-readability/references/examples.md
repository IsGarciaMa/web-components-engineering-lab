# Antes y después: legibilidad con intención

Los pares son fragmentos alternativos con el mismo contexto indicado. Los ejemplos “antes” están formateados para que la comparación muestre decisiones que Prettier no resuelve. No requieren modificar el portal.

## Guard clauses y llaves

Antes: la ruta válida queda escondida en niveles que no añaden significado.

```ts
function canOpenLesson(available: boolean, allowed: boolean): boolean {
  if (available) {
    if (allowed) {
      return true;
    }
  }
  return false;
}
```

Después: un guard termina la ruta inválida y la línea vacía separa esa decisión del resultado. Para una comprobación tan pequeña también sería válido `return available && allowed`; no extraigas más funciones.

```ts
function canOpenLesson(available: boolean, allowed: boolean): boolean {
  if (!available) {
    return false;
  }

  return allowed;
}
```

## Agrupar variables y transformaciones

Contexto de ambos fragmentos: `Lesson` contiene `title: string`, `available: boolean` y `minutes: number`. La selección y el orden permanecen iguales.

Antes: tres decisiones de selección y una transformación están comprimidas en una sola expresión conceptual.

```ts
const cards = lessons
  .filter(
    (lesson) =>
      lesson.available && lesson.minutes <= 30 && lesson.title.trim() !== '',
  )
  .map((lesson) => ({
    title: lesson.title.trim(),
    duration: `${lesson.minutes} min`,
  }));
```

Después: los nombres explican qué se selecciona; las variables relacionadas permanecen juntas. El helper nombra la política de selección, no existe únicamente para reducir líneas.

```ts
function fitsShortReadingSession(lesson: Lesson): boolean {
  const isPublished = lesson.available;
  const fitsTimeBudget = lesson.minutes <= 30;
  const hasTitle = lesson.title.trim() !== '';

  return isPublished && fitsTimeBudget && hasTitle;
}

const shortLessons = lessons.filter(fitsShortReadingSession);
const cards = shortLessons.map((lesson) => ({
  title: lesson.title.trim(),
  duration: `${lesson.minutes} min`,
}));
```

No apliques esta expansión a una cadena evidente con un predicado trivial.

## Opciones en una API que estás diseñando

Antes: obliga a memorizar la posición y significado de dos booleanos.

```ts
updatePreview(true, false);
```

Después: si eres propietario de esa API, un objeto de opciones comunica la intención. Si es una API de una biblioteca, conserva su contrato y usa nombres locales o un adaptador justificado.

```ts
updatePreview({ preserveFocus: true, announceChange: false });
```

## Imports de tipos y registro

Contexto: el módulo registra `lab-reading-card` al evaluarse. La función `inspectCard` solo usa `ReadingCard` como tipo.

Antes: depende de un import ambiguo que un transformador puede eliminar como uso exclusivo de tipo.

```ts
import { ReadingCard } from '../../examples/using/reading-card';

function inspectCard(card: ReadingCard): string {
  return card.heading;
}
```

Después: hace explícito el efecto requerido y el contrato estático. No ordenes imports por alfabeto si cambia ese orden de inicialización.

```ts
import '../../examples/using/reading-card';
import type { ReadingCard } from '../../examples/using/reading-card';

function inspectCard(card: ReadingCard): string {
  return card.heading;
}
```

Con imports mixtos, `import { normalizeReader, type Reader } from '…'` también es válido.

## Asincronía y errores

Contexto: `parseTitles(value: unknown): readonly string[]` valida el payload y lanza un error si su esquema no es válido.

Antes: el encadenamiento mezcla ejecución y validación; el catch oculta cualquier fallo como una lista vacía.

```ts
function loadTitles(url: URL): Promise<readonly string[]> {
  return fetch(url)
    .then((response) => response.json())
    .then(parseTitles)
    .catch(() => []);
}
```

Después: separa la respuesta HTTP del payload y conserva la causa. Aquí hay una corrección funcional deliberada: los errores dejan de parecer un resultado vacío exitoso. Si el fallback anterior fuese parte del contrato público, no lo elimines bajo la etiqueta de legibilidad.

```ts
async function loadTitles(url: URL): Promise<readonly string[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload: unknown = await response.json();

    return parseTitles(payload);
  } catch (error) {
    throw new Error('No se pudieron cargar los títulos.', { cause: error });
  }
}
```

## Lit: handler, render y estado

Fragmentos de una clase Lit con `readerName: string` y `message: string` reactivos. Ambos actualizan el mensaje solo por la interacción, nunca al ejecutar `render()`.

Antes: la interpolación contiene la decisión y su efecto, dificultando leer la estructura del template.

```ts
protected override render() {
  return html`<button
    type="button"
    @click=${() => {
      const name = this.readerName.trim();
      if (name === '') {
        this.message = 'Indica un nombre.';
      } else {
        this.message = `Lectura preparada para ${name}.`;
      }
    }}
  >
    Preparar lectura
  </button>`;
}
```

Después: el handler nombra la operación, contiene su validación y el template conserva una estructura reconocible. Un callback de una asignación no necesitaría esta extracción.

```ts
private prepareReading(): void {
  const name = this.readerName.trim();
  if (name === '') {
    this.message = 'Indica un nombre.';
    return;
  }

  this.message = `Lectura preparada para ${name}.`;
}

protected override render() {
  return html`
    <button type="button" @click=${this.prepareReading}>
      Preparar lectura
    </button>
  `;
}
```

El binding de Lit conserva el contexto de los métodos usados como handlers. No cambies un método utilizado como callback de otra API sin revisar cómo recibe `this`.

## Lifecycle: identidad y limpieza

Fragmentos de un consumidor Lit que necesita escuchar `lesson-refresh` en `document`. `message` es estado reactivo.

Antes: parece simétrico, pero cada flecha crea una función distinta y la limpieza no retira el listener registrado.

```ts
override connectedCallback(): void {
  super.connectedCallback();
  document.addEventListener('lesson-refresh', () => {
    this.message = 'Contenido actualizado.';
  });
}

override disconnectedCallback(): void {
  document.removeEventListener('lesson-refresh', () => {
    this.message = 'Contenido actualizado.';
  });
  super.disconnectedCallback();
}
```

Después: la función estable muestra qué recurso se instala y se retira. Añade listeners globales solo cuando el caso realmente los necesite; no copies este patrón para un botón gestionado por Lit.

```ts
private readonly handleRefresh = (): void => {
  this.message = 'Contenido actualizado.';
};

override connectedCallback(): void {
  super.connectedCallback();
  document.addEventListener('lesson-refresh', this.handleRefresh);
}

override disconnectedCallback(): void {
  document.removeEventListener('lesson-refresh', this.handleRefresh);
  super.disconnectedCallback();
}
```

No extraigas un Reactive Controller para este único caso sin necesidad de reutilización.

## CSS dentro de Lit

Antes: selectores de ámbito, layout y foco se suceden sin bloques de intención.

```css
:host {
  display: block;
}
.actions {
  display: flex;
  gap: 1rem;
}
button:focus-visible {
  outline: 3px solid currentColor;
}
```

Después: las separaciones diferencian responsabilidades; no hay una línea vacía después de cada declaración CSS. Las reglas y su orden siguen siendo los mismos.

```css
:host {
  display: block;
}

.actions {
  display: flex;
  gap: 1rem;
}

button:focus-visible {
  outline: 3px solid currentColor;
}
```

## Tests: preparar, actuar y observar

Fragmentos Vitest con `createCard()` que devuelve una tarjeta conectada, `action(card)` que devuelve su botón y `vi`/`expect` importados. Los dos comprueban el mismo contrato.

Antes: las fases están juntas aunque tengan intenciones diferentes.

```ts
const card = await createCard();
const onSelection = vi.fn();
card.addEventListener('lesson-select', onSelection);
action(card).click();
await card.updateComplete;
expect(card.selected).toBe(true);
expect(onSelection).toHaveBeenCalledTimes(1);
```

Después: la preparación, interacción y observación se identifican al recorrer el test. No separa cada declaración ni añade esperas artificiales.

```ts
const card = await createCard();
const onSelection = vi.fn();
card.addEventListener('lesson-select', onSelection);

action(card).click();
await card.updateComplete;

expect(card.selected).toBe(true);
expect(onSelection).toHaveBeenCalledTimes(1);
```

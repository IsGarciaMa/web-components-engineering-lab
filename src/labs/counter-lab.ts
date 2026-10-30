export class CounterLab extends HTMLElement {
  #sequence = 0;

  connectedCallback(): void {
    this.addEventListener('count-change', this.#record);
    this.querySelector('[data-clear-events]')?.addEventListener(
      'click',
      this.#clear,
    );
  }

  disconnectedCallback(): void {
    this.removeEventListener('count-change', this.#record);
    this.querySelector('[data-clear-events]')?.removeEventListener(
      'click',
      this.#clear,
    );
  }

  readonly #record = (event: Event): void => {
    if (
      !(event instanceof CustomEvent) ||
      !(event.target instanceof HTMLElement)
    )
      return;
    // Valida el payload de los eventos antes de representarlo como texto.
    const detail: unknown = event.detail;
    if (
      typeof detail !== 'object' ||
      detail === null ||
      !('count' in detail) ||
      typeof detail.count !== 'number' ||
      !Number.isSafeInteger(detail.count)
    )
      return;
    const tag = event.target.localName;
    if (tag !== 'lab-native-counter' && tag !== 'lab-lit-counter') return;
    const log = this.querySelector('[data-event-log]');
    const summary = this.querySelector('[data-event-summary]');
    if (!log || !summary) return;
    this.#sequence += 1;
    const row = document.createElement('li');
    row.textContent = `#${this.#sequence} · ${tag === 'lab-native-counter' ? 'Nativo' : 'Lit'} · count-change · { count: ${detail.count} } · bubbles: ${event.bubbles} · composed: ${event.composed}`;
    log.prepend(row);
    while (log.children.length > 8) log.lastElementChild?.remove();
    summary.textContent = `Último evento: ${tag === 'lab-native-counter' ? 'Nativo' : 'Lit'}, count = ${detail.count}.`;
  };

  readonly #clear = (): void => {
    this.querySelector('[data-event-log]')?.replaceChildren();
    const summary = this.querySelector('[data-event-summary]');
    if (summary)
      summary.textContent =
        'Registro limpio. Los valores de los contadores se conservan.';
    this.#sequence = 0;
  };
}

if (!customElements.get('lab-counter-lab'))
  customElements.define('lab-counter-lab', CounterLab);

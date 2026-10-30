import {
  counterStyles,
  emitCountChange,
  normalizeCount,
} from '../shared/counter-contract';

export class NativeCounter extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['count'];
  }

  #count = 0;
  readonly #output = document.createElement('output');
  readonly #button = document.createElement('button');

  constructor() {
    super();

    const root = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = counterStyles;

    const wrapper = document.createElement('div');
    wrapper.className = 'counter';
    this.#output.setAttribute('aria-label', 'Valor del contador');
    this.#output.setAttribute('aria-live', 'polite');
    this.#output.setAttribute('aria-atomic', 'true');
    this.#button.type = 'button';
    this.#button.textContent = 'Incrementar';
    // Owned shadow nodes live as long as the element; no global listeners to clean up.
    this.#button.addEventListener('click', () => {
      const previous = this.count;
      this.count += 1;
      if (this.count !== previous) emitCountChange(this, this.count);
    });
    wrapper.append(this.#output, this.#button);
    root.append(style, wrapper);
    this.#render();
  }

  get count(): number {
    return this.#count;
  }

  set count(value: number) {
    this.#count = normalizeCount(value);
    const serialized = String(this.#count);
    if (this.getAttribute('count') !== serialized)
      this.setAttribute('count', serialized);
    this.#render();
  }

  connectedCallback(): void {
    // Recover assignments made before customElements.define upgraded this element.
    if (Object.prototype.hasOwnProperty.call(this, 'count')) {
      const value = this.count;
      delete (this as Partial<NativeCounter>).count;
      this.count = value;
    }
    this.#render();
  }

  attributeChangedCallback(
    _name: string,
    _previous: string | null,
    value: string | null,
  ): void {
    // Initial attribute reactions must not overwrite a consumer's pre-upgrade property.
    if (Object.prototype.hasOwnProperty.call(this, 'count')) return;
    this.count = normalizeCount(value);
  }

  #render(): void {
    this.#output.textContent = String(this.count);
    this.#button.disabled = this.count === Number.MAX_SAFE_INTEGER;
  }
}

if (!customElements.get('lab-native-counter'))
  customElements.define('lab-native-counter', NativeCounter);

declare global {
  interface HTMLElementTagNameMap {
    'lab-native-counter': NativeCounter;
  }
}

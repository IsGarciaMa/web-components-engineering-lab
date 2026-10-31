/** API: value se normaliza a 0–100; muted es booleano por presencia. */
export function normalizeValue(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(100, Math.max(0, number)) : 0;
}

export class NativeMeter extends HTMLElement {
  static observedAttributes = ['value', 'muted'];
  readonly #output = document.createElement('output');

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      :host { display: block; padding: 1rem; border: 2px solid currentColor;
        border-radius: .6rem; color: var(--meter-accent, inherit); }
      :host([muted]) { border-style: dashed; }
      output { font: inherit; font-weight: 700; }
    `;
    this.#output.setAttribute('aria-label', 'Nivel nativo');
    root.append(style, this.#output);
  }

  get value(): number {
    return normalizeValue(this.getAttribute('value'));
  }

  set value(value: number) {
    const serialized = String(normalizeValue(value));
    if (this.getAttribute('value') !== serialized) {
      this.setAttribute('value', serialized);
    }
  }

  get muted(): boolean {
    return this.hasAttribute('muted');
  }

  set muted(value: boolean) {
    this.toggleAttribute('muted', Boolean(value));
  }

  connectedCallback(): void {
    // Recupera propiedades propias asignadas antes del upgrade.
    for (const key of ['value', 'muted'] as const) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        const value = this[key];
        // Son propiedades propias configurables creadas por el consumidor.
        Reflect.deleteProperty(this, key);
        if (key === 'value') {
          this.value = normalizeValue(value);
        } else {
          this.muted = Boolean(value);
        }
      }
    }
    this.#render();
  }

  attributeChangedCallback(): void {
    this.#render();
  }

  #render(): void {
    this.#output.textContent = `${this.value} / 100${this.muted ? ' · silenciado' : ''}`;
  }
}

if (!customElements.get('lab-native-meter')) {
  customElements.define('lab-native-meter', NativeMeter);
}

declare global {
  interface HTMLElementTagNameMap {
    'lab-native-meter': NativeMeter;
  }
}

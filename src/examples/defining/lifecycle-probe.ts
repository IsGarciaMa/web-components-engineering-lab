export interface LifecycleEntry {
  sequence: number;
  callback: string;
  detail: string;
}

/** Emite lifecycle-activity al registrar callbacks reales. Conserva 20 entradas. */
export class LifecycleProbe extends HTMLElement {
  static observedAttributes = ['label'];
  readonly #entries: LifecycleEntry[] = [];
  readonly #output = document.createElement('p');
  #sequence = 0;
  #pings = 0;
  #listeningWindow: Window | null = null;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(this.#output);
    this.#record('constructor', 'Instancia creada; aún no presupone conexión.');
  }

  get activity(): readonly LifecycleEntry[] {
    return this.#entries.slice();
  }

  get pingCount(): number {
    return this.#pings;
  }

  readonly #onPing = (): void => {
    this.#pings += 1;
    this.#render();
  };

  connectedCallback(): void {
    this.#stopListening();
    this.#listeningWindow = this.ownerDocument.defaultView;
    this.#listeningWindow?.addEventListener('lab-probe-ping', this.#onPing);
    this.#render();
    this.#record('connectedCallback', 'Listener externo conectado.');
  }

  disconnectedCallback(): void {
    this.#stopListening();
    this.#record('disconnectedCallback', 'Listener externo retirado.');
  }

  adoptedCallback(): void {
    this.#record('adoptedCallback', 'ownerDocument ha cambiado.');
  }

  connectedMoveCallback(): void {
    this.#record(
      'connectedMoveCallback',
      'Movimiento con preservación de estado.',
    );
  }

  attributeChangedCallback(
    name: string,
    previous: string | null,
    next: string | null,
  ): void {
    this.#render();
    this.#record(
      'attributeChangedCallback',
      `${name}: ${JSON.stringify(previous)} → ${JSON.stringify(next)}`,
    );
  }

  #stopListening(): void {
    this.#listeningWindow?.removeEventListener('lab-probe-ping', this.#onPing);
    this.#listeningWindow = null;
  }

  #render(): void {
    this.#output.textContent = `${this.getAttribute('label') ?? 'Sonda'} · señales recibidas: ${this.#pings}`;
  }

  #record(callback: string, detail: string): void {
    this.#entries.push({ sequence: ++this.#sequence, callback, detail });
    if (this.#entries.length > 20) {
      this.#entries.shift();
    }
    // No se usa un evento global: el consumidor escucha directamente esta instancia.
    this.dispatchEvent(new CustomEvent('lifecycle-activity'));
  }
}

if (!customElements.get('lab-lifecycle-probe')) {
  customElements.define('lab-lifecycle-probe', LifecycleProbe);
}

declare global {
  interface HTMLElementTagNameMap {
    'lab-lifecycle-probe': LifecycleProbe;
  }
}

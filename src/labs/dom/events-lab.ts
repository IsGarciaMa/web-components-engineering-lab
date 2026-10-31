import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';
import { EventProbe } from '../../examples/dom/event-probe';
import { labStyles } from '../using/lab-styles';

function describeTarget(target: EventTarget | null): string {
  if (target instanceof ShadowRoot) {
    return '#shadow-root';
  }
  if (target instanceof Element) {
    return target.localName;
  }
  if (target instanceof Document) {
    return '#document';
  }
  if (target instanceof Window) {
    return 'window';
  }
  return String(target);
}

export class DomEventsLab extends LitElement {
  static override styles = [
    labStyles,
    css`
      li {
        overflow-wrap: anywhere;
        margin-block: 0.75rem;
      }
    `,
  ];
  @state() private bubblesFlag = true;
  @state() private composedFlag = true;
  @state() private cancelableFlag = true;
  @state() private prevent = false;
  @state() private rows: readonly string[] = [];
  #cleanups: (() => void)[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.hasUpdated) {
      this.listen();
    }
  }
  protected override firstUpdated(): void {
    this.listen();
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup();
  }

  private cleanup(): void {
    for (const cleanup of this.#cleanups) {
      cleanup();
    }
    this.#cleanups = [];
  }

  private listen(): void {
    this.cleanup();
    const probe = this.renderRoot.querySelector('lab-event-probe');
    const wrapper = this.renderRoot.querySelector('[data-consumer]');
    const root = probe?.shadowRoot;
    const button = root?.querySelector('button');
    if (!(probe instanceof EventProbe) || !wrapper || !root || !button) {
      return;
    }
    for (const [label, target] of [
      ['consumidor', wrapper],
      ['host', probe],
      ['raíz', root],
      ['emisor', button],
    ] as const) {
      for (const capture of [true, false]) {
        const listener = (event: Event): void => {
          // snapshot síncrono: currentTarget y composedPath dejan de representar este punto al salir.
          if (this.prevent && target === button && !capture) {
            event.preventDefault();
          }
          const row = `${label} (${capture ? 'capture' : 'bubble'}): fase ${event.eventPhase}; target ${describeTarget(event.target)}; currentTarget ${describeTarget(event.currentTarget)}; flags ${event.bubbles}/${event.composed}/${event.cancelable}; detail ${JSON.stringify(event instanceof CustomEvent ? event.detail : null)}; defaultPrevented ${event.defaultPrevented}; path ${event.composedPath().map(describeTarget).join(' → ')}`;
          this.rows = [...this.rows, row].slice(-12);
        };
        target.addEventListener('dom-probe', listener, capture);
        this.#cleanups.push(() =>
          target.removeEventListener('dom-probe', listener, capture),
        );
      }
    }
  }

  protected override render() {
    return html`<div class="controls">
        <label class="check"
          ><input
            type="checkbox"
            .checked=${this.bubblesFlag}
            @change=${() => {
              this.bubblesFlag = !this.bubblesFlag;
            }}
          />bubbles</label
        >
        <label class="check"
          ><input
            type="checkbox"
            .checked=${this.composedFlag}
            @change=${() => {
              this.composedFlag = !this.composedFlag;
            }}
          />composed</label
        >
        <label class="check"
          ><input
            type="checkbox"
            .checked=${this.cancelableFlag}
            @change=${() => {
              this.cancelableFlag = !this.cancelableFlag;
            }}
          />cancelable</label
        >
        <label class="check"
          ><input
            type="checkbox"
            .checked=${this.prevent}
            @change=${() => {
              this.prevent = !this.prevent;
            }}
          />Llamar preventDefault</label
        >
        <button
          type="button"
          @click=${() => {
            this.rows = [];
          }}
        >
          Vaciar registro de eventos
        </button>
      </div>
      <div data-consumer>
        <lab-event-probe
          .bubbles=${this.bubblesFlag}
          .composed=${this.composedFlag}
          .cancelable=${this.cancelableFlag}
        ></lab-event-probe>
      </div>
      <p role="status">
        ${this.rows.length} observaciones, máximo 12. Cada listener registra su
        fase real.
      </p>
      <ol aria-label="Recorrido del evento">
        ${this.rows.map((row) => html`<li>${row}</li>`)}
      </ol>`;
  }
}
if (!customElements.get('lab-dom-events')) {
  customElements.define('lab-dom-events', DomEventsLab);
}

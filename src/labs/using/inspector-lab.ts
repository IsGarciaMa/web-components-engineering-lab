import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import '../../examples/using/reading-card';
import { isLessonSelection } from '../../examples/using/selection-contract';
import { labStyles } from './lab-styles';

export class InspectorLab extends LitElement {
  @property({ type: Boolean, attribute: 'events-only' }) eventsOnly = false;
  @state() private snapshot =
    'Pulsa Leer contrato para consultar atributo y propiedad.';
  @state() private events: readonly string[] = [];
  @state() private listening = true;
  static override styles = labStyles;
  private get card() {
    return this.renderRoot.querySelector('lab-reading-card');
  }

  private async inspect(): Promise<void> {
    const card = this.card;
    if (!card) return;
    await card.updateComplete;
    this.snapshot = JSON.stringify(
      {
        attribute: card.getAttribute('heading'),
        property: card.heading,
        reader: card.reader,
        readerAttribute: card.getAttribute('reader'),
        compactAttribute: card.getAttribute('compact'),
        compactProperty: card.compact,
        selected: card.selected,
      },
      null,
      2,
    );
  }
  private record(event: Event): void {
    if (!this.listening || !isLessonSelection(event)) return;
    this.events = [
      JSON.stringify({
        type: event.type,
        detail: event.detail,
        bubbles: event.bubbles,
        composed: event.composed,
      }),
      ...this.events,
    ].slice(0, 5);
  }
  protected override render() {
    return html`<div class="controls">
        ${this.eventsOnly
          ? ''
          : html` <button
                type="button"
                @click=${() => {
                  this.card?.setAttribute('heading', 'Desde atributo');
                  void this.inspect();
                }}
              >
                Escribir atributo
              </button>
              <button
                type="button"
                @click=${() => {
                  const card = this.card;
                  if (card) card.reader = { name: 'Ada' };
                  void this.inspect();
                }}
              >
                Asignar objeto
              </button>
              <button
                type="button"
                @click=${() => {
                  const card = this.card;
                  if (card) card.compact = !card.compact;
                  void this.inspect();
                }}
              >
                Alternar compact
              </button>
              <button
                type="button"
                @click=${() => {
                  this.card?.reset();
                  void this.inspect();
                }}
              >
                Llamar reset()
              </button>
              <button type="button" @click=${this.inspect}>
                Leer contrato
              </button>`}
        <button
          type="button"
          aria-pressed=${this.listening}
          @click=${() => {
            this.listening = !this.listening;
          }}
        >
          Escuchar eventos
        </button>
        <button
          type="button"
          @click=${() => {
            this.events = [];
          }}
        >
          Limpiar eventos
        </button>
      </div>
      <lab-reading-card @lesson-select=${this.record}></lab-reading-card>
      ${this.eventsOnly
        ? ''
        : html`<pre aria-label="Instantánea del contrato">
${this.snapshot}</pre
          >`}
      <p role="status">
        ${this.listening ? 'Escucha activa.' : 'Escucha pausada.'}
        ${this.events.length} eventos mostrados (máximo 5).
      </p>
      <ol aria-label="Eventos recibidos">
        ${this.events.map((event) => html`<li><pre>${event}</pre></li>`)}
      </ol>`;
  }
}
if (!customElements.get('lab-inspector-lab'))
  customElements.define('lab-inspector-lab', InspectorLab);

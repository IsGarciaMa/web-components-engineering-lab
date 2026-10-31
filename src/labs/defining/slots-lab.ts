import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { SlotCard } from '../../examples/defining/slot-card';
import { labStyles } from '../using/lab-styles';

export class SlotsLab extends LitElement {
  static override styles = labStyles;
  @state() private draftTitle = 'Contenido del consumidor';
  @state() private showTitle = true;
  @state() private showBody = true;
  @state() private result = 'La distribución se consulta tras slotchange.';
  @state() private changes = 0;

  private inspect(): void {
    const card = this.renderRoot.querySelector('lab-slot-card');
    if (card instanceof SlotCard) {
      this.result = JSON.stringify(card.inspectSlots());
    }
  }

  private onComposition(): void {
    this.changes += 1;
    this.inspect();
  }

  protected override render() {
    return html`<div class="controls">
        <label
          >Título proyectado<input
            maxlength="80"
            .value=${this.draftTitle}
            @input=${(event: Event) => {
              if (event.target instanceof HTMLInputElement) {
                this.draftTitle = event.target.value;
              }
            }}
        /></label>
        <button
          type="button"
          @click=${() => {
            this.showTitle = !this.showTitle;
          }}
        >
          Alternar título asignado
        </button>
        <button
          type="button"
          @click=${() => {
            this.showBody = !this.showBody;
          }}
        >
          Alternar contenido
        </button>
        <button type="button" @click=${this.inspect}>
          Consultar asignación
        </button>
      </div>
      <lab-slot-card @composition-change=${this.onComposition}
        >${this.showTitle
          ? html`<span slot="title">${this.draftTitle}</span>`
          : null}${this.showBody
          ? html`<p>Este párrafo sigue en el Light DOM.</p>`
          : null}</lab-slot-card
      >
      <p role="status">
        ${this.result} · slotchange recibidos: ${this.changes}
      </p>
      <p>
        Cambiar texto dentro del mismo span no cambia la asignación. Retirar el
        span sí permite ver el fallback.
      </p>`;
  }
}
if (!customElements.get('lab-slots-lab')) {
  customElements.define('lab-slots-lab', SlotsLab);
}

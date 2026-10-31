import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';
import '../../examples/using/card-frame';
import { labStyles } from './lab-styles';
export class PartsLab extends LitElement {
  @state() private customized = false;
  static override styles = [
    labStyles,
    css`
      .custom lab-reading-card::part(action),
      .custom lab-card-frame::part(card-action) {
        border-style: dashed;
        border-width: 3px;
      }
      .custom lab-reading-card::part(surface),
      .custom lab-card-frame::part(card-surface) {
        border-radius: 1.5rem;
      }
    `,
  ];
  protected override render() {
    return html`<div class="controls">
        <button
          type="button"
          aria-pressed=${this.customized}
          @click=${() => {
            this.customized = !this.customized;
          }}
        >
          Aplicar CSS Parts
        </button>
      </div>
      <div class=${this.customized ? 'pair custom' : 'pair'}>
        <lab-reading-card heading="Parte pública directa"
          ><p class="note">
            Un hijo asignado al slot; sin clonar.
          </p></lab-reading-card
        >
        <lab-card-frame></lab-card-frame>
      </div>
      <p role="status">
        ${this.customized
          ? 'Partes personalizadas: botones discontinuos y superficie redondeada.'
          : 'Estilos originales. El frame reexporta las partes de su tarjeta.'}
      </p>`;
  }
}
if (!customElements.get('lab-parts-lab'))
  customElements.define('lab-parts-lab', PartsLab);

import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import '@awesome.me/webawesome/dist/components/button/button.js';
import { labStyles } from './lab-styles';

export class LibraryLab extends LitElement {
  @state() private disabled = false;
  @state() private clicks = 0;
  static override styles = labStyles;
  protected override render() {
    return html`<div class="controls">
        <label class="check"
          ><input
            type="checkbox"
            .checked=${this.disabled}
            @change=${(e: Event) => {
              if (e.target instanceof HTMLInputElement)
                this.disabled = e.target.checked;
            }}
          />Desactivar componente</label
        >
      </div>
      <wa-button
        variant="brand"
        ?disabled=${this.disabled}
        @click=${() => {
          this.clicks += 1;
        }}
        >Confirmar con Web Awesome</wa-button
      >
      <p role="status">
        ${this.clicks} activaciones · disabled = ${this.disabled}.
        ${customElements.get('wa-button')
          ? 'wa-button registrado.'
          : 'Registro pendiente.'}
      </p>`;
  }
}
if (!customElements.get('lab-library-lab'))
  customElements.define('lab-library-lab', LibraryLab);

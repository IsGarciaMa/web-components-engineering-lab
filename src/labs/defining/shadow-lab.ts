import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';
import '../../examples/defining/shadow-frames';
import { labStyles } from '../using/lab-styles';

export class ShadowLab extends LitElement {
  static override styles = [
    labStyles,
    css`
      .colored {
        --frame-accent: var(--lab-accent);
      }
      .explorer > p {
        border-inline-start: 4px solid currentColor;
        padding-inline-start: 0.75rem;
      }
    `,
  ];
  @state() private colored = false;
  @state() private result = 'Pulsa Inspeccionar para consultar shadowRoot.';

  private inspect(): void {
    const open = this.renderRoot.querySelector('lab-open-frame');
    const closed = this.renderRoot.querySelector('lab-closed-frame');
    this.result = `open.shadowRoot: ${open?.shadowRoot?.mode ?? 'null'}; closed.shadowRoot: ${closed?.shadowRoot === null ? 'null' : 'no disponible'}. Ambos siguen renderizando su contenido.`;
  }

  protected override render() {
    return html`<div class="controls">
        <button type="button" @click=${this.inspect}>
          Inspeccionar raíces
        </button>
        <label class="check"
          ><input
            type="checkbox"
            .checked=${this.colored}
            @change=${() => {
              this.colored = !this.colored;
            }}
          />Heredar token de color</label
        >
      </div>
      <div class=${this.colored ? 'explorer colored' : 'explorer'}>
        <p>Párrafo del árbol del laboratorio: recibe el selector exterior.</p>
        <div class="pair">
          <lab-open-frame></lab-open-frame><lab-closed-frame></lab-closed-frame>
        </div>
      </div>
      <p role="status">${this.result}</p>`;
  }
}
if (!customElements.get('lab-shadow-lab')) {
  customElements.define('lab-shadow-lab', ShadowLab);
}

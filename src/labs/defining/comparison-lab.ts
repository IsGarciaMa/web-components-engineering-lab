import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { NativeMeter } from '../../examples/defining/native-meter';
import { LitMeter } from '../../examples/defining/lit-meter';
import { labStyles } from '../using/lab-styles';

export class ComparisonLab extends LitElement {
  static override styles = labStyles;
  @state() private value = 35;
  @state() private accented = false;
  @state() private result = 'Ambos elementos parten de 35.';

  private async updateMeters(): Promise<void> {
    const native = this.renderRoot.querySelector('lab-native-meter');
    const lit = this.renderRoot.querySelector('lab-lit-meter');
    if (!(native instanceof NativeMeter) || !(lit instanceof LitMeter)) {
      return;
    }
    native.value = this.value;
    lit.value = this.value;
    const nativeNow = native.shadowRoot?.querySelector('output')?.textContent;
    const litNow = lit.shadowRoot?.querySelector('output')?.textContent;
    await lit.updateComplete;
    this.result = `Inmediatamente: nativo «${nativeNow}», Lit «${litNow}». Tras updateComplete: Lit «${lit.shadowRoot?.querySelector('output')?.textContent}».`;
  }

  protected override render() {
    return html`<div class="controls">
        <label
          >Valor compartido<input
            type="number"
            min="0"
            max="100"
            .value=${String(this.value)}
            @input=${(event: Event) => {
              if (event.target instanceof HTMLInputElement) {
                this.value = Number(event.target.value);
              }
            }}
        /></label>
        <button type="button" @click=${this.updateMeters}>
          Actualizar ambos
        </button>
        <label class="check"
          ><input
            type="checkbox"
            .checked=${this.accented}
            @change=${() => {
              this.accented = !this.accented;
            }}
          />Aplicar token de color</label
        >
      </div>
      <div
        class="pair"
        style=${this.accented ? '--meter-accent: var(--lab-accent)' : ''}
      >
        <section aria-label="Implementación nativa">
          <h3>Nativo</h3>
          <lab-native-meter value="35"></lab-native-meter>
        </section>
        <section aria-label="Implementación Lit">
          <h3>Lit</h3>
          <lab-lit-meter value="35"></lab-lit-meter>
        </section>
      </div>
      <p role="status">${this.result}</p>`;
  }
}
if (!customElements.get('lab-comparison-lab')) {
  customElements.define('lab-comparison-lab', ComparisonLab);
}

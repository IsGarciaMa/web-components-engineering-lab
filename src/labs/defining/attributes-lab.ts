import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { NativeMeter } from '../../examples/defining/native-meter';
import { labStyles } from '../using/lab-styles';

export class AttributesLab extends LitElement {
  static override styles = labStyles;
  @state() private input = '25';
  @state() private result = 'Sin escrituras del consumidor todavía.';

  private apply(mode: 'attribute' | 'property' | 'remove' | 'boolean'): void {
    const meter = this.renderRoot.querySelector('lab-native-meter');
    if (!(meter instanceof NativeMeter)) {
      return;
    }
    if (mode === 'attribute') {
      meter.setAttribute('value', this.input);
    }
    if (mode === 'property') {
      meter.value = Number(this.input);
    }
    if (mode === 'remove') {
      meter.removeAttribute('value');
    }
    if (mode === 'boolean') {
      meter.setAttribute('muted', 'false');
    }
    this.result = JSON.stringify({
      attribute: meter.getAttribute('value'),
      property: meter.value,
      mutedAttribute: meter.getAttribute('muted'),
      mutedProperty: meter.muted,
    });
  }

  protected override render() {
    return html`<div class="controls">
        <label
          >Entrada de value<input
            maxlength="40"
            .value=${this.input}
            @input=${(event: Event) => {
              if (event.target instanceof HTMLInputElement) {
                this.input = event.target.value;
              }
            }}
        /></label>
        <button type="button" @click=${() => this.apply('attribute')}>
          Escribir atributo
        </button>
        <button type="button" @click=${() => this.apply('property')}>
          Asignar propiedad
        </button>
        <button type="button" @click=${() => this.apply('remove')}>
          Eliminar atributo
        </button>
        <button type="button" @click=${() => this.apply('boolean')}>
          Escribir muted="false"
        </button>
      </div>
      <lab-native-meter></lab-native-meter>
      <pre role="status">${this.result}</pre>
      <p>
        El atributo conserva texto externo. El getter interpreta y normaliza; el
        setter de propiedad serializa un valor normalizado. muted="false" sigue
        siendo presencia verdadera.
      </p>`;
  }
}
if (!customElements.get('lab-attributes-lab')) {
  customElements.define('lab-attributes-lab', AttributesLab);
}

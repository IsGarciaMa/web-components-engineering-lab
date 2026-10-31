import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { normalizeValue } from './native-meter';

/** Mismo contrato de datos que NativeMeter; el DOM se actualiza asíncronamente. */
export class LitMeter extends LitElement {
  static override styles = css`
    :host {
      display: block;
      padding: 1rem;
      border: 2px solid currentColor;
      border-radius: 0.6rem;
      color: var(--meter-accent, inherit);
    }
    :host([muted]) {
      border-style: dashed;
    }
    output {
      font: inherit;
      font-weight: 700;
    }
  `;

  #value = 0;

  @property({
    type: Number,
    reflect: true,
    converter: { fromAttribute: normalizeValue, toAttribute: String },
  })
  get value(): number {
    return this.#value;
  }

  set value(value: number) {
    this.#value = normalizeValue(value);
  }

  @property({ type: Boolean, reflect: true }) muted = false;

  protected override render() {
    return html`<output aria-label="Nivel Lit"
      >${this.value} / 100${this.muted ? ' · silenciado' : ''}</output
    >`;
  }
}

if (!customElements.get('lab-lit-meter')) {
  customElements.define('lab-lit-meter', LitMeter);
}

declare global {
  interface HTMLElementTagNameMap {
    'lab-lit-meter': LitMeter;
  }
}

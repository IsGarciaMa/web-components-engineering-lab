import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import {
  counterStyles,
  emitCountChange,
  normalizeCount,
} from '../shared/counter-contract';

export class LitCounter extends LitElement {
  // unsafeCSS receives a local constant only, never user input.
  static override styles = css`
    ${unsafeCSS(counterStyles)}
  `;

  #count = 0;

  @property({
    type: Number,
    reflect: true,
    converter: { fromAttribute: normalizeCount, toAttribute: String },
  })
  get count(): number {
    return this.#count;
  }

  set count(value: number) {
    this.#count = normalizeCount(value);
  }

  #increment(): void {
    const previous = this.count;
    this.count += 1;
    if (this.count !== previous) emitCountChange(this, this.count);
  }

  protected override render() {
    return html`
      <div class="counter">
        <output
          aria-label="Valor del contador"
          aria-live="polite"
          aria-atomic="true"
          >${this.count}</output
        >
        <button
          type="button"
          ?disabled=${this.count === Number.MAX_SAFE_INTEGER}
          @click=${this.#increment}
        >
          Incrementar
        </button>
      </div>
    `;
  }
}

if (!customElements.get('lab-lit-counter'))
  customElements.define('lab-lit-counter', LitCounter);

declare global {
  interface HTMLElementTagNameMap {
    'lab-lit-counter': LitCounter;
  }
}

import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import {
  defaultReadingHeading,
  normalizeHeading,
  normalizeReader,
  type Reader,
  type LessonSelection,
} from './selection-contract';

/** API de consumo de PR-01. Solo la interacción emite lesson-select. */
export class ReadingCard extends LitElement {
  #heading = defaultReadingHeading;

  @property({ reflect: true, converter: { fromAttribute: normalizeHeading } })
  get heading(): string {
    return this.#heading;
  }
  set heading(value: string) {
    this.#heading = normalizeHeading(value);
  }
  @property({ type: Boolean, reflect: true }) compact = false;
  @property({ type: Boolean, reflect: true }) selected = false;
  #reader: Reader = { name: 'Visitante' };

  @property({ attribute: false })
  get reader(): Reader {
    return this.#reader;
  }
  set reader(value: Reader) {
    this.#reader = normalizeReader(value);
  }

  static override styles = css`
    :host {
      display: block;
      color: var(--reader-ink, var(--lab-ink, #172e30));
      font: inherit;
    }
    article {
      padding: var(--reader-space, 1.5rem);
      border: 2px solid var(--reader-accent, #08745a);
      border-radius: var(--reader-radius, 0.8rem);
      background: var(--reader-surface, var(--lab-surface, #f0f4ef));
    }
    :host([compact]) article {
      padding: 0.75rem;
    }
    h3 {
      margin: 0 0 0.75rem;
      font-size: 1.2rem;
      overflow-wrap: anywhere;
    }
    p {
      line-height: 1.6;
    }
    button {
      min-block-size: 44px;
      border: 2px solid currentColor;
      border-radius: 0.4rem;
      padding: 0.6rem 1rem;
      color: inherit;
      background: transparent;
      font: inherit;
      cursor: pointer;
    }
    button:focus-visible {
      outline: 3px solid currentColor;
      outline-offset: 4px;
    }
    ::slotted(.note) {
      font-style: italic;
    }
    @media (forced-colors: active) {
      article,
      button {
        border-color: CanvasText;
      }
    }
  `;

  reset(): void {
    this.selected = false;
  }

  private choose(): void {
    this.selected = !this.selected;
    this.dispatchEvent(
      new CustomEvent<LessonSelection>('lesson-select', {
        detail: { heading: this.heading, readerName: this.reader.name },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected override render() {
    return html`<article part="surface">
      <h3 part="heading">${this.heading}</h3>
      <p>Lector: <strong>${this.reader.name}</strong></p>
      <slot><p>Explora el contrato público.</p></slot>
      <button
        part="action"
        type="button"
        aria-pressed=${this.selected}
        @click=${this.choose}
      >
        Seleccionar lectura
      </button>
    </article>`;
  }
}
if (!customElements.get('lab-reading-card'))
  customElements.define('lab-reading-card', ReadingCard);
declare global {
  interface HTMLElementTagNameMap {
    'lab-reading-card': ReadingCard;
  }
}

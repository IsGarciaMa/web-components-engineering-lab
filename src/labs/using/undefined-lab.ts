import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';
import { registerDeferredNote } from '../../examples/using/deferred-note';
import { labStyles } from './lab-styles';
export class UndefinedLab extends LitElement {
  @state() private registered = Boolean(
    customElements.get('lab-deferred-note'),
  );
  static override styles = [
    labStyles,
    css`
      lab-deferred-note {
        display: block;
        min-block-size: 8rem;
        padding: 1rem;
        box-sizing: border-box;
        border: 2px dashed currentColor;
        border-radius: 0.8rem;
      }
      lab-deferred-note:not(:defined) {
        background: var(--lab-surface);
      }
      lab-deferred-note:defined {
        border-style: solid;
      }
      a {
        color: var(--lab-accent);
      }
    `,
  ];
  override connectedCallback(): void {
    super.connectedCallback();
    this.registered = Boolean(customElements.get('lab-deferred-note'));
  }
  protected override render() {
    return html`<div class="controls">
        <button
          type="button"
          ?disabled=${this.registered}
          @click=${() => {
            registerDeferredNote();
            this.registered = true;
          }}
        >
          Registrar componente
        </button>
      </div>
      <lab-deferred-note
        ><p>Este contenido existe antes del registro y se conserva después.</p>
        <a href="/capitulos/01-using-web-components/04-elementos-no-definidos/"
          >Leer la explicación del upgrade</a
        ></lab-deferred-note
      >
      <p role="status">
        ${this.registered
          ? 'Registrado: coincide con :defined. El contenido se distribuye por un slot.'
          : 'No registrado: coincide con :not(:defined). El enlace ya es utilizable.'}
      </p>
      <p>
        El registro pertenece al documento y no se puede deshacer. Recarga la
        página para repetir desde cero.
      </p>`;
  }
}
if (!customElements.get('lab-undefined-lab'))
  customElements.define('lab-undefined-lab', UndefinedLab);

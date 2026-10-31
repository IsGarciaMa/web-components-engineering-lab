import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import '../../examples/defining/slot-card';
import { createConfirmButton } from '../../examples/defining/confirm-button';
import { createRef, ref } from 'lit/directives/ref.js';
import { labStyles } from '../using/lab-styles';

export class DebuggingLab extends LitElement {
  static override styles = labStyles;
  @state() private fixed = false;
  @state() private result =
    'El título tiene slot="heading", pero el contrato espera slot="title".';
  @state() private confirmations = 0;
  @state() private triedBuiltin = false;
  readonly #stage = createRef<HTMLDivElement>();

  private duplicate(): void {
    try {
      const definition = customElements.get('lab-slot-card');
      if (definition) {
        customElements.define('lab-slot-card', definition);
      }
    } catch (error) {
      this.result =
        error instanceof DOMException
          ? `${error.name}: definición duplicada capturada. El registro original sigue intacto.`
          : String(error);
    }
  }

  private builtin(): void {
    this.triedBuiltin = true;
    try {
      const button = createConfirmButton();
      if (!button) {
        this.result =
          'Este navegador no creó un customized built-in. Usa un button nativo o un autónomo compuesto.';
        return;
      }
      button.addEventListener('lab-confirm', () => {
        this.confirmations += 1;
      });
      this.#stage.value?.append(button);
      this.result =
        'Customized built-in disponible: el botón mantiene su semántica nativa.';
    } catch (error) {
      this.result = `Customized built-in no disponible: ${error instanceof Error ? error.name : String(error)}. El resto del laboratorio funciona.`;
    }
  }

  protected override render() {
    return html`<div class="controls">
        <button
          type="button"
          @click=${() => {
            this.fixed = !this.fixed;
            this.result = this.fixed
              ? 'Contrato corregido: slot="title".'
              : 'Fallo reproducido: slot="heading".';
          }}
        >
          Alternar corrección del slot
        </button>
        <button type="button" @click=${this.duplicate}>
          Capturar registro duplicado
        </button>
        <button
          type="button"
          ?disabled=${this.triedBuiltin}
          @click=${this.builtin}
        >
          Probar built-in opcional
        </button>
      </div>
      <lab-slot-card
        ><span slot=${this.fixed ? 'title' : 'heading'}
          >Título del consumidor</span
        >
        <p>
          El cuerpo funciona aunque el título use un nombre incorrecto.
        </p></lab-slot-card
      >
      <div ${ref(this.#stage)}></div>
      <p role="status">${this.result} Confirmaciones: ${this.confirmations}.</p>
      <p>
        El error esperado se captura y se muestra aquí; no genera un error de
        consola. Usa DevTools para colocar un breakpoint en el catch.
      </p>`;
  }
}
if (!customElements.get('lab-debugging-lab')) {
  customElements.define('lab-debugging-lab', DebuggingLab);
}

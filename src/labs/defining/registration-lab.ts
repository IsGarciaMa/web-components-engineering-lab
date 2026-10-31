import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  RegistrationNote,
  registerNote,
} from '../../examples/defining/registration-note';
import { labStyles } from '../using/lab-styles';

export class RegistrationLab extends LitElement {
  static override styles = labStyles;
  @state() private registered = Boolean(
    customElements.get('lab-registration-note'),
  );
  @state() private result =
    'Espera el registro para utilizar la API de la clase.';
  readonly #stage = createRef<HTMLDivElement>();
  #candidate: HTMLElement | undefined;
  readonly #fragment = document.createDocumentFragment();
  readonly #detached = document.createElement('lab-registration-note');

  protected override firstUpdated(): void {
    const candidate = document.createElement('lab-registration-note');
    candidate.textContent = 'Contenido previo al upgrade.';
    this.#candidate = candidate;
    this.#stage.value?.append(candidate);
    this.#fragment.append(this.#detached);
  }

  private async register(): Promise<void> {
    const original = this.#candidate;
    registerNote();
    await customElements.whenDefined('lab-registration-note');
    this.registered = true;
    this.result = `whenDefined resuelto. Mismo nodo: ${original === this.#stage.value?.firstElementChild}. Instancia conectada: ${original instanceof RegistrationNote}. Fragmento desconectado mejorado: ${this.#detached instanceof RegistrationNote}.`;
  }

  private upgrade(): void {
    customElements.upgrade(this.#fragment);
    this.result = `upgrade(fragment): instancia desconectada ${this.#detached instanceof RegistrationNote}; isConnected ${this.#detached.isConnected}.`;
  }

  protected override render() {
    return html`<div class="controls">
        <button
          type="button"
          ?disabled=${this.registered}
          @click=${this.register}
        >
          Registrar nombre
        </button>
        <button
          type="button"
          ?disabled=${!this.registered}
          @click=${this.upgrade}
        >
          Upgrade del fragmento
        </button>
      </div>
      <div ${ref(this.#stage)}></div>
      <p role="status">${this.result}</p>
      <p>
        El registro no se puede deshacer. Recarga para volver al estado no
        registrado. La región vacía pertenece al laboratorio; Lit no gestiona
        sus hijos.
      </p>`;
  }
}
if (!customElements.get('lab-registration-lab')) {
  customElements.define('lab-registration-lab', RegistrationLab);
}

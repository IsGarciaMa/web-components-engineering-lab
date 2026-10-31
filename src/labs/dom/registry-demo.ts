import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { createScopedExample } from '../../examples/dom/scoped-registry';
import { labStyles } from '../using/lab-styles';

export class RegistryDemo extends LitElement {
  static override styles = labStyles;
  @state() private result =
    'Esta prueba es opcional y no altera el registro global.';
  readonly #mount = createRef<HTMLDivElement>();

  private tryRegistry(): void {
    try {
      const example = createScopedExample();
      // Única región imperativa vacía: Lit no genera sus hijos.
      this.#mount.value?.replaceChildren(...(example ? [example.host] : []));
      this.result =
        example?.message ??
        'No se ha verificado soporte de registros locales en este navegador. El portal conserva su registro global.';
    } catch (error) {
      this.result = `Registro local no disponible: ${error instanceof Error ? error.name : String(error)}. El resto del portal funciona.`;
    }
  }

  protected override render() {
    return html`<button type="button" @click=${this.tryRegistry}>
        Probar registro local opcional
      </button>
      <div ${ref(this.#mount)}></div>
      <p role="status">${this.result}</p>`;
  }
}
if (!customElements.get('lab-registry-demo')) {
  customElements.define('lab-registry-demo', RegistryDemo);
}

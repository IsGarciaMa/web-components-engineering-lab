import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { NativeTabs } from '../../examples/dom/native-tabs';
import { LitTabs } from '../../examples/dom/lit-tabs';
import { sampleTabs } from '../../examples/dom/tabs-consumer';
import { connectTabs } from '../../examples/dom/tabs-consumer';
import type { TabChangeDetail } from '../../examples/dom/tabs-contract';
import { labStyles } from '../using/lab-styles';

export class TabsSelectionLab extends LitElement {
  static override styles = labStyles;
  @state() private prevent = false;
  @state() private synchronize = true;
  @state() private activity: readonly string[] = [];
  #cleanups: (() => void)[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.hasUpdated) {
      this.listen();
    }
  }

  protected override firstUpdated(): void {
    this.listen();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup();
  }

  private cleanup(): void {
    for (const cleanup of this.#cleanups) {
      cleanup();
    }
    this.#cleanups = [];
  }

  private listen(): void {
    this.cleanup();
    const native = this.renderRoot.querySelector('lab-native-tabs');
    const lit = this.renderRoot.querySelector('lab-lit-tabs');
    if (!(native instanceof NativeTabs) || !(lit instanceof LitTabs)) {
      return;
    }
    this.#cleanups.push(
      connectTabs(native, (detail) => this.onChange('Nativo', detail, lit)),
    );
    this.#cleanups.push(
      connectTabs(lit, (detail) => this.onChange('Lit', detail, native)),
    );
  }

  private onChange(
    origin: string,
    detail: TabChangeDetail,
    other: NativeTabs | LitTabs,
  ): void {
    this.activity = [
      ...this.activity,
      `${origin}: ${detail.previous} → ${detail.selected} (${detail.source})`,
    ].slice(-8);
    if (this.synchronize) {
      other.selected = detail.selected;
    }
  }

  private onBefore(event: Event): void {
    if (this.prevent) {
      event.preventDefault();
    }
  }

  private selectExternally(): void {
    for (const tabs of this.renderRoot.querySelectorAll(
      'lab-native-tabs, lab-lit-tabs',
    )) {
      if (tabs instanceof NativeTabs || tabs instanceof LitTabs) {
        tabs.selected = 'events';
      }
    }
  }

  protected override render() {
    return html`<div class="controls">
        <label class="check"
          ><input
            type="checkbox"
            .checked=${this.prevent}
            @change=${() => {
              this.prevent = !this.prevent;
            }}
          />Cancelar before-tab-change</label
        >
        <label class="check"
          ><input
            type="checkbox"
            .checked=${this.synchronize}
            @change=${() => {
              this.synchronize = !this.synchronize;
            }}
          />Sincronizar ambas vistas</label
        >
        <button type="button" @click=${this.selectExternally}>
          Seleccionar Eventos desde JavaScript
        </button>
        <button
          type="button"
          @click=${() => {
            this.activity = [];
          }}
        >
          Vaciar registro de selección
        </button>
      </div>
      <div @before-tab-change=${this.onBefore}>
        <h3>Vista nativa</h3>
        <lab-native-tabs label="Selección nativa" .items=${sampleTabs}>
          <p slot="intro">Usa flechas: mover foco no selecciona.</p>
          <p slot="contract">Confirma con Enter o Espacio.</p>
          <p slot="events">Una selección externa no emite tab-change.</p>
        </lab-native-tabs>
        <h3>Vista Lit</h3>
        <lab-lit-tabs label="Selección Lit" .items=${sampleTabs}>
          <p slot="intro">El mismo contrato con actualización reactiva.</p>
          <p slot="contract">ARIA enlazado dentro de la misma raíz.</p>
          <p slot="events">El consumidor conserva estos nodos.</p>
        </lab-lit-tabs>
      </div>
      <p role="status">
        ${this.activity.length} cambios de usuario registrados; máximo 8.
        Sincronizar escribe una propiedad silenciosa.
      </p>
      <ol aria-label="Registro de selección">
        ${this.activity.map((entry) => html`<li>${entry}</li>`)}
      </ol>`;
  }
}
if (!customElements.get('lab-tabs-selection')) {
  customElements.define('lab-tabs-selection', TabsSelectionLab);
}

import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { NativeTabs } from '../../examples/dom/native-tabs';
import { LitTabs } from '../../examples/dom/lit-tabs';
import { sampleTabs } from '../../examples/dom/tabs-consumer';
import type { TabItem } from '../../examples/dom/tabs-contract';
import { labStyles } from '../using/lab-styles';

export class TabsPlayground extends LitElement {
  static override styles = labStyles;
  @state() private revision = 0;
  @state() private entries: readonly TabItem[] = sampleTabs;
  @state() private result = 'Ambas implementaciones usan activación manual.';

  private toggleDisabled(): void {
    this.entries = this.entries.map((item) =>
      item.id === 'contract' ? { ...item, disabled: !item.disabled } : item,
    );
  }

  private toggleExtra(): void {
    this.entries = this.entries.some((item) => item.id === 'extra')
      ? this.entries.filter((item) => item.id !== 'extra')
      : [...this.entries, { id: 'extra', label: 'Panel adicional' }];
  }

  private empty(): void {
    this.entries = this.entries.length ? [] : sampleTabs;
  }

  private inspect(): void {
    const native = this.renderRoot.querySelector('lab-native-tabs');
    const lit = this.renderRoot.querySelector('lab-lit-tabs');
    if (!(native instanceof NativeTabs) || !(lit instanceof LitTabs)) {
      return;
    }
    const child = native.firstElementChild;
    this.result = JSON.stringify(
      {
        host: native.localName,
        lightChildren: native.children.length,
        childParentIsHost: child?.parentElement === native,
        hostQueryForTabs: native.querySelectorAll('[role="tab"]').length,
        shadowQueryForTabs:
          native.shadowRoot?.querySelectorAll('[role="tab"]').length,
        selected: { native: native.selected, lit: lit.selected },
      },
      null,
      2,
    );
  }

  private content(item: TabItem) {
    return html`<section slot=${item.id}>
      <p>
        ${item.label}: contenido propiedad del consumidor. Revisión
        ${this.revision}.
      </p>
      <a href="/capitulos/03-working-with-dom/02-host-dom/"
        >Consultar Host DOM</a
      >
    </section>`;
  }

  protected override render() {
    return html`<div class="controls">
        <button type="button" @click=${this.toggleDisabled}>
          Alternar Contrato deshabilitada
        </button>
        <button type="button" @click=${this.toggleExtra}>
          Añadir o retirar panel
        </button>
        <button type="button" @click=${this.empty}>
          Vaciar o restaurar pestañas
        </button>
        <button
          type="button"
          @click=${() => {
            this.revision += 1;
          }}
        >
          Actualizar contenido proyectado
        </button>
        <button type="button" @click=${this.inspect}>
          Inspeccionar árboles
        </button>
      </div>
      <h3>Implementación nativa</h3>
      <lab-native-tabs label="Nativo" .items=${this.entries}
        >${repeat(
          this.entries,
          (item) => item.id,
          (item) => this.content(item),
        )}</lab-native-tabs
      >
      <h3>Implementación Lit</h3>
      <lab-lit-tabs label="Lit" .items=${this.entries}
        >${repeat(
          this.entries,
          (item) => item.id,
          (item) => this.content(item),
        )}</lab-lit-tabs
      >
      <pre role="status">${this.result}</pre>`;
  }
}
if (!customElements.get('lab-tabs-playground')) {
  customElements.define('lab-tabs-playground', TabsPlayground);
}

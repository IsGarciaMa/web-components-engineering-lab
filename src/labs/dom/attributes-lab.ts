import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';
import { NativeTabs } from '../../examples/dom/native-tabs';
import { sampleTabs } from '../../examples/dom/tabs-consumer';
import { labStyles } from '../using/lab-styles';

export class TabsAttributesLab extends LitElement {
  static override styles = [
    labStyles,
    css`
      label {
        min-inline-size: 0;
        max-inline-size: 100%;
      }
    `,
  ];
  @state() private draft = 'contract';
  @state() private result =
    'Escribe un ID: intro, contract o events. Un ID inválido vuelve al primero habilitado.';
  @state() private received = 0;

  private apply(
    mode: 'attribute' | 'property' | 'remove' | 'disabled' | 'toggle',
  ): void {
    const tabs = this.renderRoot.querySelector('lab-native-tabs');
    if (!(tabs instanceof NativeTabs)) {
      return;
    }
    if (mode === 'attribute') {
      tabs.setAttribute('selected', this.draft);
    }
    if (mode === 'property') {
      tabs.selected = this.draft;
    }
    if (mode === 'remove') {
      tabs.removeAttribute('selected');
    }
    if (mode === 'disabled') {
      tabs.setAttribute('disabled', 'false');
    }
    if (mode === 'toggle') {
      tabs.toggleAttribute('disabled');
    }
    this.result = JSON.stringify(
      {
        attribute: tabs.getAttribute('selected'),
        property: tabs.selected,
        disabledAttribute: tabs.getAttribute('disabled'),
        hasDisabled: tabs.hasAttribute('disabled'),
        disabledProperty: tabs.disabled,
        itemsAreArray: Array.isArray(tabs.items),
        itemsAttribute: tabs.getAttribute('items'),
      },
      null,
      2,
    );
  }

  protected override render() {
    return html`<div class="controls">
        <label
          >ID de selección<input
            maxlength="40"
            .value=${this.draft}
            @input=${(event: Event) => {
              if (event.target instanceof HTMLInputElement) {
                this.draft = event.target.value;
              }
            }}
        /></label>
        <button type="button" @click=${() => this.apply('attribute')}>
          setAttribute selected
        </button>
        <button type="button" @click=${() => this.apply('property')}>
          Asignar selected
        </button>
        <button type="button" @click=${() => this.apply('remove')}>
          removeAttribute selected
        </button>
        <button type="button" @click=${() => this.apply('disabled')}>
          disabled="false"
        </button>
        <button type="button" @click=${() => this.apply('toggle')}>
          toggleAttribute disabled
        </button>
      </div>
      <lab-native-tabs
        label="Inspector"
        .items=${sampleTabs}
        @tab-change=${() => {
          this.received += 1;
        }}
      >
        <p slot="intro">Selección inicial.</p>
        <p slot="contract">Contrato de atributos y propiedades.</p>
        <p slot="events">Cambios del usuario, eventos públicos.</p>
      </lab-native-tabs>
      <pre role="status">${this.result}</pre>
      <p>
        Eventos tab-change recibidos por interacción: ${this.received}. Las
        escrituras anteriores son silenciosas.
      </p>`;
  }
}
if (!customElements.get('lab-tabs-attributes')) {
  customElements.define('lab-tabs-attributes', TabsAttributesLab);
}

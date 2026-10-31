import { LitElement, html } from 'lit';
import './reading-card';

export class CardFrame extends LitElement {
  protected override render() {
    return html`<lab-reading-card
      heading="Parte reexportada"
      exportparts="surface:card-surface, action:card-action"
    >
      <p class="note">
        Este nodo pertenece al frame; la tarjeta lo recibe por slot.
      </p>
    </lab-reading-card>`;
  }
}
if (!customElements.get('lab-card-frame'))
  customElements.define('lab-card-frame', CardFrame);

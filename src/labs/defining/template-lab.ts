import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { TemplateStamp } from '../../examples/defining/template-stamp';
import { labStyles } from '../using/lab-styles';

export class TemplateLab extends LitElement {
  static override styles = labStyles;
  @state() private draftTitle = 'Una instancia de plantilla';
  @state() private copies = 0;

  private stamp(): void {
    const target = this.renderRoot.querySelector('lab-template-stamp');
    if (target instanceof TemplateStamp) {
      target.stamp(this.draftTitle);
      this.copies = target.copies;
    }
  }

  private reset(): void {
    const target = this.renderRoot.querySelector('lab-template-stamp');
    if (target instanceof TemplateStamp) {
      target.reset();
      this.copies = 0;
    }
  }

  protected override render() {
    return html`<div class="controls">
        <label
          >Texto de la copia<input
            maxlength="80"
            .value=${this.draftTitle}
            @input=${(event: Event) => {
              if (event.target instanceof HTMLInputElement) {
                this.draftTitle = event.target.value;
              }
            }}
        /></label>
        <button
          type="button"
          ?disabled=${this.copies >= 5}
          @click=${this.stamp}
        >
          Clonar plantilla
        </button>
        <button type="button" @click=${this.reset}>Vaciar copias</button>
      </div>
      <lab-template-stamp></lab-template-stamp>
      <p role="status">
        ${this.copies} de 5 copias. Cambiar el campo no modifica las copias
        anteriores.
      </p>`;
  }
}
if (!customElements.get('lab-template-lab')) {
  customElements.define('lab-template-lab', TemplateLab);
}

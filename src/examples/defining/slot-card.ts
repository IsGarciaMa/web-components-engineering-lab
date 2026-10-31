/** El consumidor conserva la propiedad de los nodos del Light DOM. */
export class SlotCard extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    // Solo markup constante del repositorio; las entradas se asignan como texto.
    root.innerHTML = `
      <style>
        :host { display: block; border: 1px solid currentColor; padding: 1rem; border-radius: .6rem; }
        header { font-weight: bold; margin-block-end: .6rem; }
        ::slotted([slot="title"]) { margin: 0; }
      </style>
      <header><slot name="title">Título de reserva</slot></header>
      <section><slot>Contenido de reserva</slot></section>
    `;
    root.addEventListener('slotchange', () => {
      this.dispatchEvent(
        new CustomEvent('composition-change', {
          detail: this.inspectSlots(),
          bubbles: true,
          composed: true,
        }),
      );
    });
  }

  inspectSlots(): { name: string; nodes: number; elements: number }[] {
    return [...(this.shadowRoot?.querySelectorAll('slot') ?? [])].map(
      (slot) => ({
        name: slot.name || '(default)',
        nodes: slot.assignedNodes().length,
        elements: slot.assignedElements().length,
      }),
    );
  }
}

if (!customElements.get('lab-slot-card')) {
  customElements.define('lab-slot-card', SlotCard);
}

declare global {
  interface HTMLElementTagNameMap {
    'lab-slot-card': SlotCard;
  }
}

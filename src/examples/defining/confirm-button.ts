/** Ejemplo opcional: necesita soporte de customized built-in elements. */
export class ConfirmButton extends HTMLButtonElement {
  constructor() {
    super();
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('lab-confirm', { bubbles: true }));
    });
  }
}

export function createConfirmButton(): HTMLButtonElement | null {
  if (!customElements.get('lab-confirm-button')) {
    customElements.define('lab-confirm-button', ConfirmButton, {
      extends: 'button',
    });
  }
  const button = document.createElement('button', { is: 'lab-confirm-button' });
  if (!(button instanceof ConfirmButton)) {
    return null;
  }
  button.type = 'button';
  button.textContent = 'Confirmar con built-in';
  return button;
}

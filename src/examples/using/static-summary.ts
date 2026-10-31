/** Mejora Light DOM propiedad del servidor, sin sustituirlo ni duplicarlo. */
export class StaticSummary extends HTMLElement {
  connectedCallback(): void {
    const button = this.querySelector<HTMLButtonElement>(
      '[data-summary-toggle]',
    );
    if (button) {
      button.hidden = false;
      button.addEventListener('click', this.toggle);
    }
    this.dataset['enhanced'] = 'true';
  }
  disconnectedCallback(): void {
    this.querySelector('[data-summary-toggle]')?.removeEventListener(
      'click',
      this.toggle,
    );
  }
  private readonly toggle = (): void => {
    const button = this.querySelector('[data-summary-toggle]');
    const detail = this.querySelector<HTMLElement>('[data-summary-detail]');
    if (!button || !detail) return;
    detail.hidden = !detail.hidden;
    button.setAttribute('aria-expanded', String(!detail.hidden));
  };
}
if (!customElements.get('lab-static-summary'))
  customElements.define('lab-static-summary', StaticSummary);

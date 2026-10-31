/** Emisor real dentro de Shadow DOM para inspeccionar propagación y retargeting. */
export class EventProbe extends HTMLElement {
  bubbles = true;
  composed = true;
  cancelable = true;
  readonly #button = document.createElement('button');
  readonly #result = document.createElement('p');

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `button { font: inherit; min-height: 44px; padding: .6rem; color: inherit; background: transparent; border: 1px solid currentColor; }
      button:focus-visible { outline: 3px solid var(--lab-accent, currentColor); outline-offset: 3px; }`;
    this.#button.type = 'button';
    this.#button.textContent = 'Emitir evento desde Shadow DOM';
    this.#button.addEventListener('click', () => {
      const event = new CustomEvent('dom-probe', {
        detail: Object.freeze({ action: 'inspect' }),
        bubbles: this.bubbles,
        composed: this.composed,
        cancelable: this.cancelable,
      });
      const accepted = this.#button.dispatchEvent(event);
      this.#result.textContent = `dispatchEvent devolvió ${accepted}; defaultPrevented ${event.defaultPrevented}.`;
    });
    root.append(style, this.#button, this.#result);
  }
}
if (!customElements.get('lab-event-probe')) {
  customElements.define('lab-event-probe', EventProbe);
}

/** El módulo exporta la clase; el consumidor decide cuándo registrarla. */
export class DeferredNote extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent =
      ':host { display: block; min-block-size: 8rem; border: 2px solid currentColor; border-radius: .8rem; padding: 1rem; box-sizing: border-box; }';
    const slot = document.createElement('slot');
    root.append(style, slot);
  }
}
export function registerDeferredNote(): void {
  if (!customElements.get('lab-deferred-note'))
    customElements.define('lab-deferred-note', DeferredNote);
}

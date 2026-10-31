// La plantilla es código local revisado. Nunca se interpola entrada externa en HTML.
const template = document.createElement('template');
template.innerHTML = `<article><h3></h3><p>Copia independiente de la plantilla.</p></article>`;

/** Crea copias independientes; el texto se asigna con textContent. Máximo 5. */
export class TemplateStamp extends HTMLElement {
  readonly #list = document.createElement('div');
  #copies = 0;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).append(this.#list);
  }

  get copies(): number {
    return this.#copies;
  }

  stamp(title: string): boolean {
    if (this.#copies >= 5) {
      return false;
    }
    const fragment = template.content.cloneNode(true);
    if (!(fragment instanceof DocumentFragment)) {
      throw new TypeError('Se esperaba un DocumentFragment');
    }
    const heading = fragment.querySelector('h3');
    if (heading) {
      heading.textContent = title;
    }
    this.#list.append(fragment);
    this.#copies += 1;
    return true;
  }

  reset(): void {
    this.#list.replaceChildren();
    this.#copies = 0;
  }
}

if (!customElements.get('lab-template-stamp')) {
  customElements.define('lab-template-stamp', TemplateStamp);
}

declare global {
  interface HTMLElementTagNameMap {
    'lab-template-stamp': TemplateStamp;
  }
}

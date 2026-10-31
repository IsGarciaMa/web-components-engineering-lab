function populate(root: ShadowRoot, label: string): void {
  const style = document.createElement('style');
  style.textContent = `:host { display: block; border: 2px solid currentColor; padding: 1rem; }
    p { color: var(--frame-accent, inherit); }`;
  const paragraph = document.createElement('p');
  paragraph.textContent = label;
  root.append(style, paragraph);
}

export class OpenFrame extends HTMLElement {
  constructor() {
    super();
    populate(this.attachShadow({ mode: 'open' }), 'Párrafo dentro de open');
  }
}

export class ClosedFrame extends HTMLElement {
  constructor() {
    super();
    populate(this.attachShadow({ mode: 'closed' }), 'Párrafo dentro de closed');
  }
}

if (!customElements.get('lab-open-frame')) {
  customElements.define('lab-open-frame', OpenFrame);
}
if (!customElements.get('lab-closed-frame')) {
  customElements.define('lab-closed-frame', ClosedFrame);
}

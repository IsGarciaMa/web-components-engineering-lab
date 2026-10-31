/** Exportar la clase no registra su nombre: el laboratorio decide cuándo hacerlo. */
export class RegistrationNote extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    const text = document.createElement('p');
    text.textContent =
      'Constructor ejecutado: la identidad del host se conserva.';
    root.append(text, document.createElement('slot'));
  }
}

export function registerNote(): void {
  // El guard evita duplicados en esta demo, pero no resuelve conflictos de versiones.
  if (!customElements.get('lab-registration-note')) {
    customElements.define('lab-registration-note', RegistrationNote);
  }
}

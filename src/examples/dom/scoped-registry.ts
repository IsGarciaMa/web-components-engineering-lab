/** Demostración opcional. La API nueva no se añade globalmente a los tipos DOM. */
export function createScopedExample(): {
  host: HTMLElement;
  message: string;
} | null {
  if (!('customElementRegistry' in ShadowRoot.prototype)) {
    return null;
  }
  // Puede seguir sin existir un constructor utilizable aunque el registro global funcione.
  const registry = new CustomElementRegistry();
  class ScopedNote extends HTMLElement {
    connectedCallback(): void {
      this.textContent = 'Definición del registro local.';
    }
  }
  registry.define('lab-scoped-note', ScopedNote);
  const host = document.createElement('div');
  // Opción documentada en la plataforma; extensión local para versiones de lib.dom anteriores.
  const options: ShadowRootInit & {
    customElementRegistry: CustomElementRegistry;
  } = {
    mode: 'open',
    customElementRegistry: registry,
  };
  const root = host.attachShadow(options);
  if (
    !('customElementRegistry' in root) ||
    root.customElementRegistry !== registry
  ) {
    return null;
  }
  // Markup constante revisado. El parser usa el registro de esta raíz.
  root.innerHTML = '<lab-scoped-note></lab-scoped-note>';
  const note = root.firstElementChild;
  if (!(note instanceof ScopedNote)) {
    return null;
  }
  return {
    host,
    message: `Instancia local: true. Registro global contiene nombre: ${Boolean(customElements.get('lab-scoped-note'))}.`,
  };
}

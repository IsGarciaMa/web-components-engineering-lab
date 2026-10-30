import { afterEach, describe, expect, it, vi } from 'vitest';

type Counter = HTMLElement & {
  count: number;
  updateComplete?: Promise<boolean>;
};

async function settle(element: Counter): Promise<void> {
  await element.updateComplete;
}

function button(element: Counter): HTMLButtonElement {
  const node = element.shadowRoot?.querySelector('button');
  if (!node) throw new Error('Falta el botón público de interacción');
  return node;
}

function output(element: Counter): string | null | undefined {
  return element.shadowRoot?.querySelector('output')?.textContent;
}

afterEach(() => document.body.replaceChildren());

export function counterContract(
  tag: string,
  Base: CustomElementConstructor,
): void {
  describe(tag, () => {
    function create(): Counter {
      const element = document.createElement(tag) as Counter;
      document.body.append(element);
      return element;
    }

    it('muestra cero y refleja cambios de propiedad sin notificar al consumidor', async () => {
      const element = create();
      await settle(element);
      expect(output(element)).toBe('0');
      const listener = vi.fn();
      element.addEventListener('count-change', listener);
      element.count = 7;
      await settle(element);
      expect(output(element)).toBe('7');
      expect(element.getAttribute('count')).toBe('7');
      expect(listener).not.toHaveBeenCalled();
    });

    it('convierte atributos y restablece cero al eliminarlos', async () => {
      const element = create();
      element.setAttribute('count', '4.8');
      await settle(element);
      expect(element.count).toBe(4);
      expect(output(element)).toBe('4');
      element.setAttribute('count', 'invalid');
      await settle(element);
      expect(element.count).toBe(0);
      element.setAttribute('count', '2');
      element.removeAttribute('count');
      await settle(element);
      expect(element.count).toBe(0);
      expect(output(element)).toBe('0');
    });

    it('emite un evento que cruza un Shadow DOM consumidor', async () => {
      const host = document.createElement('div');
      const root = host.attachShadow({ mode: 'open' });
      const element = document.createElement(tag) as Counter;
      root.append(element);
      document.body.append(host);
      await settle(element);
      const listener = vi.fn();
      host.addEventListener('count-change', listener);
      button(element).click();
      await settle(element);
      expect(output(element)).toBe('1');
      expect(listener).toHaveBeenCalledTimes(1);
      const event = listener.mock.calls[0]?.[0] as CustomEvent<{
        count: number;
      }>;
      expect(event.detail).toEqual({ count: 1 });
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('conserva el valor sin duplicar listeners después de reconectar', async () => {
      const element = create();
      element.count = 3;
      element.remove();
      document.body.append(element);
      await settle(element);
      const listener = vi.fn();
      element.addEventListener('count-change', listener);
      button(element).click();
      await settle(element);
      expect(element.count).toBe(4);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('protege el rango entero y desactiva el incremento en el máximo', async () => {
      const element = create();
      element.count = Number.MAX_VALUE;
      await settle(element);
      expect(element.count).toBe(Number.MAX_SAFE_INTEGER);
      expect(button(element).disabled).toBe(true);
      button(element).click();
      expect(element.count).toBe(Number.MAX_SAFE_INTEGER);
      element.count = NaN;
      await settle(element);
      expect(element.count).toBe(0);
      expect(button(element).disabled).toBe(false);
    });
  });

  it(`recupera la propiedad previa al registro de ${tag}`, async () => {
    const lateTag = `test-late-${tag}`;
    const element = document.createElement(lateTag) as Counter;
    element.setAttribute('count', '2');
    element.count = 9;
    document.body.append(element);
    customElements.define(lateTag, class extends Base {});
    await settle(element);
    expect(element.count).toBe(9);
    expect(output(element)).toBe('9');
  });
}

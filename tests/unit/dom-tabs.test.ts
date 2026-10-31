import { afterEach, describe, expect, it } from 'vitest';
import { NativeTabs } from '../../src/examples/dom/native-tabs';
import { LitTabs } from '../../src/examples/dom/lit-tabs';
import { sampleTabs } from '../../src/examples/dom/tabs-consumer';
import {
  activeWithin,
  type TabChangeDetail,
} from '../../src/examples/dom/tabs-contract';

afterEach(() => {
  document.body.replaceChildren();
});

async function settle(tabs: NativeTabs | LitTabs): Promise<void> {
  if (tabs instanceof LitTabs) {
    await tabs.updateComplete;
    await tabs.updateComplete;
  }
}
function button(tabs: NativeTabs | LitTabs, id: string): HTMLButtonElement {
  const result = tabs.shadowRoot?.querySelector<HTMLButtonElement>(
    `[role="tab"][data-id="${id}"]`,
  );
  if (!result) {
    throw new Error(`Tab ausente: ${id}`);
  }
  return result;
}
function key(node: HTMLElement, value: string): void {
  node.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: value,
      bubbles: true,
      cancelable: true,
    }),
  );
}

for (const [name, Constructor] of [
  ['nativo', NativeTabs],
  ['Lit', LitTabs],
] as const) {
  describe(`Tabs ${name}`, () => {
    async function create(): Promise<NativeTabs | LitTabs> {
      const tabs = new Constructor();
      tabs.items = sampleTabs;
      tabs.label = 'Ejemplo';
      document.body.append(tabs);
      await settle(tabs);
      return tabs;
    }

    it('construye sin atributos en el host y acepta selección antes de configurar items', async () => {
      const tabs = new Constructor();
      expect(tabs.attributes.length).toBe(0);
      tabs.setAttribute('selected', 'events');
      tabs.items = sampleTabs;
      document.body.append(tabs);
      await settle(tabs);
      expect(tabs.selected).toBe('events');
      expect(button(tabs, 'events').getAttribute('aria-selected')).toBe('true');
    });

    it('enlaza tabs y paneles en la misma raíz con IDs estables y distintos por instancia', async () => {
      const tabs = await create();
      const other = await create();
      const first = button(tabs, 'intro');
      const id = first.id;
      const panelId = first.getAttribute('aria-controls') ?? '';
      const panel = tabs.shadowRoot?.getElementById(panelId);
      expect(panel?.getAttribute('role')).toBe('tabpanel');
      expect(panel?.getAttribute('aria-labelledby')).toBe(id);
      expect(button(other, 'intro').id).not.toBe(id);
      tabs.items = [...sampleTabs].reverse();
      await settle(tabs);
      expect(button(tabs, 'intro')).toBe(first);
      expect(first.id).toBe(id);
      expect(
        tabs.shadowRoot
          ?.querySelector('[role="tablist"]')
          ?.getAttribute('aria-label'),
      ).toBe('Ejemplo');
    });

    it('normaliza atributos, eliminación y booleanos sin emitir cambios de usuario', async () => {
      const tabs = await create();
      const changes: Event[] = [];
      tabs.addEventListener('tab-change', (event) => {
        changes.push(event);
      });
      tabs.selected = 'contract';
      await settle(tabs);
      expect(tabs.getAttribute('selected')).toBe('contract');
      tabs.setAttribute('selected', 'not-found');
      await settle(tabs);
      expect(tabs.selected).toBe('intro');
      tabs.setAttribute('selected', 'still-invalid');
      await settle(tabs);
      expect(tabs.getAttribute('selected')).toBe('intro');
      tabs.selected = 'events';
      tabs.removeAttribute('selected');
      await settle(tabs);
      expect(tabs.selected).toBe('intro');
      tabs.setAttribute('disabled', 'false');
      await settle(tabs);
      expect(tabs.disabled).toBe(true);
      expect(button(tabs, 'intro').disabled).toBe(true);
      tabs.toggleAttribute('disabled', false);
      await settle(tabs);
      expect(button(tabs, 'intro').disabled).toBe(false);
      expect(changes).toHaveLength(0);
    });

    it('distingue foco de selección y activa con Enter/Espacio; omite deshabilitados', async () => {
      const tabs = await create();
      tabs.items = sampleTabs.map((item) => ({
        ...item,
        disabled: item.id === 'contract',
      }));
      await settle(tabs);
      const first = button(tabs, 'intro');
      first.focus();
      key(first, 'ArrowRight');
      await settle(tabs);
      expect(activeWithin(tabs)).toBe(button(tabs, 'events'));
      expect(tabs.selected).toBe('intro');
      expect(button(tabs, 'events').tabIndex).toBe(0);
      expect(first.tabIndex).toBe(-1);
      key(button(tabs, 'events'), 'Enter');
      await settle(tabs);
      expect(tabs.selected).toBe('events');
      key(button(tabs, 'events'), 'Home');
      await settle(tabs);
      key(first, ' ');
      await settle(tabs);
      expect(tabs.selected).toBe('intro');
      key(first, 'End');
      await settle(tabs);
      expect(activeWithin(tabs)).toBe(button(tabs, 'events'));
      expect(tabs.selected).toBe('intro');
    });

    it('cancela antes del cambio, emite payload mínimo y no repite selección actual', async () => {
      const tabs = await create();
      const received: TabChangeDetail[] = [];
      tabs.addEventListener('tab-change', (event: Event) => {
        if (event instanceof CustomEvent) {
          received.push(event.detail);
        }
      });
      const cancel = (event: Event) => {
        event.preventDefault();
      };
      tabs.addEventListener('before-tab-change', cancel);
      button(tabs, 'contract').click();
      await settle(tabs);
      expect(tabs.selected).toBe('intro');
      expect(received).toHaveLength(0);
      tabs.removeEventListener('before-tab-change', cancel);
      button(tabs, 'contract').click();
      await settle(tabs);
      button(tabs, 'contract').click();
      expect(received).toEqual([
        { previous: 'intro', selected: 'contract', source: 'pointer' },
      ]);
      expect(Object.isFrozen(received[0])).toBe(true);
    });

    it('no sobrescribe cambios externos ocurridos en before-tab-change', async () => {
      const tabs = await create();
      let received = 0;
      tabs.addEventListener('tab-change', () => {
        received += 1;
      });
      tabs.addEventListener(
        'before-tab-change',
        () => {
          tabs.selected = 'events';
        },
        { once: true },
      );
      button(tabs, 'contract').click();
      await settle(tabs);
      expect(tabs.selected).toBe('events');
      expect(received).toBe(0);
    });

    it('reconcilia contenido dinámico, selección deshabilitada y estado vacío', async () => {
      const tabs = await create();
      tabs.selected = 'contract';
      await settle(tabs);
      button(tabs, 'contract').focus();
      tabs.items = sampleTabs.filter((item) => item.id !== 'contract');
      await settle(tabs);
      expect(tabs.selected).toBe('intro');
      expect(activeWithin(tabs)).toBe(button(tabs, 'intro'));
      expect(
        tabs.shadowRoot?.querySelectorAll('[role="tab"][tabindex="0"]'),
      ).toHaveLength(1);
      tabs.items = tabs.items.map((item) => ({ ...item, disabled: true }));
      await settle(tabs);
      expect(tabs.selected).toBe('');
      expect(tabs.getAttribute('selected')).toBeNull();
      expect(
        tabs.shadowRoot?.querySelectorAll('[role="tabpanel"]:not([hidden])'),
      ).toHaveLength(0);
      tabs.items = [];
      await settle(tabs);
      expect(tabs.shadowRoot?.querySelectorAll('[role="tab"]')).toHaveLength(0);
      expect(
        tabs.shadowRoot?.querySelector<HTMLElement>('[role="tablist"]')?.hidden,
      ).toBe(true);
      expect(
        tabs.shadowRoot?.querySelector<HTMLElement>('[data-empty]')?.hidden,
      ).toBe(false);
      tabs.items = sampleTabs;
      await settle(tabs);
      expect(activeWithin(tabs)).toBe(button(tabs, 'intro'));
    });

    it('conserva nodos Light DOM y recupera foco de un panel que se oculta', async () => {
      const tabs = await create();
      const content = document.createElement('section');
      content.slot = 'intro';
      const input = document.createElement('input');
      input.setAttribute('aria-label', 'Dato del panel');
      content.append(input);
      tabs.append(content);
      await Promise.resolve();
      expect(content.parentElement).toBe(tabs);
      expect(
        tabs.shadowRoot?.querySelector('slot')?.assignedElements(),
      ).toEqual([content]);
      input.focus();
      tabs.selected = 'events';
      await settle(tabs);
      expect(activeWithin(tabs)).toBe(button(tabs, 'events'));
      expect(content.parentElement).toBe(tabs);
    });

    it('no roba foco exterior y mantiene foco e identidad al reordenar', async () => {
      const tabs = await create();
      const outside = document.createElement('button');
      document.body.append(outside);
      outside.focus();
      tabs.selected = 'events';
      await settle(tabs);
      expect(document.activeElement).toBe(outside);
      const contract = button(tabs, 'contract');
      contract.focus();
      tabs.items = [...tabs.items].reverse();
      await settle(tabs);
      expect(activeWithin(tabs)).toBe(contract);
    });

    it('desconecta handlers y reconecta sin duplicar eventos', async () => {
      const tabs = await create();
      let received = 0;
      tabs.addEventListener('tab-change', () => {
        received += 1;
      });
      const contract = button(tabs, 'contract');
      tabs.remove();
      contract.click();
      expect(tabs.selected).toBe('intro');
      for (let index = 0; index < 3; index += 1) {
        document.body.append(tabs);
        tabs.remove();
      }
      document.body.append(tabs);
      await settle(tabs);
      button(tabs, 'contract').click();
      await settle(tabs);
      expect(received).toBe(1);
    });

    it('rechaza IDs duplicados de forma atómica y copia arrays del consumidor', async () => {
      const tabs = await create();
      const source = [{ id: 'one', label: 'Una' }];
      tabs.items = source;
      source[0] = { id: 'two', label: 'Otra' };
      await settle(tabs);
      expect(tabs.items[0]?.id).toBe('one');
      expect(() => {
        tabs.items = [
          { id: 'bad', label: 'Uno' },
          { id: 'bad', label: 'Dos' },
        ];
      }).toThrow(TypeError);
      expect(tabs.items[0]?.id).toBe('one');
    });
  });
}

it('recupera items y selected propios anteriores al upgrade nativo sin perder precedencia', () => {
  const host = document.createElement('lab-tabs-upgrade-case');
  host.setAttribute('selected', 'intro');
  Object.defineProperty(host, 'items', {
    value: sampleTabs,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(host, 'selected', {
    value: 'events',
    configurable: true,
    writable: true,
  });
  document.body.append(host);
  class UpgradeTabs extends NativeTabs {}
  customElements.define('lab-tabs-upgrade-case', UpgradeTabs);
  if (!(host instanceof UpgradeTabs)) {
    throw new Error('Upgrade ausente');
  }
  expect(host.selected).toBe('events');
  expect(Object.hasOwn(host, 'selected')).toBe(false);
  host.selected = 'contract';
  expect(host.getAttribute('selected')).toBe('contract');
});

it('propaga eventos de Tabs al consumidor situado fuera de otra raíz shadow', async () => {
  const wrapper = document.createElement('div');
  const root = wrapper.attachShadow({ mode: 'open' });
  const tabs = new NativeTabs();
  tabs.items = sampleTabs;
  root.append(tabs);
  document.body.append(wrapper);
  const received: Event[] = [];
  wrapper.addEventListener('tab-change', (event) => {
    received.push(event);
  });
  button(tabs, 'contract').click();
  expect(received).toHaveLength(1);
  expect(received[0]?.bubbles).toBe(true);
  expect(received[0]?.composed).toBe(true);
  expect(received[0]?.cancelable).toBe(false);
});

it('Lit recupera propiedades establecidas antes de definir la clase', async () => {
  const host = document.createElement('lab-lit-tabs-upgrade-case');
  Object.assign(host, { selected: 'events', items: sampleTabs });
  host.setAttribute('selected', 'intro');
  document.body.append(host);
  class UpgradeLitTabs extends LitTabs {}
  customElements.define('lab-lit-tabs-upgrade-case', UpgradeLitTabs);
  if (!(host instanceof UpgradeLitTabs)) {
    throw new Error('Upgrade Lit ausente');
  }
  await host.updateComplete;
  expect(host.selected).toBe('events');
  expect(Object.hasOwn(host, 'selected')).toBe(false);
});

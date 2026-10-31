import { afterEach, describe, expect, it } from 'vitest';
import { NativeMeter } from '../../src/examples/defining/native-meter';
import { LitMeter } from '../../src/examples/defining/lit-meter';
import { SlotCard } from '../../src/examples/defining/slot-card';
import { TemplateStamp } from '../../src/examples/defining/template-stamp';
import {
  RegistrationNote,
  registerNote,
} from '../../src/examples/defining/registration-note';
import '../../src/examples/defining/shadow-frames';

afterEach(() => {
  document.body.replaceChildren();
});

for (const [name, Constructor] of [
  ['nativo', NativeMeter],
  ['Lit', LitMeter],
] as const) {
  describe(`contrato del medidor ${name}`, () => {
    it('crea sin atributos del host y actualiza valores y presencia booleana', async () => {
      const meter = new Constructor();
      expect(meter.attributes.length).toBe(0);
      meter.setAttribute('value', '25');
      document.body.append(meter);
      if (meter instanceof LitMeter) {
        await meter.updateComplete;
      }
      expect(meter.value).toBe(25);
      expect(meter.shadowRoot?.querySelector('output')?.textContent).toContain(
        '25 / 100',
      );

      meter.value = 250;
      meter.muted = true;
      if (meter instanceof LitMeter) {
        await meter.updateComplete;
      }
      expect(meter.value).toBe(100);
      expect(meter.getAttribute('value')).toBe('100');
      expect(meter.hasAttribute('muted')).toBe(true);
      expect(meter.shadowRoot?.textContent).toContain('silenciado');

      meter.muted = false;
      meter.value = Number.NaN;
      if (meter instanceof LitMeter) {
        await meter.updateComplete;
      }
      expect(meter.value).toBe(0);
      expect(meter.hasAttribute('muted')).toBe(false);
      meter.setAttribute('muted', 'false');
      if (meter instanceof LitMeter) {
        await meter.updateComplete;
      }
      expect(meter.muted).toBe(true);
    });

    it('acepta eliminación, reconexión y cambios de atributo externos', async () => {
      const meter = new Constructor();
      document.body.append(meter);
      meter.setAttribute('value', '-10');
      if (meter instanceof LitMeter) {
        await meter.updateComplete;
      }
      expect(meter.value).toBe(0);
      meter.setAttribute('value', '70');
      if (meter instanceof LitMeter) {
        await meter.updateComplete;
      }
      expect(meter.value).toBe(70);
      meter.removeAttribute('value');
      if (meter instanceof LitMeter) {
        await meter.updateComplete;
      }
      expect(meter.value).toBe(0);
      meter.remove();
      document.body.append(meter);
      if (meter instanceof LitMeter) {
        await meter.updateComplete;
      }
      expect(meter.shadowRoot?.querySelectorAll('output')).toHaveLength(1);
    });
  });
}

it('preserva una asignación anterior al upgrade sin ocultar el setter', () => {
  const host = document.createElement('lab-meter-upgrade-case');
  host.setAttribute('value', '20');
  Object.defineProperty(host, 'value', {
    value: 75,
    configurable: true,
    writable: true,
  });
  document.body.append(host);
  class UpgradeMeter extends NativeMeter {}
  customElements.define('lab-meter-upgrade-case', UpgradeMeter);
  expect(host).toBeInstanceOf(UpgradeMeter);
  if (!(host instanceof UpgradeMeter)) {
    throw new Error('Upgrade ausente');
  }
  expect(Object.hasOwn(host, 'value')).toBe(false);
  expect(host.value).toBe(75);
  host.value = 30;
  expect(host.getAttribute('value')).toBe('30');
});

it('separa registro, upgrade de fragmento y conexión sin sustituir el host', async () => {
  const connected = document.createElement('lab-registration-note');
  const detached = document.createElement('lab-registration-note');
  const fragment = document.createDocumentFragment();
  const child = document.createElement('strong');
  connected.append(child);
  fragment.append(detached);
  document.body.append(connected);
  expect(connected).not.toBeInstanceOf(RegistrationNote);
  registerNote();
  await customElements.whenDefined('lab-registration-note');
  expect(customElements.get('lab-registration-note')).toBe(RegistrationNote);
  expect(connected).toBeInstanceOf(RegistrationNote);
  expect(connected.firstChild).toBe(child);
  expect(detached).not.toBeInstanceOf(RegistrationNote);
  customElements.upgrade(fragment);
  expect(detached).toBeInstanceOf(RegistrationNote);
  expect(detached.isConnected).toBe(false);
  expect(() =>
    customElements.define('lab-registration-note', RegistrationNote),
  ).toThrow();
  expect(() =>
    customElements.define('invalid', class extends HTMLElement {}),
  ).toThrow();
});

it('compone sin mover nodos y distingue texto mutado de nueva asignación', async () => {
  const card = new SlotCard();
  const title = document.createElement('span');
  title.slot = 'title';
  title.textContent = 'Título';
  card.append(title);
  document.body.append(card);
  await Promise.resolve();
  expect(title.parentNode).toBe(card);
  expect(card.inspectSlots()).toEqual([
    { name: 'title', nodes: 1, elements: 1 },
    { name: '(default)', nodes: 0, elements: 0 },
  ]);
  let changes = 0;
  card.addEventListener('composition-change', () => {
    changes += 1;
  });
  title.textContent = 'Nuevo título';
  await Promise.resolve();
  expect(changes).toBe(0);
  title.remove();
  await Promise.resolve();
  expect(changes).toBe(1);
  expect(card.shadowRoot?.querySelector('slot')?.assignedNodes()).toHaveLength(
    0,
  );
  expect(card.shadowRoot?.querySelector('slot')?.textContent).toBe(
    'Título de reserva',
  );
});

it('clona copias independientes, escapa datos y limita su número', () => {
  const stamp = new TemplateStamp();
  document.body.append(stamp);
  expect(stamp.stamp('<img src=x onerror=alert(1)>')).toBe(true);
  stamp.stamp('Segunda');
  expect(stamp.shadowRoot?.querySelector('img')).toBeNull();
  expect(stamp.shadowRoot?.querySelector('h3')?.textContent).toBe(
    '<img src=x onerror=alert(1)>',
  );
  for (let index = 0; index < 3; index += 1) {
    stamp.stamp('Otra');
  }
  expect(stamp.copies).toBe(5);
  expect(stamp.stamp('Sexta')).toBe(false);
  stamp.reset();
  expect(stamp.copies).toBe(0);
  expect(stamp.shadowRoot?.querySelectorAll('article')).toHaveLength(0);
});

it('expone solo la raíz open por shadowRoot', () => {
  const open = document.createElement('lab-open-frame');
  const closed = document.createElement('lab-closed-frame');
  expect(open.shadowRoot?.mode).toBe('open');
  expect(closed.shadowRoot).toBeNull();
});

it('publica composición desde slotchange con payload y propagación deliberados', async () => {
  const wrapper = document.createElement('div');
  const root = wrapper.attachShadow({ mode: 'open' });
  const card = new SlotCard();
  root.append(card);
  document.body.append(wrapper);
  await Promise.resolve();
  const received: Event[] = [];
  wrapper.addEventListener('composition-change', (event) => {
    received.push(event);
  });
  const title = document.createElement('span');
  title.slot = 'title';
  card.append(title);
  await Promise.resolve();
  expect(received).toHaveLength(1);
  const event = received[0];
  expect(event).toBeInstanceOf(CustomEvent);
  if (!(event instanceof CustomEvent)) {
    throw new Error('Evento ausente');
  }
  expect(event.bubbles).toBe(true);
  expect(event.composed).toBe(true);
  expect(event.detail).toContainEqual({ name: 'title', nodes: 1, elements: 1 });
});

it('Lit agrupa la actualización mientras el medidor nativo actualiza su output inmediatamente', async () => {
  const native = new NativeMeter();
  const lit = new LitMeter();
  document.body.append(native, lit);
  await lit.updateComplete;
  native.value = 60;
  lit.value = 60;
  expect(native.shadowRoot?.querySelector('output')?.textContent).toContain(
    '60 / 100',
  );
  expect(lit.shadowRoot?.querySelector('output')?.textContent).toContain(
    '0 / 100',
  );
  await lit.updateComplete;
  expect(lit.shadowRoot?.querySelector('output')?.textContent).toContain(
    '60 / 100',
  );
});

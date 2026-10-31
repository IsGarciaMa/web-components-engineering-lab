import { afterEach, describe, expect, it } from 'vitest';
import { LifecycleProbe } from '../../src/examples/defining/lifecycle-probe';

afterEach(() => {
  document.body.replaceChildren();
});
const ping = () => window.dispatchEvent(new Event('lab-probe-ping'));

describe('reacciones reales de la sonda', () => {
  it('separa creación, atributos desconectados y conexiones repetidas', () => {
    const probe = new LifecycleProbe();
    expect(probe.isConnected).toBe(false);
    expect(probe.activity.map((entry) => entry.callback)).toEqual([
      'constructor',
    ]);
    probe.setAttribute('label', 'Antes de conectar');
    expect(probe.activity.at(-1)).toMatchObject({
      callback: 'attributeChangedCallback',
    });
    ping();
    expect(probe.pingCount).toBe(0);
    document.body.append(probe);
    ping();
    expect(probe.pingCount).toBe(1);
    probe.remove();
    ping();
    expect(probe.pingCount).toBe(1);
    for (let index = 0; index < 5; index += 1) {
      document.body.append(probe);
      probe.remove();
    }
    document.body.append(probe);
    ping();
    expect(probe.pingCount).toBe(2);
    expect(
      probe.activity.filter((entry) => entry.callback === 'connectedCallback'),
    ).toHaveLength(7);
  });

  it('registra valores anterior/nuevo, incluso eliminación e igualdad', () => {
    const probe = new LifecycleProbe();
    probe.setAttribute('label', 'A');
    probe.setAttribute('label', 'A');
    probe.removeAttribute('label');
    expect(probe.activity.slice(1).map((entry) => entry.detail)).toEqual([
      'label: null → "A"',
      'label: "A" → "A"',
      'label: "A" → null',
    ]);
  });

  it('adopta en otro Document sin ventana y libera el listener anterior', () => {
    const probe = new LifecycleProbe();
    document.body.append(probe);
    ping();
    const other = document.implementation.createHTMLDocument('Prueba');
    other.adoptNode(probe);
    expect(probe.ownerDocument).toBe(other);
    expect(other.defaultView).toBeNull();
    expect(probe.isConnected).toBe(false);
    expect(probe.activity.at(-1)?.callback).toBe('adoptedCallback');
    ping();
    expect(probe.pingCount).toBe(1);
    document.body.append(probe);
    ping();
    expect(probe.ownerDocument).toBe(document);
    expect(probe.pingCount).toBe(2);
  });

  it('limita el historial y conserva el orden de las últimas reacciones', () => {
    const probe = new LifecycleProbe();
    for (let index = 0; index < 30; index += 1) {
      probe.setAttribute('label', String(index));
    }
    expect(probe.activity).toHaveLength(20);
    expect(probe.activity[0]?.sequence).toBe(12);
    expect(probe.activity.at(-1)?.sequence).toBe(31);
    expect(
      probe.activity.some(
        (entry) => entry.callback === 'connectedMoveCallback',
      ),
    ).toBe(false);
  });
});

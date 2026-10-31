import { afterEach, describe, expect, it } from 'vitest';
import { LitElement } from 'lit';
import { TabsPlayground } from '../../src/labs/dom/playground-lab';
import { TabsAttributesLab } from '../../src/labs/dom/attributes-lab';
import { TabsSelectionLab } from '../../src/labs/dom/selection-lab';
import { DomEventsLab } from '../../src/labs/dom/events-lab';
import { RegistryDemo } from '../../src/labs/dom/registry-demo';
import { EventProbe } from '../../src/examples/dom/event-probe';
import { NativeTabs } from '../../src/examples/dom/native-tabs';
import { LitTabs } from '../../src/examples/dom/lit-tabs';
import { domLessons, domLabs } from '../../src/data/working-with-dom';
import { parseProgress } from '../../src/components/progress/progress-contract';

afterEach(() => {
  document.body.replaceChildren();
});

async function settle(lab: LitElement): Promise<void> {
  await lab.updateComplete;
  for (const child of lab.shadowRoot?.querySelectorAll('*') ?? []) {
    if (child instanceof LitElement) {
      await child.updateComplete;
    }
  }
  await lab.updateComplete;
}
function control(lab: LitElement, name: string): HTMLButtonElement {
  const result = [...(lab.shadowRoot?.querySelectorAll('button') ?? [])].find(
    (button) => button.textContent?.trim() === name,
  );
  if (!result) {
    throw new Error(`Control ausente: ${name}`);
  }
  return result;
}
function tabsPair(lab: LitElement): { native: NativeTabs; lit: LitTabs } {
  const native = lab.shadowRoot?.querySelector('lab-native-tabs');
  const lit = lab.shadowRoot?.querySelector('lab-lit-tabs');
  if (!(native instanceof NativeTabs) || !(lit instanceof LitTabs)) {
    throw new Error('Falta pareja de Tabs');
  }
  return { native, lit };
}

describe('laboratorios Working with the DOM', () => {
  it('registra cuatro experiencias y un ejemplo opcional sin cambiar progreso anterior', () => {
    expect(domLessons).toHaveLength(8);
    expect(domLabs).toHaveLength(4);
    for (const Constructor of [
      TabsPlayground,
      TabsAttributesLab,
      TabsSelectionLab,
      DomEventsLab,
      RegistryDemo,
    ]) {
      const element = new Constructor();
      expect(customElements.get(element.localName)).toBe(Constructor);
    }
    expect(
      parseProgress(
        '{"version":2,"completedIds":["defining-lifecycle","dom-events","dom-selection"]}',
      ).completedIds,
    ).toEqual(['defining-lifecycle', 'dom-events', 'dom-selection']);
  });

  it('reconcilia metadatos de ambas versiones y consulta árboles reales', async () => {
    const lab = new TabsPlayground();
    document.body.append(lab);
    await settle(lab);
    control(lab, 'Inspeccionar árboles').click();
    await settle(lab);
    expect(lab.shadowRoot?.querySelector('pre')?.textContent).toContain(
      '"childParentIsHost": true',
    );
    control(lab, 'Añadir o retirar panel').click();
    await settle(lab);
    const { native, lit } = tabsPair(lab);
    expect(native.items).toHaveLength(4);
    expect(lit.items).toHaveLength(4);
    control(lab, 'Vaciar o restaurar pestañas').click();
    await settle(lab);
    expect(native.selected).toBe('');
    expect(lit.selected).toBe('');
  });

  it('sincroniza un cambio de usuario una sola vez sin volver a emitir en la otra vista', async () => {
    const lab = new TabsSelectionLab();
    document.body.append(lab);
    await settle(lab);
    const { native, lit } = tabsPair(lab);
    native.shadowRoot
      ?.querySelector<HTMLButtonElement>('[data-id="contract"]')
      ?.click();
    await settle(lab);
    expect(native.selected).toBe('contract');
    expect(lit.selected).toBe('contract');
    expect(lab.shadowRoot?.querySelectorAll('li')).toHaveLength(1);
    control(lab, 'Seleccionar Eventos desde JavaScript').click();
    await settle(lab);
    expect(lab.shadowRoot?.querySelectorAll('li')).toHaveLength(1);
    expect(native.selected).toBe('events');
    expect(lit.selected).toBe('events');
  });

  it('limpia el puente de listeners al desconectar y no lo duplica al volver', async () => {
    const lab = new TabsSelectionLab();
    document.body.append(lab);
    await settle(lab);
    const { native } = tabsPair(lab);
    lab.remove();
    native.dispatchEvent(
      new CustomEvent('tab-change', {
        detail: { previous: 'intro', selected: 'contract', source: 'pointer' },
      }),
    );
    document.body.append(lab);
    await settle(lab);
    expect(lab.shadowRoot?.querySelectorAll('li')).toHaveLength(0);
    native.shadowRoot
      ?.querySelector<HTMLButtonElement>('[data-id="contract"]')
      ?.click();
    await settle(lab);
    expect(lab.shadowRoot?.querySelectorAll('li')).toHaveLength(1);
  });

  it('observa retargeting y ruta real y deja de escuchar al desconectar', async () => {
    const lab = new DomEventsLab();
    document.body.append(lab);
    await settle(lab);
    const probe = lab.shadowRoot?.querySelector('lab-event-probe');
    if (!(probe instanceof EventProbe)) {
      throw new Error('Falta emisor');
    }
    probe.shadowRoot?.querySelector('button')?.click();
    await settle(lab);
    expect(lab.shadowRoot?.textContent).toContain(
      'consumidor (capture): fase 1; target lab-event-probe',
    );
    expect(lab.shadowRoot?.textContent).toContain(
      'emisor (bubble): fase 2; target button',
    );
    expect(lab.shadowRoot?.querySelectorAll('li')).toHaveLength(8);
    lab.remove();
    probe.shadowRoot?.querySelector('button')?.click();
    await lab.updateComplete;
    expect(lab.shadowRoot?.querySelectorAll('li')).toHaveLength(8);
    document.body.append(lab);
    await settle(lab);
    control(lab, 'Vaciar registro de eventos').click();
    await settle(lab);
    probe.shadowRoot?.querySelector('button')?.click();
    await settle(lab);
    expect(lab.shadowRoot?.querySelectorAll('li')).toHaveLength(8);
  });

  it('comprueba flags reales del emisor y cancelación síncrona', () => {
    const probe = new EventProbe();
    document.body.append(probe);
    let outside = 0;
    probe.addEventListener('dom-probe', () => {
      outside += 1;
    });
    probe.composed = false;
    probe.shadowRoot?.querySelector('button')?.click();
    expect(outside).toBe(0);
    probe.composed = true;
    probe.addEventListener('dom-probe', (event) => {
      event.preventDefault();
    });
    probe.shadowRoot?.querySelector('button')?.click();
    expect(outside).toBe(1);
    expect(probe.shadowRoot?.querySelector('p')?.textContent).toContain(
      'devolvió false; defaultPrevented true',
    );
    probe.cancelable = false;
    probe.shadowRoot?.querySelector('button')?.click();
    expect(probe.shadowRoot?.querySelector('p')?.textContent).toContain(
      'devolvió true; defaultPrevented false',
    );
  });
});

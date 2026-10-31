import { afterEach, describe, expect, it } from 'vitest';
import type { LitElement } from 'lit';
import { LifecycleLab } from '../../src/labs/defining/lifecycle-lab';
import { AttributesLab } from '../../src/labs/defining/attributes-lab';
import { TemplateLab } from '../../src/labs/defining/template-lab';
import { SlotsLab } from '../../src/labs/defining/slots-lab';
import { ComparisonLab } from '../../src/labs/defining/comparison-lab';
import { DebuggingLab } from '../../src/labs/defining/debugging-lab';
import { ShadowLab } from '../../src/labs/defining/shadow-lab';
import { RegistrationLab } from '../../src/labs/defining/registration-lab';
import {
  definingLessons,
  definingLabs,
} from '../../src/data/defining-web-components';
import { publishedLessons } from '../../src/data/curriculum';
import { parseProgress } from '../../src/components/progress/progress-contract';

afterEach(() => {
  document.body.replaceChildren();
});

function button(lab: LitElement, name: string): HTMLButtonElement {
  const node = [...(lab.shadowRoot?.querySelectorAll('button') ?? [])].find(
    (item) => item.textContent?.trim() === name,
  );
  if (!node) {
    throw new Error(`Falta botón ${name}`);
  }
  return node;
}

async function click(lab: LitElement, name: string): Promise<void> {
  button(lab, name).click();
  await lab.updateComplete;
}

describe('integración de laboratorios', () => {
  it('ofrece nueve unidades de progreso y ocho experimentos únicos', () => {
    expect(definingLessons).toHaveLength(9);
    expect(definingLabs).toHaveLength(8);
    expect(new Set(definingLessons.map((item) => item.id)).size).toBe(9);
    expect(publishedLessons).toHaveLength(25);
    expect(
      parseProgress(
        '{"version":2,"completedIds":["using-libraries","defining-lifecycle"]}',
      ).completedIds,
    ).toEqual(['using-libraries', 'defining-lifecycle']);
  });

  it('registra los ocho hosts de laboratorio', () => {
    for (const Constructor of [
      LifecycleLab,
      AttributesLab,
      TemplateLab,
      SlotsLab,
      ComparisonLab,
      DebuggingLab,
      ShadowLab,
      RegistrationLab,
    ]) {
      const instance = new Constructor();
      expect(customElements.get(instance.localName)).toBe(Constructor);
    }
  });

  it('controla lifecycle sin invocar callbacks y reinicia la instancia', async () => {
    const lab = new LifecycleLab();
    document.body.append(lab);
    await lab.updateComplete;
    await click(lab, 'Crear instancia');
    expect(lab.shadowRoot?.querySelectorAll('.activity li')).toHaveLength(1);
    expect(button(lab, 'Conectar').disabled).toBe(false);
    await click(lab, 'Conectar');
    await click(lab, 'Emitir señal externa');
    expect(
      lab.shadowRoot?.querySelector('[role="status"]')?.textContent,
    ).toContain('sonda: 1');
    await click(lab, 'Desconectar');
    await click(lab, 'Emitir señal externa');
    expect(
      lab.shadowRoot?.querySelector('[role="status"]')?.textContent,
    ).toContain('sonda: 1');
    await click(lab, 'Reiniciar laboratorio');
    expect(lab.shadowRoot?.querySelectorAll('.activity li')).toHaveLength(0);
    expect(button(lab, 'Conectar').disabled).toBe(true);
  });

  it('retira una sonda conectada al desmontar y permite reconectar el lab', async () => {
    const lab = new LifecycleLab();
    document.body.append(lab);
    await lab.updateComplete;
    await click(lab, 'Crear instancia');
    await click(lab, 'Conectar');
    const probe = lab.shadowRoot?.querySelector('lab-lifecycle-probe');
    lab.remove();
    window.dispatchEvent(new Event('lab-probe-ping'));
    expect(probe?.pingCount).toBe(0);
    document.body.append(lab);
    await lab.updateComplete;
    await click(lab, 'Crear instancia');
    expect(lab.shadowRoot?.querySelectorAll('.activity li')).toHaveLength(1);
  });

  it('inspecciona atributos y booleanos desde controles del consumidor', async () => {
    const lab = new AttributesLab();
    document.body.append(lab);
    await lab.updateComplete;
    await click(lab, 'Escribir atributo');
    expect(lab.shadowRoot?.querySelector('pre')?.textContent).toContain(
      '"property":25',
    );
    await click(lab, 'Eliminar atributo');
    expect(lab.shadowRoot?.querySelector('pre')?.textContent).toContain(
      '"attribute":null',
    );
    await click(lab, 'Escribir muted="false"');
    expect(lab.shadowRoot?.querySelector('pre')?.textContent).toContain(
      '"mutedProperty":true',
    );
  });

  it('limita copias desde el consumidor y las vacía', async () => {
    const lab = new TemplateLab();
    document.body.append(lab);
    await lab.updateComplete;
    for (let index = 0; index < 5; index += 1) {
      await click(lab, 'Clonar plantilla');
    }
    expect(button(lab, 'Clonar plantilla').disabled).toBe(true);
    await click(lab, 'Vaciar copias');
    expect(lab.shadowRoot?.querySelector('lab-template-stamp')?.copies).toBe(0);
  });
});

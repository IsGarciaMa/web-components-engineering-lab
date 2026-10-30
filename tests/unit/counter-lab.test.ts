import { beforeEach, describe, expect, it } from 'vitest';
import '../../src/examples/native/native-counter';
import '../../src/labs/counter-lab';

function mount() {
  const lab = document.createElement('lab-counter-lab');
  lab.innerHTML =
    '<lab-native-counter></lab-native-counter><button data-clear-events>Limpiar</button><p data-event-summary></p><ol data-event-log></ol>';
  document.body.append(lab);
  const counter = lab.querySelector('lab-native-counter');
  const clear = lab.querySelector('button');
  if (!counter || !clear) throw new Error('Faltan controles del laboratorio');
  return { lab, counter, clear };
}

beforeEach(() => document.body.replaceChildren());

describe('consumidor de eventos del laboratorio', () => {
  it('registra una interacción real y conserva el estado al limpiar', () => {
    const { lab, counter, clear } = mount();
    counter.shadowRoot?.querySelector('button')?.click();
    expect(lab.querySelector('[data-event-log]')?.textContent).toContain(
      'Nativo · count-change · { count: 1 }',
    );
    clear.click();
    expect(lab.querySelector('[data-event-log]')?.children).toHaveLength(0);
    expect(counter.count).toBe(1);
  });

  it('limita el registro a ocho eventos y no duplica listeners al reconectar', () => {
    const { lab, counter } = mount();
    lab.remove();
    document.body.append(lab);
    for (let i = 0; i < 12; i += 1)
      counter.shadowRoot?.querySelector('button')?.click();
    const rows = lab.querySelector('[data-event-log]')?.children;
    expect(rows).toHaveLength(8);
    expect(rows?.[0]?.textContent).toContain('#12');
    expect(rows?.[7]?.textContent).toContain('#5');
  });

  it('ignora payloads inválidos y emisores ajenos', () => {
    const { lab, counter } = mount();
    for (const detail of [
      null,
      '<script>',
      { count: '1' },
      { count: Infinity },
      { count: 1.2 },
    ]) {
      counter.dispatchEvent(
        new CustomEvent('count-change', { bubbles: true, detail }),
      );
    }
    lab.dispatchEvent(
      new CustomEvent('count-change', { detail: { count: 1 } }),
    );
    expect(lab.querySelector('[data-event-log]')?.children).toHaveLength(0);
  });
});

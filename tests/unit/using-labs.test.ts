import { afterEach, expect, it } from 'vitest';
import '../../src/labs/using/theme-lab';
import '../../src/labs/using/parts-lab';
import '../../src/labs/using/undefined-lab';
import { InspectorLab } from '../../src/labs/using/inspector-lab';
import '@awesome.me/webawesome/dist/components/button/button.js';
import { LitElement } from 'lit';

afterEach(() => document.body.replaceChildren());
async function mount(tag: string) {
  const element = document.createElement(tag);
  if (!(element instanceof LitElement))
    throw new Error('Falta el laboratorio Lit');
  document.body.append(element);
  await element.updateComplete;
  return element;
}
it('el paquete real registra wa-button', () => {
  expect(customElements.get('wa-button')).toBeDefined();
});
it('el laboratorio de temas cambia tokens en el consumidor y conserva la excepción', async () => {
  const lab = await mount('lab-theme-lab');
  const range = lab.shadowRoot?.querySelector('input[type="range"]');
  if (!(range instanceof HTMLInputElement)) throw new Error('Falta el rango');
  range.value = '24';
  range.dispatchEvent(new Event('input', { bubbles: true }));
  await lab.updateComplete;
  const scope = lab.shadowRoot?.querySelector('.theme-scope');
  if (!(scope instanceof HTMLElement))
    throw new Error('Falta el ámbito de tokens');
  expect(scope.style.getPropertyValue('--reader-radius')).toBe('24px');
  expect(
    lab.shadowRoot?.querySelector('lab-reading-card.local'),
  ).not.toBeNull();
  // La cascada y los estilos computados se verifican en Playwright.
});
it('el inspector limita eventos, pausa la escucha y no registra escrituras', async () => {
  const lab = new InspectorLab();
  document.body.append(lab);
  await lab.updateComplete;
  const card = lab.shadowRoot?.querySelector('lab-reading-card');
  if (!card) throw new Error('Falta la tarjeta');
  await card.updateComplete;
  card.reader = { name: 'Ada' };
  await card.updateComplete;
  expect(lab.shadowRoot?.querySelectorAll('li')).toHaveLength(0);
  for (let i = 0; i < 8; i += 1)
    card.shadowRoot?.querySelector('button')?.click();
  await lab.updateComplete;
  expect(lab.shadowRoot?.querySelectorAll('li')).toHaveLength(5);
  const pause = [...(lab.shadowRoot?.querySelectorAll('button') ?? [])].find(
    (button) => button.textContent?.trim() === 'Escuchar eventos',
  );
  if (!pause) throw new Error('Falta el control de escucha');
  pause.click();
  await lab.updateComplete;
  const previous = lab.shadowRoot?.querySelector('ol')?.textContent;
  card.reader = { name: 'Grace' };
  card.shadowRoot?.querySelector('button')?.click();
  await lab.updateComplete;
  expect(lab.shadowRoot?.querySelector('ol')?.textContent).toBe(previous);
});
it('el laboratorio de partes conserva las partes reexportadas', async () => {
  const lab = await mount('lab-parts-lab');
  const frame = lab.shadowRoot?.querySelector('lab-card-frame');
  if (!(frame instanceof LitElement)) throw new Error('Falta frame');
  await frame.updateComplete;
  expect(
    frame.shadowRoot
      ?.querySelector('lab-reading-card')
      ?.getAttribute('exportparts'),
  ).toContain('action:card-action');
  lab.shadowRoot?.querySelector('button')?.click();
  await lab.updateComplete;
  expect(lab.shadowRoot?.querySelector('.custom')).not.toBeNull();
});
it('el control de registro aplica la definición y desactiva la repetición', async () => {
  const lab = await mount('lab-undefined-lab');
  const note = lab.shadowRoot?.querySelector('lab-deferred-note');
  expect(note?.shadowRoot).toBeNull();
  const button = lab.shadowRoot?.querySelector('button');
  button?.click();
  await lab.updateComplete;
  expect(customElements.get('lab-deferred-note')).toBeDefined();
  expect(note?.shadowRoot).not.toBeNull();
  expect(button?.disabled).toBe(true);
});

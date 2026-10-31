import { afterEach, describe, expect, it, vi } from 'vitest';
import { ReadingCard } from '../../src/examples/using/reading-card';
import {
  isLessonSelection,
  normalizeReader,
} from '../../src/examples/using/selection-contract';
import { configureBasicCard } from '../../src/examples/using/basic-consumer';
import { connectExercise } from '../../src/examples/using/exercise-consumer';
import {
  DeferredNote,
  registerDeferredNote,
} from '../../src/examples/using/deferred-note';
import '../../src/examples/using/static-summary';
import '../../src/examples/frameworks/astro-consumer';

afterEach(() => document.body.replaceChildren());
async function card() {
  const element = document.createElement('lab-reading-card');
  document.body.append(element);
  await element.updateComplete;
  return element;
}
function action(element: ReadingCard) {
  const button = element.shadowRoot?.querySelector('button');
  if (!button) throw new Error('Falta la acción de la tarjeta');
  return button;
}

describe('API de consumo de la tarjeta', () => {
  it('registra una vez y expone propiedades reales, partes y slots', async () => {
    const element = await card();
    expect(customElements.get('lab-reading-card')).toBe(ReadingCard);
    expect('reader' in element).toBe(true);
    expect(element.reader).toEqual({ name: 'Visitante' });
    expect(action(element).getAttribute('part')).toBe('action');
    expect(element.shadowRoot?.querySelector('slot')).not.toBeNull();
  });
  it('separa cadenas, booleanos y objetos; normaliza y escapa el contenido', async () => {
    const element = await card();
    element.setAttribute('heading', '<img src=x onerror=alert(1)>');
    element.setAttribute('compact', 'false');
    element.reader = { name: '  Ada  ' };
    await element.updateComplete;
    expect(element.heading).toContain('<img');
    expect(element.shadowRoot?.querySelector('img')).toBeNull();
    expect(element.compact).toBe(true);
    expect(element.reader.name).toBe('Ada');
    expect(element.getAttribute('reader')).toBeNull();
    element.removeAttribute('compact');
    await element.updateComplete;
    expect(element.compact).toBe(false);
    expect(normalizeReader(null)).toEqual({ name: 'Visitante' });
    expect(normalizeReader({ name: 'x'.repeat(100) }).name).toHaveLength(80);
  });
  it('solo la acción notifica, cruza una raíz consumidora y mantiene foco', async () => {
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' });
    const element = await card();
    root.append(element);
    document.body.append(host);
    const listener = vi.fn();
    host.addEventListener('lesson-select', listener);
    element.reader = { name: 'Ada' };
    element.selected = true;
    element.reset();
    await element.updateComplete;
    expect(listener).not.toHaveBeenCalled();
    action(element).focus();
    action(element).click();
    await element.updateComplete;
    expect(listener).toHaveBeenCalledTimes(1);
    const event: unknown = listener.mock.calls[0]?.[0];
    if (!(event instanceof Event) || !isLessonSelection(event))
      throw new Error('Evento inválido');
    expect(event.detail).toEqual({
      heading: 'Using Web Components',
      readerName: 'Ada',
    });
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
    expect(element.shadowRoot?.activeElement).toBe(action(element));
    element.remove();
    document.body.append(element);
    action(element).click();
    expect(element.selected).toBe(false);
  });
  it('retirar heading recupera el texto por defecto y mantiene válido el evento', async () => {
    const element = await card();
    element.heading = 'Título temporal';
    await element.updateComplete;
    element.removeAttribute('heading');
    await element.updateComplete;
    expect(element.heading).toBe('Using Web Components');
    let valid = false;
    element.addEventListener('lesson-select', (event) => {
      valid = isLessonSelection(event);
    });
    action(element).click();
    expect(valid).toBe(true);
  });
  it('recupera un objeto asignado antes del upgrade', async () => {
    const element = document.createElement('lab-late-reading-card');
    Object.assign(element, { reader: { name: 'Grace' } });
    document.body.append(element);
    customElements.define(
      'lab-late-reading-card',
      class extends ReadingCard {},
    );
    if (!(element instanceof ReadingCard)) throw new Error('No se actualizó');
    await element.updateComplete;
    expect(element.reader.name).toBe('Grace');
    expect(element.shadowRoot?.textContent).toContain('Grace');
  });
  it('ejecuta la solución básica y limpia la suscripción intermedia', async () => {
    const host = document.createElement('div');
    const element = await card();
    element.setAttribute('compact', 'false');
    await configureBasicCard(element);
    expect(element.heading).toBe('Lectura revisada');
    expect(element.compact).toBe(false);
    const output = document.createElement('p');
    output.setAttribute('data-exercise-result', '');
    host.append(element, output);
    document.body.append(host);
    const cleanup = connectExercise(host);
    await element.updateComplete;
    expect(output.textContent).toBe('');
    expect(element.style.getPropertyValue('--reader-radius')).toBe('20px');
    action(element).click();
    expect(output.textContent).toBe('Ada: Lectura del ejercicio');
    cleanup();
    output.textContent = 'Sin escucha';
    action(element).click();
    expect(output.textContent).toBe('Sin escucha');
  });
});
it('el registro tardío conserva los mismos hijos y evita redefiniciones', () => {
  const element = document.createElement('lab-deferred-note');
  const link = document.createElement('a');
  link.href = '/ruta/';
  link.textContent = 'Continuar';
  element.append(link);
  document.body.append(element);
  expect(element.shadowRoot).toBeNull();
  registerDeferredNote();
  registerDeferredNote();
  expect(element).toBeInstanceOf(DeferredNote);
  expect(element.firstElementChild).toBe(link);
  expect(element.shadowRoot?.querySelector('slot')).not.toBeNull();
});
it('la mejora estática conserva texto y no duplica listeners al reconectar', () => {
  const element = document.createElement('lab-static-summary');
  element.innerHTML =
    '<button hidden data-summary-toggle aria-expanded="true">Alternar</button><p data-summary-detail>Texto del servidor</p>';
  document.body.append(element);
  const button = element.querySelector('button');
  const detail = element.querySelector('p');
  if (!button || !detail) throw new Error('Fixture incompleta');
  expect(button.hidden).toBe(false);
  button.click();
  expect(detail.hidden).toBe(true);
  element.remove();
  document.body.append(element);
  button.click();
  expect(detail.hidden).toBe(false);
  expect(button.getAttribute('aria-expanded')).toBe('true');
  expect(detail.textContent).toBe('Texto del servidor');
});
it('Astro consume propiedades y eventos con limpieza repetible', async () => {
  const host = document.createElement('lab-astro-consumer');
  const element = document.createElement('lab-reading-card');
  const button = document.createElement('button');
  button.setAttribute('data-set-reader', '');
  const status = document.createElement('p');
  status.setAttribute('data-astro-status', '');
  host.append(button, element, status);
  document.body.append(host);
  button.click();
  await element.updateComplete;
  expect(element.reader.name).toBe('Ada desde Astro');
  action(element).click();
  expect(status.textContent).toContain('Ada desde Astro');
  host.remove();
  status.textContent = '';
  action(element).click();
  expect(status.textContent).toBe('');
  document.body.append(host);
  action(element).click();
  expect(status.textContent).toContain('Ada desde Astro');
});

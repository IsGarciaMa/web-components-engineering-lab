import { act } from 'react';
import { afterEach, expect, it } from 'vitest';
import '../../src/examples/frameworks/react-consumer';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
afterEach(async () => {
  await act(async () => document.body.replaceChildren());
});

it('React 19.3.1 pasa un objeto, escucha el evento nativo y conserva una ref', async () => {
  const host = document.createElement('lab-react-demo');
  await act(async () => document.body.append(host));
  const card = host.querySelector('lab-reading-card');
  if (!card) throw new Error('Falta la tarjeta de React');
  await card.updateComplete;
  expect(card.reader).toEqual({ name: 'Ada' });
  expect(card.getAttribute('reader')).toBeNull();
  const buttons = host.querySelectorAll('button');
  await act(async () => buttons[0]?.click());
  await card.updateComplete;
  expect(card.reader.name).toBe('Grace');
  await act(async () => card.shadowRoot?.querySelector('button')?.click());
  expect(host.querySelector('[role="status"]')?.textContent).toContain('Grace');
  await act(async () => buttons[1]?.click());
  await card.updateComplete;
  expect(card.selected).toBe(false);
  await act(async () => host.remove());
  expect(host.querySelector('lab-reading-card')).toBeNull();
  await act(async () => document.body.append(host));
  expect(host.querySelectorAll('lab-reading-card')).toHaveLength(1);
});

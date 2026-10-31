import { createElement, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import '../using/reading-card';
import type { ReadingCard } from '../using/reading-card';
import { isLessonSelection } from '../using/selection-contract';

export function ReactConsumer() {
  const [name, setName] = useState('Ada');
  const [message, setMessage] = useState('Aún no hay eventos de React.');
  const card = useRef<ReadingCard | null>(null);
  return createElement(
    'section',
    { 'aria-label': 'Consumidor React 19.3.1' },
    createElement(
      'div',
      { className: 'using-controls' },
      createElement(
        'button',
        {
          type: 'button',
          onClick: () =>
            setName((previous) => (previous === 'Ada' ? 'Grace' : 'Ada')),
        },
        'Cambiar lector desde React',
      ),
      createElement(
        'button',
        { type: 'button', onClick: () => card.current?.reset() },
        'Restablecer mediante ref',
      ),
    ),
    createElement('lab-reading-card', {
      ref: card,
      heading: 'React consume el mismo elemento',
      reader: { name },
      'onlesson-select': (event: Event) => {
        if (isLessonSelection(event))
          setMessage(
            `React recibió lesson-select para ${event.detail.readerName}.`,
          );
      },
    }),
    createElement('p', { role: 'status' }, message),
  );
}

/** React solo posee este contenedor; el portal no modifica su árbol. */
export class ReactDemo extends HTMLElement {
  #root: Root | undefined;
  readonly #container = document.createElement('div');
  connectedCallback(): void {
    if (this.#root) return;
    this.replaceChildren(this.#container);
    this.#root = createRoot(this.#container);
    this.#root.render(createElement(ReactConsumer));
  }
  disconnectedCallback(): void {
    this.#root?.unmount();
    this.#root = undefined;
  }
}
if (!customElements.get('lab-react-demo'))
  customElements.define('lab-react-demo', ReactDemo);

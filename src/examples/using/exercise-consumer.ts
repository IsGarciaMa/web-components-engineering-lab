import './reading-card';
import { isLessonSelection } from './selection-contract';

/** Solución intermedia: devuelve una limpieza explícita al propietario. */
export function connectExercise(host: HTMLElement): () => void {
  const card = host.querySelector('lab-reading-card');
  const output = host.querySelector('[data-exercise-result]');
  if (!card || !output) throw new Error('Falta el contrato del ejercicio');
  card.setAttribute('heading', 'Lectura del ejercicio');
  card.reader = { name: 'Ada' };
  card.style.setProperty('--reader-radius', '20px');
  const controller = new AbortController();
  card.addEventListener(
    'lesson-select',
    (event) => {
      if (isLessonSelection(event))
        output.textContent = `${event.detail.readerName}: ${event.detail.heading}`;
    },
    { signal: controller.signal },
  );
  return () => controller.abort();
}

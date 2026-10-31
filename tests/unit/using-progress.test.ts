import { afterEach, describe, expect, it } from 'vitest';
import { publishedLessons } from '../../src/data/curriculum';
import {
  usingLessons,
  usingLessonHref,
} from '../../src/data/using-web-components';
import {
  legacyProgressKey,
  parseProgress,
  progressStorageKey,
} from '../../src/components/progress/progress-contract';
import { LearningProgress } from '../../src/components/progress/learning-progress';

afterEach(() => {
  document.body.replaceChildren();
  localStorage.clear();
});
function button(element: LearningProgress, name: string) {
  const control = [
    ...(element.shadowRoot?.querySelectorAll('button') ?? []),
  ].find((node) => node.textContent?.trim() === name);
  if (!control) throw new Error(`Falta ${name}`);
  return control;
}
describe('progreso versionado y ruta publicada', () => {
  it('ofrece siete lecciones con rutas únicas y veinticinco unidades de progreso', () => {
    expect(usingLessons).toHaveLength(7);
    expect(publishedLessons).toHaveLength(25);
    expect(new Set(publishedLessons.map((lesson) => lesson.id)).size).toBe(25);
    expect(usingLessonHref(usingLessons[0].slug)).toBe(
      '/capitulos/01-using-web-components/01-bibliotecas/',
    );
  });
  it('migra v1 sin perder el contador y filtra duplicados e IDs ajenos', () => {
    expect(
      parseProgress('{"version":1,"completed":true}').completedIds,
    ).toEqual(['foundation-counter']);
    expect(
      parseProgress('{"version":1,"completed":false}').completedIds,
    ).toEqual([]);
    expect(
      parseProgress(
        '{"version":2,"completedIds":["using-libraries","using-libraries","future"]}',
      ).completedIds,
    ).toEqual(['using-libraries']);
    for (const serialized of [
      '{invalid',
      'null',
      '{"version":3}',
      '{"version":2,"completedIds":[2]}',
    ])
      expect(() => parseProgress(serialized)).toThrow();
  });
  it('no escribe antes del consentimiento; completa y desmarca la lección actual', async () => {
    const element = document.createElement('lab-learning-progress');
    if (!(element instanceof LearningProgress))
      throw new Error('Registro ausente');
    element.lessonId = 'using-libraries';
    document.body.append(element);
    await element.updateComplete;
    expect(localStorage.getItem(progressStorageKey)).toBeNull();
    button(element, 'Activar progreso local').click();
    await element.updateComplete;
    button(element, 'Marcar lección como completada').click();
    await element.updateComplete;
    expect(
      parseProgress(localStorage.getItem(progressStorageKey) ?? '')
        .completedIds,
    ).toEqual(['using-libraries']);
    button(element, 'Marcar como pendiente').click();
    await element.updateComplete;
    expect(
      parseProgress(localStorage.getItem(progressStorageKey) ?? '')
        .completedIds,
    ).toEqual([]);
  });
  it('lee datos anteriores sin escribir y el borrado retira ambas versiones', async () => {
    localStorage.setItem(legacyProgressKey, '{"version":1,"completed":true}');
    const element = new LearningProgress();
    document.body.append(element);
    await element.updateComplete;
    expect(element.shadowRoot?.textContent).toMatch(/1 de 25/);
    expect(localStorage.getItem(progressStorageKey)).toBeNull();
    button(element, 'Borrar y desactivar progreso').click();
    await element.updateComplete;
    expect(localStorage.getItem(legacyProgressKey)).toBeNull();
    expect(localStorage.getItem(progressStorageKey)).toBeNull();
  });
});

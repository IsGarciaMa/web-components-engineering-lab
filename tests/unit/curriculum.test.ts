import { describe, expect, it } from 'vitest';
import { chapters, foundationLesson } from '../../src/data/curriculum';

describe('contrato editorial de PR-00', () => {
  it('mantiene once rutas únicas en orden, con objetivos y estado pendiente', () => {
    expect(chapters).toHaveLength(11);
    expect(new Set(chapters.map((chapter) => chapter.slug)).size).toBe(11);
    chapters.forEach((chapter, index) => {
      expect(chapter.slug.startsWith(String(index + 1).padStart(2, '0'))).toBe(
        true,
      );
      expect(chapter.status).toBe('pending');
      expect(chapter.objectives.length).toBeGreaterThan(0);
    });
  });
  it('mantiene la lección inicial fuera del índice de capítulos', () => {
    expect(foundationLesson.href).toBe('/guias/contador/');
    expect(
      chapters.some((chapter) => chapter.slug === foundationLesson.id),
    ).toBe(false);
  });
});

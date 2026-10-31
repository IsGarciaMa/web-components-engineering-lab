import { foundationLesson, publishedLessons } from '../../data/curriculum';
export const progressStorageKey = 'lab-learning-progress-v2';
export const legacyProgressKey = 'lab-learning-progress-v1';
export interface ProgressData {
  version: 2;
  completedIds: string[];
}

export function parseProgress(serialized: string): ProgressData {
  const value: unknown = JSON.parse(serialized);
  if (typeof value !== 'object' || value === null || !('version' in value))
    throw new Error('Esquema inválido');
  if (
    value.version === 1 &&
    'completed' in value &&
    typeof value.completed === 'boolean'
  ) {
    return {
      version: 2,
      completedIds: value.completed ? [foundationLesson.id] : [],
    };
  }
  if (
    value.version !== 2 ||
    !('completedIds' in value) ||
    !Array.isArray(value.completedIds) ||
    !value.completedIds.every((id: unknown) => typeof id === 'string')
  )
    throw new Error('Esquema inválido');
  const validIds = new Set<string>(publishedLessons.map((lesson) => lesson.id));
  return {
    version: 2,
    completedIds: [...new Set<string>(value.completedIds)].filter((id) =>
      validIds.has(id),
    ),
  };
}

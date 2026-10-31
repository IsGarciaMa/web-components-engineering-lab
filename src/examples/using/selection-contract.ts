export const defaultReadingHeading = 'Using Web Components';

export function normalizeHeading(value: unknown): string {
  return typeof value === 'string' && value.trim()
    ? value
    : defaultReadingHeading;
}

export interface Reader {
  name: string;
}
export interface LessonSelection {
  heading: string;
  readerName: string;
}

export function normalizeReader(value: unknown): Reader {
  if (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof value.name === 'string'
  ) {
    return { name: value.name.trim().slice(0, 80) || 'Visitante' };
  }
  return { name: 'Visitante' };
}

export function isLessonSelection(
  event: Event,
): event is CustomEvent<LessonSelection> {
  if (!(event instanceof CustomEvent)) return false;
  const detail: unknown = event.detail;
  return (
    typeof detail === 'object' &&
    detail !== null &&
    'heading' in detail &&
    typeof detail.heading === 'string' &&
    'readerName' in detail &&
    typeof detail.readerName === 'string'
  );
}

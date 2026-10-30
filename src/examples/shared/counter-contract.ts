/** Public count: safe integer; invalid input becomes zero; fractions truncate. */
export function normalizeCount(value: unknown): number {
  if (typeof value !== 'number' && typeof value !== 'string') return 0;

  const number = Number(value);
  if (!Number.isFinite(number)) return 0;

  return Math.max(
    Number.MIN_SAFE_INTEGER,
    Math.min(Number.MAX_SAFE_INTEGER, Math.trunc(number)),
  );
}

export interface CountChangeDetail {
  count: number;
}

export function emitCountChange(target: HTMLElement, count: number): void {
  target.dispatchEvent(
    new CustomEvent<CountChangeDetail>('count-change', {
      detail: { count },
      bubbles: true,
      composed: true,
    }),
  );
}

export const counterStyles = `
  :host { display: block; color: inherit; font: inherit; }
  .counter { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
  output { min-inline-size: 3ch; overflow-wrap: anywhere; font: 700 1.5rem/1.4 monospace; }
  button { min-block-size: 44px; padding: .6rem 1rem; border: 2px solid currentColor;
    border-radius: .4rem; background: transparent; color: inherit; font: inherit; cursor: pointer; }
  button:focus-visible { outline: 3px solid currentColor; outline-offset: 4px; }
  button:disabled { opacity: .6; cursor: default; }
  @media (forced-colors: active) { button { border-color: ButtonText; } }
`;

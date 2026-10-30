import { describe, expect, it } from 'vitest';
import { normalizeCount } from '../../src/examples/shared/counter-contract';

describe('normalización del contrato público', () => {
  it.each([
    [3, 3],
    [-2.9, -2],
    ['4.8', 4],
    ['', 0],
    ['texto', 0],
    [null, 0],
    [undefined, 0],
    [NaN, 0],
    [Infinity, 0],
    [Number.MAX_VALUE, Number.MAX_SAFE_INTEGER],
    [-Number.MAX_VALUE, Number.MIN_SAFE_INTEGER],
  ])('normaliza %s a %s', (input, expected) => {
    expect(normalizeCount(input)).toBe(expected);
  });
});

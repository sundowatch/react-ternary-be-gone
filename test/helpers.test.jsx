import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useConditionalHelpers } from '../src/useConditionalHelpers';

const helpers = () => renderHook(() => useConditionalHelpers()).result.current;

describe('useConditionalHelpers', () => {
  it('isEmpty / isNotEmpty handle nullish input', () => {
    const { isEmpty, isNotEmpty } = helpers();
    expect(isEmpty([])).toEqual({ when: true });
    expect(isEmpty(null)).toEqual({ when: true });
    expect(isEmpty(undefined)).toEqual({ when: true });
    expect(isEmpty([1])).toEqual({ when: false });
    expect(isNotEmpty([1])).toEqual({ when: true });
    expect(isNotEmpty(null)).toEqual({ when: false });
  });

  it('hasLength handles nullish input', () => {
    const { hasLength } = helpers();
    expect(hasLength([1, 2], 2)).toEqual({ when: true });
    expect(hasLength([1], 2)).toEqual({ when: false });
    expect(hasLength(null, 2)).toEqual({ when: false });
  });

  it('isEven / isOdd', () => {
    const { isEven, isOdd } = helpers();
    expect(isEven(4)).toEqual({ when: true });
    expect(isOdd(5)).toEqual({ when: true });
  });

  it('sortBy orders numbers', () => {
    const { sortBy } = helpers();
    expect([3, 1, 2].map((n) => ({ n })).sort(sortBy('n')).map((o) => o.n)).toEqual([1, 2, 3]);
    expect([3, 1, 2].map((n) => ({ n })).sort(sortBy('n', 'desc')).map((o) => o.n)).toEqual([3, 2, 1]);
  });

  // `<` compares UTF-16 code units, which orders Turkish letters wrongly.
  it('sortBy orders strings by locale', () => {
    const { sortBy } = helpers();
    const names = ['Zeynep', 'Çağla', 'Işıl', 'Ahmet', 'Ömer'].map((name) => ({ name }));
    expect(names.sort(sortBy('name')).map((o) => o.name)).toEqual(['Ahmet', 'Çağla', 'Işıl', 'Ömer', 'Zeynep']);
  });

  it('filterBy matches a field value', () => {
    const { filterBy } = helpers();
    expect([{ a: 1 }, { a: 2 }].filter(filterBy('a', 2))).toEqual([{ a: 2 }]);
  });

  it('unique dedupes by key and by extractor', () => {
    const { unique } = helpers();
    expect(unique([{ id: 1 }, { id: 2 }, { id: 1 }], 'id')).toEqual([{ id: 1 }, { id: 2 }]);
    expect(unique([{ c: 'r' }, { c: 'y' }, { c: 'r' }], (i) => i.c)).toEqual([{ c: 'r' }, { c: 'y' }]);
  });

  it('unique tolerates a nullish array', () => {
    const { unique } = helpers();
    expect(unique(null, 'id')).toEqual([]);
  });

  it('returns a stable object across renders', () => {
    const { result, rerender } = renderHook(() => useConditionalHelpers());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});

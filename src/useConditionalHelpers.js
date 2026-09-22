import { useMemo } from 'react';

export const useConditionalHelpers = () => {
  return useMemo(() => ({
    // Quick condition helpers
    isEmpty: (array) => ({ when: !array || array.length === 0 }),
    isNotEmpty: (array) => ({ when: Boolean(array && array.length > 0) }),
    hasLength: (array, length) => ({ when: Boolean(array && array.length === length) }),
    isEven: (num) => ({ when: num % 2 === 0 }),
    isOdd: (num) => ({ when: num % 2 !== 0 }),

    // Array processing helpers
    sortBy: (field, order = 'asc') => (a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      // `<`/`>` compare strings by raw UTF-16 code unit, which misorders
      // accented letters (Ç, Ğ, İ, Ö, Ş, Ü, ...). localeCompare sorts them
      // the way a person reading the list would expect.
      let comparison;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      } else {
        comparison = 0;
      }

      return order === 'asc' ? comparison : -comparison;
    },
    filterBy: (field, value) => (item) => item[field] === value,
    unique: (array, key) => {
      if (!array) return [];
      const seen = new Set();
      return array.filter(item => {
        const keyValue = typeof key === 'function' ? key(item) : item[key];
        const isNew = !seen.has(keyValue);
        seen.add(keyValue);
        return isNew;
      });
    },
  }), []);
};

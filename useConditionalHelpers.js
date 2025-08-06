import { useMemo } from 'react';

export const useConditionalHelpers = () => {
  return useMemo(() => ({
    // Quick condition helpers
    isEmpty: (array) => ({ when: !array || array.length === 0 }),
    isNotEmpty: (array) => ({ when: array && array.length > 0 }),
    hasLength: (array, length) => ({ when: array && array.length === length }),
    isEven: (num) => ({ when: num % 2 === 0 }),
    isOdd: (num) => ({ when: num % 2 !== 0 }),

    // Array processing helpers
    sortBy: (field, order = 'asc') => (a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    },
    filterBy: (field, value) => (item) => item[field] === value,
    unique: (array, key) => {
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
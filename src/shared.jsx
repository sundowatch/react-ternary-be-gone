import React from 'react';

// Pure helper: apply filter/sort/reverse/limit to an `each` array without
// mutating the caller's array (Array.prototype.sort/reverse mutate in place,
// so every step works off a copy). Shared by `Conditional`'s `each` mode,
// its If/ElseIf/Else branches, and `<For>`.
export const processArray = (array, { filter, sort, reverse, limit }) => {
  if (!Array.isArray(array)) return [];

  let result = [...array];
  if (typeof filter === 'function') result = result.filter(filter);
  if (typeof sort === 'function') result = result.sort(sort);
  if (reverse) result = result.reverse();
  if (typeof limit === 'number') result = result.slice(0, limit);
  return result;
};

// Pure helper: render one React.Fragment per item, guarding the render-prop
// call so static children (a plain element instead of a function) don't
// crash when they reach an iteration path.
export const renderIterableChildren = (items, children, keyExtractor) =>
  items.map((item, index) => (
    <React.Fragment key={keyExtractor ? keyExtractor(item, index) : index}>
      {typeof children === 'function' ? children(item, index, items) : children}
    </React.Fragment>
  ));

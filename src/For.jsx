import React from 'react';
import { processArray, renderIterableChildren } from './shared';
import { warnOnce } from './markers';

/**
 * Iterates `each`, rendering `children(item, index, items)` for each entry.
 *
 * Unlike `<Conditional each={x}>`, `children` here must be a function - not
 * also a static ReactNode. That removes an entire class of bug (a render-prop
 * call landing on something that isn't a function) by construction instead
 * of by guarding against it.
 *
 * `each={undefined}`/`each={null}` (e.g. `each={data?.items}` before a
 * fetch resolves) are treated as an empty list, rendering `empty` (or
 * `fallback`) rather than crashing.
 *
 *   <For each={users} empty={<p>No users.</p>}>
 *     {(user) => <p key={user.id}>{user.name}</p>}
 *   </For>
 *
 * No hooks, no browser-only APIs: safe to call from a Server Component.
 */
const For = ({
  each,
  children,
  fallback = null,
  empty = null,
  keyExtractor = (item, index) => index,
  filter = null,
  sort = null,
  limit = null,
  reverse = false,
  wrapper: Wrapper = React.Fragment,
}) => {
  if (process.env.NODE_ENV !== 'production' && typeof children !== 'function') {
    warnOnce(
      '[react-ternary-be-gone] <For> expects `children` to be a function: ' +
      '(item, index, items) => ReactNode.'
    );
  }

  const items = processArray(each, { filter, sort, reverse, limit });

  if (items.length === 0) {
    return empty || fallback;
  }

  const elements = renderIterableChildren(items, children, keyExtractor);
  return <Wrapper>{elements}</Wrapper>;
};

export default For;

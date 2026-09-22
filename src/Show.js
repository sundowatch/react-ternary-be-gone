/**
 * Renders `children` when `when` is truthy, `fallback` otherwise.
 *
 * Prefer this over `<Conditional when={x}>` when the branch needs the value
 * itself: `children` may be a function that receives `when`, which
 * TypeScript narrows to a non-nullish type in the .d.ts - exactly what
 * `x && <Foo x={x} />` gives you for free and `<Conditional>` cannot,
 * because it never hands the value back.
 *
 *   <Show when={user} fallback={<Login />}>
 *     {(u) => <p>{u.name}</p>}
 *   </Show>
 *
 * No hooks, no browser-only APIs: safe to call from a Server Component.
 */
const Show = ({ when, children, fallback = null }) => {
  if (!when) return fallback;
  return typeof children === 'function' ? children(when) : children;
};

export default Show;

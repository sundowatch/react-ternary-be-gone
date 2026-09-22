import { markerKindOf, flattenBranches, MATCH } from './markers';

/**
 * Renders the first `<Match when={...}>` whose condition is truthy, or
 * `fallback` if none match - a chain of if/else-if/else expressed as
 * markup instead of nested ternaries.
 *
 *   <Switch fallback={<p>Unknown.</p>}>
 *     <Match when={status === 'loading'}><Spinner /></Match>
 *     <Match when={status === 'error'}>{() => <Alert>{error}</Alert>}</Match>
 *   </Switch>
 *
 * `when` here is a boolean condition per branch, same as `<If>/<ElseIf>`.
 * For matching one value against several cases, `<Conditional switch={value}>`
 * with `<Case when="a">` remains the right tool - it's a different, unrelated
 * feature that happens to share the word "switch".
 *
 * No hooks, no browser-only APIs: safe to call from a Server Component.
 */
const Switch = ({ children, fallback = null }) => {
  const branches = flattenBranches(children).filter(
    (child) => child && markerKindOf(child) === MATCH
  );
  const winner = branches.find((child) => Boolean(child.props.when));

  if (!winner) return fallback;

  const { when, children: branchChildren } = winner.props;
  return typeof branchChildren === 'function' ? branchChildren(when) : branchChildren;
};

export default Switch;

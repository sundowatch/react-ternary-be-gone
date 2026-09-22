import React, { useMemo, useEffect } from 'react';
import { warnOnce, markerKindOf, flattenBranches, IF, ELSE_IF, ELSE, CASE } from './markers';
import { processArray, renderIterableChildren } from './shared';

const Conditional = (props) => {
  const {
    when,
    each,
    children,
    fallback = null,
    empty = null,
    loading = false,
    loadingFallback = null,
    error = null,
    errorFallback = null,
    keyExtractor = (item, index) => index,
    // New features
    filter = null,
    sort = null,
    limit = null,
    reverse = false,
    animate = false,
    wrapper: Wrapper = React.Fragment,
    debug = false,
    onRender = null,
    // Conditional rendering helpers
    gt = null, // greater than
    lt = null, // less than
    eq = null, // equal
    ne = null, // not equal
    includes = null,
    startsWith = null,
    endsWith = null,
    match: matchProp = null, // regex match
    // Switch-case feature
    switch: switchValue,
    ...rest
  } = props;

  if (process.env.NODE_ENV !== 'production' && Object.keys(rest).length > 0) {
    warnOnce(
      `[react-ternary-be-gone] <Conditional> received unrecognised prop(s): ${Object.keys(rest).join(', ')}. ` +
      'Check for a typo - they were ignored.'
    );
  }

  // `each={undefined}` (e.g. `each={data?.items}` before data loads) must
  // still enter iteration mode so `empty`/fallback render instead of trying
  // to hand a render-prop function to React as a child. Distinguishing "each
  // was never passed" from "each was passed as undefined" needs the raw
  // props object - destructuring can't tell them apart.
  const hasIteration = 'each' in props;

  const hasComparisonProp = [gt, lt, eq, ne, includes, startsWith, endsWith, matchProp].some(
    (value) => value !== null && typeof value === 'object'
  );
  const hasCondition = when !== undefined || hasComparisonProp;

  // Advanced condition evaluation
  const evaluateCondition = useMemo(() => {
    if (when !== undefined) return Boolean(when);

    // Numerical comparisons
    if (gt !== null && typeof gt === 'object') {
      const { value, target } = gt;
      return value > target;
    }
    if (lt !== null && typeof lt === 'object') {
      const { value, target } = lt;
      return value < target;
    }
    if (eq !== null && typeof eq === 'object') {
      const { value, target } = eq;
      return value === target;
    }
    if (ne !== null && typeof ne === 'object') {
      const { value, target } = ne;
      return value !== target;
    }

    // String operations
    if (includes !== null && typeof includes === 'object') {
      const { value, target } = includes;
      return String(value).includes(target);
    }
    if (startsWith !== null && typeof startsWith === 'object') {
      const { value, target } = startsWith;
      return String(value).startsWith(target);
    }
    if (endsWith !== null && typeof endsWith === 'object') {
      const { value, target } = endsWith;
      return String(value).endsWith(target);
    }
    if (matchProp !== null && typeof matchProp === 'object') {
      const { value, pattern } = matchProp;
      return new RegExp(pattern).test(String(value));
    }

    return true;
  }, [when, gt, lt, eq, ne, includes, startsWith, endsWith, matchProp]);

  // Array processing
  const processedArray = useMemo(() => {
    const result = processArray(each, { filter, sort, reverse, limit });

    if (debug) {
      console.log('Conditional Debug:', {
        original: each,
        processed: result,
        filter: !!filter,
        sort: !!sort,
        reverse,
        limit
      });
    }

    return result;
  }, [each, filter, sort, reverse, limit, debug]);

  // Render callback
  useEffect(() => {
    if (onRender && typeof onRender === 'function') {
      onRender({
        condition: evaluateCondition,
        itemCount: processedArray.length,
        hasCondition,
        hasIteration
      });
    }
  }, [evaluateCondition, processedArray.length, hasCondition, hasIteration, onRender]);

  // Loading state
  if (loading) {
    return loadingFallback || fallback || <div className="conditional-loading">Loading...</div>;
  }

  // Error state
  if (error) {
    if (errorFallback) {
      return typeof errorFallback === 'function' ? errorFallback(error) : errorFallback;
    }
    return <div className="conditional-error">Error: {error}</div>;
  }

  // Switch-case logic. Presence, not strict inequality to `undefined`, is
  // what enters this mode - `switch={status}` must still honour `default`
  // while `status` is legitimately undefined before data loads, the same
  // reasoning as the `each` presence check above.
  if ('switch' in props) {
    const caseChildren = flattenBranches(children).filter(
      (child) => child && markerKindOf(child) === CASE
    );
    // `.find()` stops at the first hit, matching how a real `switch` picks
    // the first matching branch instead of the last one.
    const matchedCase = caseChildren.find(
      (child) => !child.props.default && child.props.when === switchValue
    );
    const defaultCase = caseChildren.find((child) => child.props.default);

    if (matchedCase) {
      return <Wrapper>{matchedCase.props.children}</Wrapper>;
    }
    if (defaultCase) {
      return <Wrapper>{defaultCase.props.children}</Wrapper>;
    }
    return fallback;
  }

  // If-ElseIf-Else logic
  const branches = flattenBranches(children).filter(
    (child) => child && [IF, ELSE_IF, ELSE].includes(markerKindOf(child))
  );
  if (branches.length > 0) {
    let rendered = fallback;

    for (const branch of branches) {
      const kind = markerKindOf(branch);
      const {
        when: branchWhen,
        each: branchEach,
        filter: branchFilter,
        sort: branchSort,
        limit: branchLimit,
        reverse: branchReverse,
        wrapper: BranchWrapper = React.Fragment,
        keyExtractor: branchKeyExtractor,
        empty: branchEmpty,
        fallback: branchFallback,
        children: branchChildren,
      } = branch.props;

      const matches = kind === ELSE || Boolean(branchWhen);
      if (!matches) continue;

      if ('each' in branch.props) {
        const items = processArray(branchEach, {
          filter: branchFilter,
          sort: branchSort,
          reverse: branchReverse,
          limit: branchLimit,
        });
        rendered = items.length === 0
          ? (branchEmpty || branchFallback || null)
          : <BranchWrapper>{renderIterableChildren(items, branchChildren, branchKeyExtractor)}</BranchWrapper>;
      } else {
        rendered = <BranchWrapper>{branchChildren}</BranchWrapper>;
      }
      break;
    }
    return rendered;
  }

  // Only condition
  if (hasCondition && !hasIteration) {
    return evaluateCondition ? <Wrapper>{children}</Wrapper> : fallback;
  }

  // Only iteration
  if (!hasCondition && hasIteration) {
    if (processedArray.length === 0) {
      return empty || fallback;
    }

    const elements = renderIterableChildren(processedArray, children, keyExtractor);
    // React.Fragment rejects unknown props like `className`, so the default
    // wrapper is swapped for a real host element whenever `animate` needs
    // somewhere to put the class.
    const AnimatedWrapper = animate && Wrapper === React.Fragment ? 'div' : Wrapper;

    return (
      <AnimatedWrapper {...(animate ? { className: 'conditional-animated' } : null)}>
        {elements}
      </AnimatedWrapper>
    );
  }

  // Both condition and iteration
  if (hasCondition && hasIteration) {
    if (!evaluateCondition) return fallback;
    if (processedArray.length === 0) return empty || fallback;

    const elements = renderIterableChildren(processedArray, children, keyExtractor);
    return <Wrapper>{elements}</Wrapper>;
  }

  return <Wrapper>{children}</Wrapper>;
};

export default Conditional;

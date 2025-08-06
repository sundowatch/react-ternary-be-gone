import React, { useMemo, useEffect } from 'react';

const Conditional = ({
  when,
  each,
  children,
  fallback = null,
  empty = null,
  loading = false,
  error = null,
  keyExtractor = (item, index) => index,
  // New features
  filter = null,
  sort = null,
  limit = null,
  reverse = false,
  animate = false,
  wrapper = React.Fragment,
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
  match = null, // regex match
}) => {
  const hasCondition = when !== undefined;
  const hasIteration = each !== undefined;

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
    if (match !== null && typeof match === 'object') {
      const { value, pattern } = match;
      return new RegExp(pattern).test(String(value));
    }

    return true;
  }, [when, gt, lt, eq, ne, includes, startsWith, endsWith, match]);

  // Array processing
  const processedArray = useMemo(() => {
    if (!hasIteration || !Array.isArray(each)) return [];

    let result = [...each];

    // Apply filter
    if (filter && typeof filter === 'function') {
      result = result.filter(filter);
    }

    // Apply sort
    if (sort && typeof sort === 'function') {
      result = result.sort(sort);
    }

    // Apply reverse
    if (reverse) {
      result = result.reverse();
    }

    // Apply limit
    if (limit && typeof limit === 'number') {
      result = result.slice(0, limit);
    }

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
  }, [each, filter, sort, reverse, limit, hasIteration, debug]);

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
    return fallback || <div className="conditional-loading">Loading...</div>;
  }

  // Error state
  if (error) {
    return <div className="conditional-error">Error: {error}</div>;
  }

  // Wrapper component
  const WrapperComponent = wrapper;

  // Only condition
  if (hasCondition && !hasIteration) {
    return evaluateCondition ? (
      <WrapperComponent>
        {children}
      </WrapperComponent>
    ) : fallback;
  }

  // Only iteration
  if (!hasCondition && hasIteration) {
    if (processedArray.length === 0) {
      return empty || fallback;
    }

    const elements = processedArray.map((item, index) => (
      <React.Fragment key={keyExtractor(item, index)}>
        {typeof children === 'function' ? children(item, index, processedArray) : children}
      </React.Fragment>
    ));

    return animate ? (
      <WrapperComponent className="conditional-animated">
        {elements}
      </WrapperComponent>
    ) : (
      <WrapperComponent>
        {elements}
      </WrapperComponent>
    );
  }

  // Both condition and iteration
  if (hasCondition && hasIteration) {
    if (!evaluateCondition) return fallback;
    if (processedArray.length === 0) return empty || fallback;

    const elements = processedArray.map((item, index) => (
      <React.Fragment key={keyExtractor(item, index)}>
        {children(item, index, processedArray)}
      </React.Fragment>
    ));

    return (
      <WrapperComponent>
        {elements}
      </WrapperComponent>
    );
  }

  return <WrapperComponent>{children}</WrapperComponent>;
};

export default Conditional;
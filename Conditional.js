import React, { useMemo, useEffect } from 'react';
import Case from './Case';
import If from './If';
import ElseIf from './ElseIf';
import Else from './Else';

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
  // Switch-case feature
  switch: switchValue,
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

  // Switch-case logic
  if (switchValue !== undefined) {
    // Find all Case children
    const caseChildren = React.Children.toArray(children).filter(
      child => child && child.type === Case
    );
    // Find matching case
    let match = null;
    let defaultCase = null;
    caseChildren.forEach(child => {
      if (child.props.default) {
        defaultCase = child;
      } else if (child.props.when === switchValue) {
        match = child;
      }
    });
    if (match) {
      return <WrapperComponent>{match.props.children}</WrapperComponent>;
    } else if (defaultCase) {
      return <WrapperComponent>{defaultCase.props.children}</WrapperComponent>;
    } else {
      return fallback;
    }
  }

  // If-ElseIf-Else logic
  const childrenArray = React.Children.toArray(children);
  const ifElseBlocks = childrenArray.filter(child =>
    child && (child.type === If || child.type === ElseIf || child.type === Else)
  );
  if (ifElseBlocks.length > 0) {
    let rendered = null;
    for (let i = 0; i < ifElseBlocks.length; i++) {
      const child = ifElseBlocks[i];
      // Extract Conditional props from child
      const {
        when,
        each,
        filter,
        sort,
        limit,
        reverse,
        animate,
        wrapper: childWrapper,
        keyExtractor: childKeyExtractor,
        empty: childEmpty,
        fallback: childFallback,
        ...rest
      } = child.props;

      // Evaluate condition
      let condition = true;
      if (child.type === If || child.type === ElseIf) {
        condition = Boolean(when);
      }

      // Array processing for each
      let arrayItems = [];
      if (each && Array.isArray(each)) {
        arrayItems = [...each];
        if (filter && typeof filter === 'function') {
          arrayItems = arrayItems.filter(filter);
        }
        if (sort && typeof sort === 'function') {
          arrayItems = arrayItems.sort(sort);
        }
        if (reverse) {
          arrayItems = arrayItems.reverse();
        }
        if (limit && typeof limit === 'number') {
          arrayItems = arrayItems.slice(0, limit);
        }
      }

      // Render logic
      if ((child.type === If || child.type === ElseIf) && condition) {
        if (each && Array.isArray(each)) {
          if (arrayItems.length === 0) {
            rendered = childEmpty || childFallback || null;
            break;
          }
          const elements = arrayItems.map((item, idx) => (
            <React.Fragment key={childKeyExtractor ? childKeyExtractor(item, idx) : idx}>
              {typeof child.props.children === 'function'
                ? child.props.children(item, idx, arrayItems)
                : child.props.children}
            </React.Fragment>
          ));
          rendered = childWrapper
            ? React.createElement(childWrapper, null, elements)
            : <>{elements}</>;
          break;
        } else {
          rendered = childWrapper
            ? React.createElement(childWrapper, null, child.props.children)
            : <>{child.props.children}</>;
          break;
        }
      }
      if (child.type === Else) {
        if (each && Array.isArray(each)) {
          if (arrayItems.length === 0) {
            rendered = childEmpty || childFallback || null;
            break;
          }
          const elements = arrayItems.map((item, idx) => (
            <React.Fragment key={childKeyExtractor ? childKeyExtractor(item, idx) : idx}>
              {typeof child.props.children === 'function'
                ? child.props.children(item, idx, arrayItems)
                : child.props.children}
            </React.Fragment>
          ));
          rendered = childWrapper
            ? React.createElement(childWrapper, null, elements)
            : <>{elements}</>;
          break;
        } else {
          rendered = childWrapper
            ? React.createElement(childWrapper, null, child.props.children)
            : <>{child.props.children}</>;
          break;
        }
      }
    }
    return rendered;
  }

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
import React from 'react';

// Branch markers (`If`, `ElseIf`, `Else`, `Case`, `Match`) are never rendered
// by React when they are used correctly: their parent (`Conditional` or
// `Switch`) reads their props and renders the winning branch itself. They
// exist only so that JSX can express the shape.
//
// Identifying them by reference (`child.type === If`) breaks as soon as two
// copies of this package end up in node_modules, so each marker carries a
// static tag instead.

export const IF = 'if';
export const ELSE_IF = 'elseif';
export const ELSE = 'else';
export const CASE = 'case';
export const MATCH = 'match';

const TAG = '$$rtbgMarker';

const warned = new Set();

export const warnOnce = (message) => {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(message);
};

export const createMarker = (name, kind, parentName) => {
  // Rendering nothing is the safe default: a marker that slipped outside its
  // parent must not leak the content it was meant to gate.
  const Marker = () => {
    if (process.env.NODE_ENV !== 'production') {
      warnOnce(
        `[react-ternary-be-gone] <${name}> only works as a child of <${parentName}>. ` +
        'It rendered nothing.'
      );
    }
    return null;
  };

  Marker.displayName = name;
  Marker[TAG] = kind;
  return Marker;
};

export const markerKindOf = (element) =>
  (element && element.type && element.type[TAG]) || null;

// `React.Children.toArray` flattens arrays produced by `.map()`, but an
// author-written `<>...</>` around a set of branches is itself a single
// Fragment element in the tree - its contents need an explicit unwrap or
// branch markers inside one are never seen by the scanner that looks for
// them.
export const flattenBranches = (children) => {
  const result = [];
  React.Children.toArray(children).forEach((child) => {
    if (child && child.type === React.Fragment) {
      result.push(...flattenBranches(child.props.children));
    } else {
      result.push(child);
    }
  });
  return result;
};

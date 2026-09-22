// Branch markers (`If`, `ElseIf`, `Else`, `Case`) are never rendered by React
// when they are used correctly: `Conditional` reads their props and renders the
// winning branch itself. They exist only so that JSX can express the shape.
//
// Identifying them by reference (`child.type === If`) breaks as soon as two
// copies of this package end up in node_modules, so each marker carries a
// static tag instead.

export const IF = 'if';
export const ELSE_IF = 'elseif';
export const ELSE = 'else';
export const CASE = 'case';

const TAG = '$$rtbgMarker';

const warned = new Set();

export const warnOnce = (message) => {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(message);
};

export const createMarker = (name, kind) => {
  // Rendering nothing is the safe default: a marker that slipped outside a
  // `Conditional` must not leak the content it was meant to gate.
  const Marker = () => {
    if (process.env.NODE_ENV !== 'production') {
      warnOnce(
        `[react-ternary-be-gone] <${name}> only works as a child of <Conditional>. ` +
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

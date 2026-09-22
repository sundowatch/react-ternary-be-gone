import * as React from 'react';

/** Every value JavaScript treats as falsy, minus `NaN` (not its own type). */
type Falsy = false | 0 | '' | null | undefined;

// ---------------------------------------------------------------------------
// Show / For / Switch / Match
//
// The typed, narrowing-friendly primitives. Prefer these in new code -
// `<Conditional>` below stays fully supported, but `when`/`each` on it are
// typed as `unknown`/`unknown[]` because one prop bag has to cover five
// different modes, so TypeScript can't narrow anything inside its children.
// Show/For/Match hand the checked value back through a render-prop instead,
// which narrows exactly like `value && children(value)` does natively.
// ---------------------------------------------------------------------------

export interface ShowProps<T> {
  when: T | Falsy;
  /** A plain node, or a function receiving the truthy, narrowed `when`. */
  children: React.ReactNode | ((value: Exclude<T, Falsy>) => React.ReactNode);
  fallback?: React.ReactNode;
}
/** Renders `children` when `when` is truthy, `fallback` otherwise. */
export function Show<T>(props: ShowProps<T>): React.ReactElement | null;

export interface ForProps<T> {
  each: readonly T[] | null | undefined;
  children: (item: T, index: number, items: readonly T[]) => React.ReactNode;
  fallback?: React.ReactNode;
  /** Rendered when `each` is empty; falls back to `fallback` if omitted. */
  empty?: React.ReactNode;
  keyExtractor?: (item: T, index: number) => React.Key;
  filter?: (item: T) => boolean;
  sort?: (a: T, b: T) => number;
  limit?: number;
  reverse?: boolean;
  /** Host element or component to wrap the rendered items in. @default React.Fragment */
  wrapper?: React.ElementType;
}
/** Renders `children(item, index, items)` for each entry of `each`. */
export function For<T>(props: ForProps<T>): React.ReactElement | null;

export interface SwitchProps {
  /** `<Match>` elements (optionally inside a fragment or produced by `.map()`). */
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
/**
 * Renders the first child `<Match>` whose `when` is truthy, or `fallback`.
 * A chain of if/else-if/else expressed as markup instead of nested ternaries.
 */
export function Switch(props: SwitchProps): React.ReactElement | null;

export interface MatchProps<T> {
  when: T | Falsy;
  children: React.ReactNode | ((value: Exclude<T, Falsy>) => React.ReactNode);
}
/** Only meaningful as a direct (or fragment-wrapped) child of `<Switch>`. */
export function Match<T>(props: MatchProps<T>): null;

// ---------------------------------------------------------------------------
// Conditional - the original, all-in-one API. Fully supported; Show/For/
// Switch/Match cover the same ground with real narrowing where Conditional
// cannot offer it, because `when`/`each` here have to stay typed loosely
// enough to cover all five of Conditional's modes in one prop bag.
// ---------------------------------------------------------------------------

export interface Comparison<T> {
  value: T;
  target: T;
}
export interface StringComparison {
  value: unknown;
  target: string;
}
export interface MatchComparison {
  value: unknown;
  pattern: string;
}

export interface ConditionalProps<T = unknown> {
  when?: unknown;
  each?: readonly T[] | null;
  children?:
    | React.ReactNode
    | ((item: T, index: number, items: readonly T[]) => React.ReactNode);
  fallback?: React.ReactNode;
  /** Rendered when `each` is empty; falls back to `fallback` if omitted. */
  empty?: React.ReactNode;
  loading?: boolean;
  /** Rendered while `loading` is true, taking priority over `fallback`. */
  loadingFallback?: React.ReactNode;
  error?: unknown;
  /** Rendered instead of the default "Error: ..." message when `error` is set. */
  errorFallback?: React.ReactNode | ((error: unknown) => React.ReactNode);
  keyExtractor?: (item: T, index: number) => React.Key;
  filter?: (item: T) => boolean;
  sort?: (a: T, b: T) => number;
  limit?: number;
  reverse?: boolean;
  /** Adds the `conditional-animated` class; define that class yourself. */
  animate?: boolean;
  /** Host element or component to wrap the rendered output in. @default React.Fragment */
  wrapper?: React.ElementType;
  debug?: boolean;
  onRender?: (info: {
    condition: boolean;
    itemCount: number;
    hasCondition: boolean;
    hasIteration: boolean;
  }) => void;
  /** @deprecated Use `when={value > target}` instead - see `<Show>`. */
  gt?: Comparison<number>;
  /** @deprecated Use `when={value < target}` instead - see `<Show>`. */
  lt?: Comparison<number>;
  /** @deprecated Use `when={value === target}` instead - see `<Show>`. */
  eq?: Comparison<unknown>;
  /** @deprecated Use `when={value !== target}` instead - see `<Show>`. */
  ne?: Comparison<unknown>;
  /** @deprecated Use `when={String(value).includes(target)}` instead - see `<Show>`. */
  includes?: StringComparison;
  /** @deprecated Use `when={String(value).startsWith(target)}` instead - see `<Show>`. */
  startsWith?: StringComparison;
  /** @deprecated Use `when={String(value).endsWith(target)}` instead - see `<Show>`. */
  endsWith?: StringComparison;
  /** @deprecated Use `when={new RegExp(pattern).test(String(value))}` instead - see `<Show>`. */
  match?: MatchComparison;
  /** Value to match against child `<Case when={...}>` elements. */
  switch?: unknown;
}
/**
 * All-in-one conditional rendering / iteration / switch / if-else-if
 * component. See `<Show>`, `<For>`, and `<Switch>`/`<Match>` for narrower,
 * TypeScript-narrowing-friendly alternatives covering the same ground.
 */
export default function Conditional<T = unknown>(
  props: ConditionalProps<T>
): React.ReactElement | null;

export interface CaseProps {
  when?: unknown;
  /** Renders when no sibling `<Case when={...}>` matched the `switch` value. */
  default?: boolean;
  children?: React.ReactNode;
}
/** Only meaningful as a direct (or fragment-wrapped) child of `<Conditional switch={...}>`. */
export function Case(props: CaseProps): null;

export interface BranchProps<T = unknown> {
  when?: unknown;
  each?: readonly T[] | null;
  children?:
    | React.ReactNode
    | ((item: T, index: number, items: readonly T[]) => React.ReactNode);
  filter?: (item: T) => boolean;
  sort?: (a: T, b: T) => number;
  limit?: number;
  reverse?: boolean;
  wrapper?: React.ElementType;
  keyExtractor?: (item: T, index: number) => React.Key;
  empty?: React.ReactNode;
  fallback?: React.ReactNode;
}
/** Only meaningful as a direct (or fragment-wrapped) child of a bare `<Conditional>`. */
export function If<T = unknown>(props: BranchProps<T>): null;
/** Only meaningful as a direct (or fragment-wrapped) child of a bare `<Conditional>`. */
export function ElseIf<T = unknown>(props: BranchProps<T>): null;
/** Only meaningful as a direct (or fragment-wrapped) child of a bare `<Conditional>`. */
export function Else<T = unknown>(props: Omit<BranchProps<T>, 'when'>): null;

// ---------------------------------------------------------------------------
// useConditionalHelpers
// ---------------------------------------------------------------------------

export interface ConditionalHelpers {
  isEmpty(array: readonly unknown[] | null | undefined): { when: boolean };
  isNotEmpty(array: readonly unknown[] | null | undefined): { when: boolean };
  hasLength(array: readonly unknown[] | null | undefined, length: number): { when: boolean };
  isEven(num: number): { when: boolean };
  isOdd(num: number): { when: boolean };
  sortBy<T>(field: keyof T, order?: 'asc' | 'desc'): (a: T, b: T) => number;
  filterBy<T>(field: keyof T, value: T[keyof T]): (item: T) => boolean;
  unique<T>(array: readonly T[] | null | undefined, key: keyof T | ((item: T) => unknown)): T[];
}
export function useConditionalHelpers(): ConditionalHelpers;

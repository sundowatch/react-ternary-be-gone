// Compiled by `npm run typecheck` (tsc --noEmit against this directory).
// This isn't just "does the .d.ts parse" - it asserts the actual reason
// Show/For/Switch/Match exist: real narrowing that <Conditional> can't
// offer. If a future edit to src/index.d.ts loosens that, this file stops
// compiling.

import Conditional, {
  If, ElseIf, Else, Case,
  Show, For, Switch, Match,
  useConditionalHelpers,
} from 'react-ternary-be-gone';

interface User {
  id: number;
  name: string;
}

// --- Show: the value handed to the render-prop must be narrowed ----------
function ShowDemo({ user }: { user: User | null }) {
  return (
    <Show when={user} fallback={<p>no user</p>}>
      {(u) => <p>{u.name.toUpperCase()}</p>}
    </Show>
  );
}

// `u` narrows to `User`, not `User | null` - a param typed as the wide
// union is not assignable to what <Show> expects, so this must fail.
function ShowNarrowingIsEnforced({ user }: { user: User | null }) {
  return (
    <Show when={user}>
      {/* @ts-expect-error - `u` must be narrowed to `User`, not `User | null` */}
      {(u: User | null) => <p>{u.name}</p>}
    </Show>
  );
}

// --- For: item type flows through to children/keyExtractor ---------------
function ForDemo({ users }: { users: User[] }) {
  return (
    <For each={users} keyExtractor={(u) => u.id}>
      {(u, i, all) => (
        <p key={u.id}>
          {i}/{all.length}: {u.name}
        </p>
      )}
    </For>
  );
}

// --- Switch/Match: Match narrows the same way Show does ------------------
function SwitchDemo({ user }: { user: User | null }) {
  return (
    <Switch fallback={<p>none</p>}>
      <Match when={user}>{(u) => <p>{u.name}</p>}</Match>
    </Switch>
  );
}

// --- Conditional: the original, loosely-typed all-in-one API -------------
function ConditionalDemo({ users, status }: { users: User[]; status: string }) {
  return (
    <>
      <Conditional when={users.length > 0}>
        <p>has users</p>
      </Conditional>
      <Conditional each={users}>{(u) => <p key={u.id}>{u.name}</p>}</Conditional>
      <Conditional switch={status}>
        <Case when="a">A</Case>
        <Case default>D</Case>
      </Conditional>
      <Conditional>
        <If when={status === 'loading'}>
          <p>loading</p>
        </If>
        <ElseIf when={status === 'error'}>
          <p>error</p>
        </ElseIf>
        <Else>
          <p>ok</p>
        </Else>
      </Conditional>
      {/* deprecated (see the @deprecated tags in index.d.ts) but still typed and functional */}
      <Conditional gt={{ value: 10, target: 5 }}>
        <p>gt</p>
      </Conditional>
    </>
  );
}

// --- useConditionalHelpers -------------------------------------------------
function HelpersDemo({ items }: { items: User[] }) {
  const { isEmpty, sortBy, unique } = useConditionalHelpers();
  const sorted: User[] = [...items].sort(sortBy('name'));
  const uniqueItems: User[] = unique(items, 'id');
  return (
    <Conditional {...isEmpty(items)}>
      <p>
        empty (sorted: {sorted.length}, unique: {uniqueItems.length})
      </p>
    </Conditional>
  );
}

export { ShowDemo, ShowNarrowingIsEnforced, ForDemo, SwitchDemo, ConditionalDemo, HelpersDemo };

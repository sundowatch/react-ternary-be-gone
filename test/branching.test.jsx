import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Conditional, { Case, If, ElseIf, Else } from '../src/index';

const html = (ui) => render(ui).container.innerHTML;

describe('switch / Case', () => {
  it('renders the matching case', () => {
    expect(html(
      <Conditional switch="b">
        <Case when="a">A</Case>
        <Case when="b">B</Case>
      </Conditional>
    )).toBe('B');
  });

  it('renders the default case when nothing matches', () => {
    expect(html(
      <Conditional switch="z">
        <Case when="a">A</Case>
        <Case default>D</Case>
      </Conditional>
    )).toBe('D');
  });

  it('renders the fallback when nothing matches and there is no default', () => {
    expect(html(
      <Conditional switch="z" fallback={<p>fb</p>}>
        <Case when="a">A</Case>
      </Conditional>
    )).toBe('<p>fb</p>');
  });

  // A real `switch` runs the first matching branch; this ran the last one.
  it('renders the FIRST matching case', () => {
    expect(html(
      <Conditional switch="a">
        <Case when="a">FIRST</Case>
        <Case when="a">SECOND</Case>
      </Conditional>
    )).toBe('FIRST');
  });

  // Rendered every case concatenated.
  it('treats an undefined switch value as no match', () => {
    expect(html(
      <Conditional switch={undefined}>
        <Case when="a">A</Case>
        <Case default>D</Case>
      </Conditional>
    )).toBe('D');
  });

  it('matches a null switch value against a null case', () => {
    expect(html(
      <Conditional switch={null}>
        <Case when={null}>NULL</Case>
        <Case default>D</Case>
      </Conditional>
    )).toBe('NULL');
  });

  it('accepts cases produced by map()', () => {
    expect(html(
      <Conditional switch="b">
        {['a', 'b'].map((v) => <Case key={v} when={v}>{v.toUpperCase()}</Case>)}
      </Conditional>
    )).toBe('B');
  });

  it('ignores falsy children between cases', () => {
    expect(html(
      <Conditional switch="b">
        <Case when="a">A</Case>
        {false}
        {null}
        <Case when="b">B</Case>
      </Conditional>
    )).toBe('B');
  });
});

describe('If / ElseIf / Else', () => {
  it('renders the If branch when it matches', () => {
    expect(html(
      <Conditional>
        <If when={true}>IF</If>
        <ElseIf when={true}>ELSEIF</ElseIf>
        <Else>ELSE</Else>
      </Conditional>
    )).toBe('IF');
  });

  it('renders the first matching ElseIf', () => {
    expect(html(
      <Conditional>
        <If when={false}>IF</If>
        <ElseIf when={true}>FIRST</ElseIf>
        <ElseIf when={true}>SECOND</ElseIf>
        <Else>ELSE</Else>
      </Conditional>
    )).toBe('FIRST');
  });

  it('renders Else when nothing matches', () => {
    expect(html(
      <Conditional>
        <If when={false}>IF</If>
        <Else>ELSE</Else>
      </Conditional>
    )).toBe('ELSE');
  });

  // Silently ignored the fallback; switch mode honoured it.
  it('renders the fallback when nothing matches and there is no Else', () => {
    expect(html(
      <Conditional fallback={<p>fb</p>}>
        <If when={false}>IF</If>
      </Conditional>
    )).toBe('<p>fb</p>');
  });

  it('renders nothing when nothing matches and there is no Else or fallback', () => {
    expect(html(<Conditional><If when={false}>IF</If></Conditional>)).toBe('');
  });

  // Branches were not recognised through a fragment, so EVERY branch rendered.
  it('recognises branches wrapped in a fragment', () => {
    expect(html(
      <Conditional>
        <>
          <If when={true}>IF</If>
          <Else>ELSE</Else>
        </>
      </Conditional>
    )).toBe('IF');
  });

  it('ignores falsy children between branches', () => {
    expect(html(
      <Conditional>
        <If when={false}>IF</If>
        {null}
        <Else>ELSE</Else>
      </Conditional>
    )).toBe('ELSE');
  });

  it('supports each/filter on a branch', () => {
    const users = [{ id: 1, name: 'Alice', active: true }, { id: 2, name: 'Bob', active: false }];
    expect(html(
      <Conditional>
        <If when={users.length > 0} each={users} filter={(u) => u.active}>
          {(u) => <p>{u.name}</p>}
        </If>
        <Else><p>none</p></Else>
      </Conditional>
    )).toBe('<p>Alice</p>');
  });

  it('renders a branch `empty` when its filtered list is empty', () => {
    expect(html(
      <Conditional>
        <If when={true} each={[1, 3]} filter={(n) => n % 2 === 0} empty={<p>none</p>}>
          {(n) => <p>{n}</p>}
        </If>
      </Conditional>
    )).toBe('<p>none</p>');
  });

  it('supports a nested Conditional inside a branch', () => {
    expect(html(
      <Conditional>
        <If when={true}>
          <Conditional when={false}><p>inner</p></Conditional>
          <p>outer</p>
        </If>
      </Conditional>
    )).toBe('<p>outer</p>');
  });
});

// Standalone markers used to render their children, silently leaking content
// that was meant to be conditional.
describe('markers used outside Conditional', () => {
  it('If renders nothing', () => {
    expect(html(<If when={false}>SECRET</If>)).toBe('');
    expect(html(<If when={true}>SECRET</If>)).toBe('');
  });

  it('ElseIf renders nothing', () => {
    expect(html(<ElseIf when={true}>SECRET</ElseIf>)).toBe('');
  });

  it('Else renders nothing', () => {
    expect(html(<Else>SECRET</Else>)).toBe('');
  });

  it('Case renders nothing', () => {
    expect(html(<Case when="x">SECRET</Case>)).toBe('');
  });
});

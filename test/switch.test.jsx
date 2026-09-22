import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Switch from '../src/Switch';
import Match from '../src/Match';

const html = (ui) => render(ui).container.innerHTML;

describe('Switch / Match', () => {
  it('renders the first matching Match', () => {
    expect(html(
      <Switch>
        <Match when={false}>A</Match>
        <Match when={true}>B</Match>
        <Match when={true}>C</Match>
      </Switch>
    )).toBe('B');
  });

  it('renders fallback when nothing matches', () => {
    expect(html(
      <Switch fallback={<p>none</p>}>
        <Match when={false}>A</Match>
      </Switch>
    )).toBe('<p>none</p>');
  });

  it('renders nothing when nothing matches and there is no fallback', () => {
    expect(html(<Switch><Match when={false}>A</Match></Switch>)).toBe('');
  });

  it('passes the truthy `when` value to a function child (narrowing use case)', () => {
    const user = { name: 'Alice' };
    expect(html(
      <Switch>
        <Match when={user}>{(u) => <p>{u.name}</p>}</Match>
      </Switch>
    )).toBe('<p>Alice</p>');
  });

  it('recognises Match branches wrapped in a fragment', () => {
    expect(html(
      <Switch>
        <>
          <Match when={false}>A</Match>
          <Match when={true}>B</Match>
        </>
      </Switch>
    )).toBe('B');
  });

  it('ignores falsy children between branches', () => {
    expect(html(
      <Switch>
        <Match when={false}>A</Match>
        {null}
        <Match when={true}>B</Match>
      </Switch>
    )).toBe('B');
  });

  it('supports Match branches produced by map()', () => {
    expect(html(
      <Switch>
        {['a', 'b'].map((v) => <Match key={v} when={v === 'b'}>{v.toUpperCase()}</Match>)}
      </Switch>
    )).toBe('B');
  });
});

describe('Match used outside Switch', () => {
  it('renders nothing', () => {
    expect(html(<Match when={true}>SECRET</Match>)).toBe('');
  });
});

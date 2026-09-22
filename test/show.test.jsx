import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import Show from '../src/Show';

const html = (ui) => render(ui).container.innerHTML;

describe('Show', () => {
  it('renders children when `when` is truthy', () => {
    expect(html(<Show when={true}><p>yes</p></Show>)).toBe('<p>yes</p>');
  });

  it('renders fallback when `when` is falsy', () => {
    expect(html(<Show when={false} fallback={<p>fb</p>}><p>no</p></Show>)).toBe('<p>fb</p>');
  });

  it('renders nothing when `when` is falsy and there is no fallback', () => {
    expect(html(<Show when={null}><p>no</p></Show>)).toBe('');
  });

  it('passes the truthy value to a function child', () => {
    const user = { name: 'Alice' };
    expect(html(<Show when={user}>{(u) => <p>{u.name}</p>}</Show>)).toBe('<p>Alice</p>');
  });

  it('does not call the function child when `when` is falsy', () => {
    const spy = vi.fn(() => <p>should not render</p>);
    expect(html(<Show when={null}>{spy}</Show>)).toBe('');
    expect(spy).not.toHaveBeenCalled();
  });

  it('accepts a plain (non-function) child', () => {
    expect(html(<Show when={1}><p>static</p></Show>)).toBe('<p>static</p>');
  });

  it('coerces truthy/falsy the same way `Boolean` does', () => {
    expect(html(<Show when={0}><p>no</p></Show>)).toBe('');
    expect(html(<Show when={''}><p>no</p></Show>)).toBe('');
    expect(html(<Show when={'x'}><p>yes</p></Show>)).toBe('<p>yes</p>');
  });
});

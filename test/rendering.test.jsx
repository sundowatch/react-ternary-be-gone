import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Conditional from '../src/Conditional';

const html = (ui) => render(ui).container.innerHTML;

describe('loading', () => {
  it('renders the default loading node', () => {
    expect(html(<Conditional loading><p>data</p></Conditional>)).toBe('<div class="conditional-loading">Loading...</div>');
  });

  it('prefers an explicit loadingFallback over fallback', () => {
    expect(html(
      <Conditional loading loadingFallback={<p>spinner</p>} fallback={<p>fb</p>}><p>data</p></Conditional>
    )).toBe('<p>spinner</p>');
  });

  it('falls back to `fallback` when no loadingFallback is given', () => {
    expect(html(<Conditional loading fallback={<p>fb</p>}><p>data</p></Conditional>)).toBe('<p>fb</p>');
  });

  it('renders children normally when not loading', () => {
    expect(html(<Conditional loading={false} when><p>data</p></Conditional>)).toBe('<p>data</p>');
  });
});

describe('error', () => {
  it('renders the default error node', () => {
    expect(html(<Conditional error="boom"><p>data</p></Conditional>)).toBe('<div class="conditional-error">Error: boom</div>');
  });

  it('renders an explicit errorFallback instead', () => {
    expect(html(<Conditional error="boom" errorFallback={<span>bad</span>}><p>data</p></Conditional>)).toBe('<span>bad</span>');
  });

  it('accepts a function errorFallback receiving the error', () => {
    expect(html(<Conditional error="boom" errorFallback={(e) => <span>{e}!</span>}><p>data</p></Conditional>)).toBe('<span>boom!</span>');
  });

  it('treats null and undefined as no error', () => {
    expect(html(<Conditional error={null} when><p>data</p></Conditional>)).toBe('<p>data</p>');
    expect(html(<Conditional error={undefined} when><p>data</p></Conditional>)).toBe('<p>data</p>');
  });
});

describe('wrapper', () => {
  it('wraps iterated children in a host element', () => {
    expect(html(<Conditional each={['a', 'b']} wrapper="ul">{(i) => <li>{i}</li>}</Conditional>)).toBe('<ul><li>a</li><li>b</li></ul>');
  });

  it('wraps conditional children in a host element', () => {
    expect(html(<Conditional when wrapper="section"><p>x</p></Conditional>)).toBe('<section><p>x</p></section>');
  });

  it('accepts a custom component', () => {
    const Box = ({ children }) => <div className="box">{children}</div>;
    expect(html(<Conditional when wrapper={Box}><p>x</p></Conditional>)).toBe('<div class="box"><p>x</p></div>');
  });

  it('does not wrap the fallback', () => {
    expect(html(<Conditional when={false} wrapper="ul" fallback={<p>fb</p>}><li>x</li></Conditional>)).toBe('<p>fb</p>');
  });
});

// `animate` silently did nothing: the class was handed to React.Fragment,
// which drops unknown props.
describe('animate', () => {
  it('applies the animation class using a div when no wrapper is given', () => {
    expect(html(<Conditional each={['a']} animate>{(i) => <p>{i}</p>}</Conditional>)).toBe('<div class="conditional-animated"><p>a</p></div>');
  });

  it('applies the animation class to an explicit wrapper', () => {
    expect(html(<Conditional each={['a']} animate wrapper="ul">{(i) => <li>{i}</li>}</Conditional>)).toBe('<ul class="conditional-animated"><li>a</li></ul>');
  });
});

describe('onRender', () => {
  it('reports condition and item count', () => {
    const onRender = vi.fn();
    render(<Conditional each={[1, 2, 3]} onRender={onRender}>{(i) => <i>{i}</i>}</Conditional>);
    expect(onRender).toHaveBeenCalledWith(expect.objectContaining({
      condition: true, itemCount: 3, hasCondition: false, hasIteration: true,
    }));
  });

  it('reports a failing condition', () => {
    const onRender = vi.fn();
    render(<Conditional when={false} onRender={onRender}><p>x</p></Conditional>);
    expect(onRender).toHaveBeenCalledWith(expect.objectContaining({
      condition: false, hasCondition: true, hasIteration: false,
    }));
  });
});

describe('unknown props', () => {
  const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  afterEach(() => spy.mockClear());

  // A typo silently rendered the children unconditionally.
  it('warns in development about an unrecognised prop', () => {
    render(<Conditional whenn={false}><p>x</p></Conditional>);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('whenn'));
  });

  it('does not warn for a bare Conditional', () => {
    render(<Conditional><p>x</p></Conditional>);
    expect(spy).not.toHaveBeenCalled();
  });
});

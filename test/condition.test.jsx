import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Conditional from '../src/Conditional';

const html = (ui) => render(ui).container.innerHTML;

describe('when', () => {
  it('renders children when true', () => {
    expect(html(<Conditional when={true}><p>yes</p></Conditional>)).toBe('<p>yes</p>');
  });

  it('renders nothing when false', () => {
    expect(html(<Conditional when={false}><p>no</p></Conditional>)).toBe('');
  });

  it('renders the fallback when false', () => {
    expect(html(<Conditional when={false} fallback={<p>fb</p>}><p>no</p></Conditional>)).toBe('<p>fb</p>');
  });

  it('coerces truthy/falsy values', () => {
    expect(html(<Conditional when={0}><p>no</p></Conditional>)).toBe('');
    expect(html(<Conditional when={''}><p>no</p></Conditional>)).toBe('');
    expect(html(<Conditional when={null}><p>no</p></Conditional>)).toBe('');
    expect(html(<Conditional when={'x'}><p>yes</p></Conditional>)).toBe('<p>yes</p>');
  });
});

// Every one of these props is documented in the README but had no effect,
// because the component only treated `when` as a condition.
describe('comparison props', () => {
  const cases = [
    ['gt', { value: 10, target: 5 }, { value: 5, target: 10 }],
    ['lt', { value: 3, target: 7 }, { value: 7, target: 3 }],
    ['eq', { value: 'a', target: 'a' }, { value: 'a', target: 'b' }],
    ['ne', { value: 1, target: 2 }, { value: 1, target: 1 }],
    ['includes', { value: 'hello world', target: 'world' }, { value: 'hello world', target: 'zzz' }],
    ['startsWith', { value: 'hello world', target: 'hello' }, { value: 'hello world', target: 'zzz' }],
    ['endsWith', { value: 'hello world', target: 'world' }, { value: 'hello world', target: 'zzz' }],
    ['match', { value: 'hello 123', pattern: '\\d+' }, { value: 'hello', pattern: '\\d+' }],
  ];

  it.each(cases)('%s renders children when the comparison holds', (prop, truthy) => {
    expect(html(<Conditional {...{ [prop]: truthy }}><p>yes</p></Conditional>)).toBe('<p>yes</p>');
  });

  it.each(cases)('%s renders nothing when the comparison fails', (prop, _truthy, falsy) => {
    expect(html(<Conditional {...{ [prop]: falsy }}><p>leak</p></Conditional>)).toBe('');
  });

  it.each(cases)('%s honours fallback when the comparison fails', (prop, _truthy, falsy) => {
    expect(html(<Conditional {...{ [prop]: falsy }} fallback={<p>fb</p>}><p>leak</p></Conditional>)).toBe('<p>fb</p>');
  });

  it('lets an explicit `when` win over a comparison prop', () => {
    expect(html(<Conditional when={false} gt={{ value: 10, target: 1 }}><p>leak</p></Conditional>)).toBe('');
  });
});

describe('each', () => {
  it('iterates with a render prop', () => {
    expect(html(<Conditional each={['a', 'b']}>{(item) => <p>{item}</p>}</Conditional>)).toBe('<p>a</p><p>b</p>');
  });

  it('passes item, index and the processed array', () => {
    const seen = [];
    render(<Conditional each={['a', 'b']}>{(item, i, arr) => { seen.push([item, i, arr.length]); return null; }}</Conditional>);
    expect(seen).toEqual([['a', 0, 2], ['b', 1, 2]]);
  });

  it('repeats static children for each item', () => {
    expect(html(<Conditional each={[1, 2]}><p>x</p></Conditional>)).toBe('<p>x</p><p>x</p>');
  });

  it('renders `empty` for an empty array', () => {
    expect(html(<Conditional each={[]} empty={<p>none</p>}>{(i) => <p>{i}</p>}</Conditional>)).toBe('<p>none</p>');
  });

  it('falls back to `fallback` for an empty array when `empty` is absent', () => {
    expect(html(<Conditional each={[]} fallback={<p>fb</p>}>{(i) => <p>{i}</p>}</Conditional>)).toBe('<p>fb</p>');
  });

  // `each={data?.items}` before the data has loaded must not blow up.
  it('treats undefined as an empty list', () => {
    expect(html(<Conditional each={undefined} empty={<p>none</p>}>{(i) => <p>{i}</p>}</Conditional>)).toBe('<p>none</p>');
  });

  it('treats null as an empty list', () => {
    expect(html(<Conditional each={null} empty={<p>none</p>}>{(i) => <p>{i}</p>}</Conditional>)).toBe('<p>none</p>');
  });

  it('does not mutate the source array when sorting', () => {
    const src = [3, 1, 2];
    render(<Conditional each={src} sort={(a, b) => a - b}>{(i) => <i>{i}</i>}</Conditional>);
    expect(src).toEqual([3, 1, 2]);
  });

  it('does not mutate the source array when reversing', () => {
    const src = [1, 2, 3];
    render(<Conditional each={src} reverse>{(i) => <i>{i}</i>}</Conditional>);
    expect(src).toEqual([1, 2, 3]);
  });

  it('applies filter, sort, reverse and limit', () => {
    expect(html(<Conditional each={[1, 2, 3, 4, 5, 6]} filter={(n) => n % 2 === 0}>{(n) => <i>{n}</i>}</Conditional>)).toBe('<i>2</i><i>4</i><i>6</i>');
    expect(html(<Conditional each={[3, 1, 2]} sort={(a, b) => a - b}>{(n) => <i>{n}</i>}</Conditional>)).toBe('<i>1</i><i>2</i><i>3</i>');
    expect(html(<Conditional each={[1, 2, 3]} reverse>{(n) => <i>{n}</i>}</Conditional>)).toBe('<i>3</i><i>2</i><i>1</i>');
    expect(html(<Conditional each={[1, 2, 3, 4]} limit={2}>{(n) => <i>{n}</i>}</Conditional>)).toBe('<i>1</i><i>2</i>');
  });

  it('uses keyExtractor without crashing on duplicate values', () => {
    expect(html(<Conditional each={[{ id: 7 }, { id: 8 }]} keyExtractor={(u) => u.id}>{(u) => <i>{u.id}</i>}</Conditional>)).toBe('<i>7</i><i>8</i>');
  });
});

describe('when + each together', () => {
  it('renders the list when the condition holds', () => {
    expect(html(<Conditional when={true} each={['a']}>{(i) => <p>{i}</p>}</Conditional>)).toBe('<p>a</p>');
  });

  it('renders the fallback when the condition fails', () => {
    expect(html(<Conditional when={false} each={['a']} fallback={<p>fb</p>}>{(i) => <p>{i}</p>}</Conditional>)).toBe('<p>fb</p>');
  });

  // This threw "children is not a function".
  it('accepts static children', () => {
    expect(html(<Conditional when={true} each={[1, 2]}><p>x</p></Conditional>)).toBe('<p>x</p><p>x</p>');
  });
});

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import For from '../src/For';

const html = (ui) => render(ui).container.innerHTML;

describe('For', () => {
  it('iterates each item with index and the full array', () => {
    const seen = [];
    render(<For each={['a', 'b']}>{(item, i, arr) => { seen.push([item, i, arr.length]); return null; }}</For>);
    expect(seen).toEqual([['a', 0, 2], ['b', 1, 2]]);
  });

  it('renders items in order', () => {
    expect(html(<For each={['a', 'b']}>{(item) => <p>{item}</p>}</For>)).toBe('<p>a</p><p>b</p>');
  });

  it('renders `empty` for an empty array', () => {
    expect(html(<For each={[]} empty={<p>none</p>}>{(i) => <p>{i}</p>}</For>)).toBe('<p>none</p>');
  });

  it('falls back to `fallback` when `empty` is absent', () => {
    expect(html(<For each={[]} fallback={<p>fb</p>}>{(i) => <p>{i}</p>}</For>)).toBe('<p>fb</p>');
  });

  it('treats undefined/null as an empty list instead of crashing', () => {
    expect(html(<For each={undefined} empty={<p>none</p>}>{(i) => <p>{i}</p>}</For>)).toBe('<p>none</p>');
    expect(html(<For each={null} empty={<p>none</p>}>{(i) => <p>{i}</p>}</For>)).toBe('<p>none</p>');
  });

  it('applies filter, sort, reverse and limit', () => {
    expect(html(<For each={[1, 2, 3, 4, 5, 6]} filter={(n) => n % 2 === 0}>{(n) => <i>{n}</i>}</For>)).toBe('<i>2</i><i>4</i><i>6</i>');
    expect(html(<For each={[3, 1, 2]} sort={(a, b) => a - b}>{(n) => <i>{n}</i>}</For>)).toBe('<i>1</i><i>2</i><i>3</i>');
    expect(html(<For each={[1, 2, 3]} reverse>{(n) => <i>{n}</i>}</For>)).toBe('<i>3</i><i>2</i><i>1</i>');
    expect(html(<For each={[1, 2, 3, 4]} limit={2}>{(n) => <i>{n}</i>}</For>)).toBe('<i>1</i><i>2</i>');
  });

  it('does not mutate the source array when sorting/reversing', () => {
    const src = [3, 1, 2];
    render(<For each={src} sort={(a, b) => a - b}>{(i) => <i>{i}</i>}</For>);
    expect(src).toEqual([3, 1, 2]);
  });

  it('uses a custom keyExtractor without crashing', () => {
    expect(html(<For each={[{ id: 7 }, { id: 8 }]} keyExtractor={(u) => u.id}>{(u) => <i>{u.id}</i>}</For>)).toBe('<i>7</i><i>8</i>');
  });

  it('wraps items in a host element via `wrapper`', () => {
    expect(html(<For each={['a', 'b']} wrapper="ul">{(i) => <li>{i}</li>}</For>)).toBe('<ul><li>a</li><li>b</li></ul>');
  });

  describe('non-function children', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    afterEach(() => spy.mockClear());

    it('warns in development instead of silently misbehaving', () => {
      render(<For each={['a']}><p>static</p></For>);
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('<For>'));
    });
  });
});

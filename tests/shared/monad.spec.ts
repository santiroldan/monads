import { Monad } from '@/shared/monad';
import { describe, expect, it } from 'vitest';

class MockMonad<T> implements Monad<T> {
  constructor(public readonly value: T) {}

  public map<U>(fn: (value: T) => U): Monad<U> {
    return new MockMonad(fn(this.value));
  }

  public flatMap<U>(fn: (value: T) => Monad<U>): Monad<U> {
    const result = fn(this.value);
    
		if (!(result instanceof MockMonad)) {
      throw new Error('flatMap must return a Monad');
    }
    
		return result;
  }
}

describe('Monad', () => {
  it('should apply flatMap correctly', () => {
    const monad = new MockMonad(5);
    const result = monad.flatMap(value => new MockMonad(value * 2)) as MockMonad<number>;
    expect(result).toBeInstanceOf(MockMonad);
    expect(result.value).toBe(10);
  });

  it('should chain flatMap calls correctly', () => {
    const monad = new MockMonad(5);
    const result = monad
      .flatMap(value => new MockMonad(value * 2))
      .flatMap(value => new MockMonad(value + 3)) as MockMonad<number>;

    expect(result).toBeInstanceOf(MockMonad);
    expect(result.value).toBe(13);
  });

  it('should handle flatMap with different types', () => {
    const monad = new MockMonad(5);
    const result = monad.flatMap(value => new MockMonad(value.toString())) as MockMonad<string>;

    expect(result).toBeInstanceOf(MockMonad);
    expect(result.value).toBe('5');
  });

  it('should apply map correctly', () => {
    const monad = new MockMonad(3);
    const result = monad.map(value => value * 3) as MockMonad<number>;

    expect(result).toBeInstanceOf(MockMonad);
    expect(result.value).toBe(9);
  });

  it('should handle flatMap returning null or undefined gracefully', () => {
    const monad = new MockMonad(5);
    expect(() => monad.flatMap(() => null as unknown as Monad<number>)).toThrow('flatMap must return a Monad');
	});

  it('should throw an error if flatMap does not return a Monad', () => {
    const monad = new MockMonad(5);
    expect(() => monad.flatMap(() => 10 as unknown as Monad<number>)).toThrow('flatMap must return a Monad');
	});
});
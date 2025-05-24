import { Future } from 'src/future/future';
import { describe, expect, it } from 'vitest';

describe('Future', () => {
  it('should create a Future instance', () => {
    const future = Future.of(() => Promise.resolve(42));
    expect(future).toBeInstanceOf(Future);
  });

  it('should map a value correctly', async () => {
    const future = Future.of(() => Promise.resolve(42));
    const mappedFuture = future.map(value => value + 1);
    const result = await mappedFuture.complete(value => value, error => { throw error; });
    expect(result).toBe(43);
  });

  it('should flatMap a value correctly', async () => {
    const future = Future.of(() => Promise.resolve(42));
    const flatMappedFuture = future.flatMap(value => Future.of(() => Promise.resolve(value + 1)));
    const result = await flatMappedFuture.complete(value => value, error => { throw error; });
    expect(result).toBe(43);
  });

  it('should handle success in complete method', async () => {
    const future = Future.of(() => Promise.resolve(42));
    const result = await future.complete(value => value, error => { throw error; });
    expect(result).toBe(42);
  });

  it('should handle failure in complete method', async () => {
    const future = Future.of(() => Promise.reject(new Error('Test error')));
    const result = await future.complete(
      value => value,
      error => error.message
    );
    expect(result).toBe('Test error');
  });
});


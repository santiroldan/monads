import { Matchable } from '@/shared/matchable';
import { describe, expect, it } from 'vitest';

class TestMatchable implements Matchable<number, string> {
	constructor(private readonly value: number | string) {}

	match<S>(fn: (value: number) => S, otherFn: (other: string) => S): S {
		if (typeof this.value === 'number') {
			return fn(this.value);
		}
		
		return otherFn(this.value);
	}
}

describe('Matchable', () => {
	it('should match number value', () => {
		const matchable = new TestMatchable(42);
		const result = matchable.match(
			(value) => `Number: ${value}`,
			(other) => `String: ${other}`
		);
		expect(result).toBe('Number: 42');
	});

	it('should match string value', () => {
		const matchable = new TestMatchable('hello world');
		const result = matchable.match(
			(value) => `Number: ${value}`,
			(other) => `String: ${other}`
		);
		expect(result).toBe('String: hello world');
	});
});
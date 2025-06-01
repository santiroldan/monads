import {describe, expect, it} from 'vitest';
import {Reader} from '@/monads/reader/reader';

describe('Reader', () => {
    it('should create a Reader with of and return the value with run', () => {
        const reader = Reader.of<number, string>('hello');
        expect(reader.run(42)).toBe('hello');
    });

    it('should return the environment with ask', () => {
        const reader = Reader.ask<number>();
        expect(reader.run(123)).toBe(123);
    });

    it('should map the value inside Reader', () => {
        const reader = Reader.of<number, number>(5).map(x => x * 2);
        expect(reader.run(0)).toBe(10);
    });

    it('should flatMap and chain Readers', () => {
        const reader = Reader.of<number, number>(3).flatMap(x =>
            Reader.of<number, string>(`Value is ${x}`)
        );
        expect(reader.run(0)).toBe('Value is 3');
    });

    it('should pass the environment through flatMap', () => {
        const reader = Reader.ask<{ name: string }>().flatMap(env =>
            Reader.of<{ name: string }, string>(`Hello, ${env.name}`)
        );
        expect(reader.run({ name: 'Alice' })).toBe('Hello, Alice');
    });
});
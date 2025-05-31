import { describe, it, expect } from 'vitest';
import { IO } from '@/io/io';

describe('IO', () => {
    it('should create an IO from a function and run it', () => {
        const io = IO.of(() => 42);
        expect(io.run()).toBe(42);
    });

    it('should map the value inside IO', () => {
        const io = IO.of(() => 10).map(x => x * 2);
        expect(io.run()).toBe(20);
    });

    it('should flatMap and chain IO computations', () => {
        const io = IO.of(() => 5).flatMap(x => IO.of(() => x + 3));
        expect(io.run()).toBe(8);
    });

    it('should not execute the effect until run is called', () => {
        let executed = false;
        const io = IO.of(() => {
            executed = true;
            return 1;
        });
        expect(executed).toBe(false);
        io.run();
        expect(executed).toBe(true);
    });
});
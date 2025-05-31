import {Task} from '@/task/task';
import {describe, expect, it, vi} from 'vitest';

describe('Task', () => {
    it('should create a Task instance', () => {
        const task = Task.of(() => Promise.resolve(42));

        expect(task).toBeInstanceOf(Task);
    });

    it('should run and resolve to the expected value', async () => {
        const task = Task.of(() => Promise.resolve(42));
        const result = await task.run();

        expect(result).toBe(42);
    });

    it('should map a value correctly', async () => {
        const task = Task.of(() => Promise.resolve(42));
        const mapped = task.map(value => value + 1);
        const result = await mapped.run();

        expect(result).toBe(43);
    });

    it('should flatMap a value correctly', async () => {
        const task = Task.of(() => Promise.resolve(42));
        const flatMapped = task.flatMap(value => Task.of(() => Promise.resolve(value + 1)));
        const result = await flatMapped.run();

        expect(result).toBe(43);
    });

    it('should handle success in complete method', async () => {
        const task = Task.of(() => Promise.resolve(42));
        const result = await task.complete(
            value => `Success: ${value}`,
            () => 'Error'
        );

        expect(result).toBe('Success: 42');
    });

    it('should handle failure in complete method', async () => {
        const task = Task.of(() => Promise.reject(new Error('Test error')));
        const result = await task.complete(
            () => 'Success',
            error => `Error: ${error.message}`
        );

        expect(result).toBe('Error: Test error');
    });

    it('should be lazy and not execute until run or complete is called', async () => {
        const effect = vi.fn(() => Promise.resolve(123));
        const task = Task.of(effect);

        expect(effect).not.toHaveBeenCalled();

        await task.run();

        expect(effect).toHaveBeenCalledTimes(1);
    });
});

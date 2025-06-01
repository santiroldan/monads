import {describe, expect, it} from 'vitest';
import {Either, Task, TaskEither} from '@/monads';

describe('TaskEither', () => {
    describe('static constructors', () => {
        it('right should create a TaskEither with a Right value', async () => {
            const te = TaskEither.right(42);
            const result = await te.run();
            expect(result.isRight()).toBe(true);
            expect(result.match(r => r, () => null)).toBe(42);
        });

        it('left should create a TaskEither with a Left value', async () => {
            const te = TaskEither.left('error');
            const result = await te.run();
            expect(result.isLeft()).toBe(true);
            expect(result.match(() => null, l => l)).toBe('error');
        });

        it('of should wrap a Task<Either>', async () => {
            const task = Task.of(() => Promise.resolve(Either.right('ok')));
            const te = TaskEither.of(task);
            const result = await te.run();
            expect(result.isRight()).toBe(true);
            expect(result.match(r => r, () => null)).toBe('ok');
        });

        it('tryCatch should return Right on success', async () => {
            const te = TaskEither.tryCatch(
                async () => 100,
                () => 'fail'
            );
            const result = await te.run();
            expect(result.isRight()).toBe(true);
            expect(result.match(r => r, () => null)).toBe(100);
        });

        it('tryCatch should return Left on error', async () => {
            const te = TaskEither.tryCatch(
                async () => {
                    throw new Error('bad');
                },
                e => (e as Error).message
            );
            const result = await te.run();
            expect(result.isLeft()).toBe(true);
            expect(result.match(() => null, l => l)).toBe('bad');
        });
    });

    describe('map', () => {
        it('should map the Right value', async () => {
            const te = TaskEither.right(5).map(x => x * 2);
            const result = await te.run();
            expect(result.isRight()).toBe(true);
            expect(result.match(r => r, () => null)).toBe(10);
        });

        it('should not map the Left value', async () => {
            const te = TaskEither.left('fail').map(x => (x as any) * 2);
            const result = await te.run();
            expect(result.isLeft()).toBe(true);
            expect(result.match(() => null, l => l)).toBe('fail');
        });
    });

    describe('flatMap', () => {
        it('should chain TaskEithers on Right', async () => {
            const te = TaskEither.right(3).flatMap(x => TaskEither.right(x + 7));
            const result = await te.run();
            expect(result.isRight()).toBe(true);
            expect(result.match(r => r, () => null)).toBe(10);
        });

        it('should not call transform on Left', async () => {
            const te = TaskEither.left('fail').flatMap(x => TaskEither.right((x as any) + 1));
            const result = await te.run();
            expect(result.isLeft()).toBe(true);
            expect(result.match(() => null, l => l)).toBe('fail');
        });
    });

    describe('match', () => {
        it('should call ifRight for Right', async () => {
            const te = TaskEither.right('yes');
            const task = te.match(
                r => `Right: ${r}`,
                l => `Left: ${l}`
            );
            const result = await task.run();
            expect(result).toBe('Right: yes');
        });

        it('should call ifLeft for Left', async () => {
            const te = TaskEither.left('no');
            const task = te.match(
                r => `Right: ${r}`,
                l => `Left: ${l}`
            );
            const result = await task.run();
            expect(result).toBe('Left: no');
        });
    });

    describe('toTask', () => {
        it('should resolve with the Right value', async () => {
            const te = TaskEither.right(123);
            const task = te.toTask();
            await expect(task.run()).resolves.toBe(123);
        });

        it('should reject with an Error for Left', async () => {
            const te = TaskEither.left('fail');
            const task = te.toTask();
            await expect(task.run()).rejects.toThrow('fail');
        });
    });
});
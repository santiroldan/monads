import {describe, expect, it} from 'vitest';
import {Either} from '@/monads/either/either';

describe('Either', () => {
    describe('Right', () => {
        it('should create a Right correctly', () => {
            const e = Either.right(42);

            expect(e.isRight()).toBe(true);
            expect(e.isLeft()).toBe(false);
        });

        it('should map the value correctly', () => {
            const e = Either.right(2).map(x => x * 2);

            expect(e.isRight()).toBe(true);
            expect(e.match(x => x, () => 0)).toBe(4);
        });

        it('should ignore mapLeft', () => {
            const e = Either.right(2).mapLeft(() => 'error');

            expect(e.isRight()).toBe(true);
            expect(e.match(x => x, () => 0)).toBe(2);
        });

        it('should flatMap correctly', () => {
            const e = Either.right(2).flatMap(x => Either.right(x + 1));

            expect(e.isRight()).toBe(true);
            expect(e.match(x => x, () => 0)).toBe(3);
        });

        it('should convert to a resolved Future', async () => {
            const e = Either.right('ok');
            const future = e.toTask();

            await expect(future.run()).resolves.toBe('ok');
        });
    });

    describe('Left', () => {
        it('should create a Left correctly', () => {
            const e = Either.left('error');

            expect(e.isLeft()).toBe(true);
            expect(e.isRight()).toBe(false);
        });

        it('should ignore map', () => {
            const e = Either.left('error').map(x => (x as number) * 2);

            expect(e.isLeft()).toBe(true);
            expect(e.match(() => 'result', x => x)).toBe('error');
        });

        it('should map the left value with mapLeft', () => {
            const e = Either.left('error').mapLeft(x => x.toUpperCase());

            expect(e.isLeft()).toBe(true);
            expect(e.match(() => 'result', x => x)).toBe('ERROR');
        });

        it('should flatMapLeft correctly', () => {
            const e = Either.left('fail').flatMapLeft(x => Either.left(x + 'ed'));

            expect(e.isLeft()).toBe(true);
            expect(e.match(() => 'result', x => x)).toBe('failed');
        });

        it('should convert to a rejected Future', async () => {
            const e = Either.left('fail');
            const future = e.toTask();

            await expect(future.run()).rejects.toThrow('fail');
        });
    });

    describe('Either.catch', () => {
        it('should return Right if no error is thrown', () => {
            const e = Either.catch(() => 123);

            expect(e.isRight()).toBe(true);
            expect(e.match(x => x, () => 0)).toBe(123);
        });

        it('should return Left if an error is thrown', () => {
            const e = Either.catch(() => {
                throw new Error('fail');
            });

            expect(e.isLeft()).toBe(true);
            expect(e.match(() => 'result', err => err.message)).toBe('fail');
        });
    });

    describe('Either.from', () => {
        it('should create an Either from a Matchable', () => {
            const matchable = {
                match: <T>(ifRight: (r: number) => T, ifLeft: (l: string) => T) => ifRight(10)
            };
            const e = Either.from(matchable);

            expect(e.isRight()).toBe(true);
            expect(e.match(x => x, () => 0)).toBe(10);
        });
    });
});
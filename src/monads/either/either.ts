import {Matchable, Monad} from '@/shared';
import {Task, Taskable} from '../task/task';

export abstract class Either<L, R> implements Monad<R>, Matchable<R, L>, Taskable<R> {
    public static right<T>(value: T): Either<never, T> {
        return Right.of(value);
    }

    public static left<T>(value: T): Either<T, never> {
        return Left.of(value);
    }

    public static from<L, R>(matchable: Matchable<R, L>): Either<L, R> {
        return matchable.match<Either<L, R>>(
            (value: R) => Either.right(value),
            (value: L) => Either.left(value)
        );
    }

    public static catch<T>(execute: () => T): Either<Error, T> {
        try {
            return Either.right(execute());
        } catch (error) {
            return error instanceof Error ? Either.left(error) : Either.left(new Error('Unknown error'));
        }
    }

    public abstract map<T>(transform: (r: R) => T): Either<L, T>;

    public abstract mapLeft<T>(transform: (l: L) => T): Either<T, R>;

    public abstract flatMap<T>(transform: (r: R) => Either<L, T>): Either<L, T>;

    public abstract flatMapLeft<T>(transform: (l: L) => Either<T, R>): Either<T, R>;

    public abstract match<T>(ifRight: (r: R) => T, ifLeft: (l: L) => T): T;

    public abstract isLeft(): this is Left<L, R>;

    public abstract isRight(): this is Right<L, R>;

    public abstract toTask(): Task<R>;
}

export class Left<L, R> extends Either<L, R> {
    private constructor(private readonly value: L) {
        super();
    }

    public static of<T>(value: T): Either<T, never> {
        return new Left(value);
    }

    public map<T>(_: (r: R) => T): Either<L, T> {
        return new Left(this.value);
    }

    public mapLeft<T>(transform: (l: L) => T): Either<T, never> {
        return new Left(transform(this.value));
    }

    public flatMap<T>(_: (r: R) => Either<L, T>): Either<L, T> {
        return new Left(this.value);
    }

    public flatMapLeft<T>(transform: (l: L) => Either<T, never>): Either<T, never> {
        return transform(this.value);
    }

    public match<T>(_: (_: never) => never, ifLeft: (l: L) => T): T {
        return ifLeft(this.value);
    }

    public isLeft(): this is Left<L, never> {
        return true;
    }

    public isRight(): this is Right<L, never> {
        return false;
    }

    public toTask(): Task<never> {
        return Task.of(() => Promise.reject(new Error(String(this.value ?? 'Either: Unknown error'))));
    }
}

export class Right<L, R> extends Either<L, R> {
    private constructor(private readonly value: R) {
        super();
    }

    public static of<T>(value: T): Either<never, T> {
        return new Right(value);
    }

    public map<T>(transform: (r: R) => T): Either<L, T> {
        return new Right(transform(this.value));
    }

    public mapLeft(_: (l: L) => never): Either<never, R> {
        return new Right(this.value);
    }

    public flatMap<T>(transform: (r: R) => Either<L, T>): Either<L, T> {
        return transform(this.value);
    }

    public flatMapLeft(_: (l: never) => Either<never, R>): Either<never, R> {
        return new Right(this.value);
    }

    public match<T>(ifRight: (r: R) => T, _: (l: L) => T): T {
        return ifRight(this.value);
    }

    public isLeft(): this is Left<never, R> {
        return false;
    }

    public isRight(): this is Right<never, R> {
        return true;
    }

    public toTask(): Task<R> {
        return Task.of(() => Promise.resolve(this.value));
    }
}
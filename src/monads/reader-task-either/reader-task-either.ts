import {Either, Task} from '@/monads';
import {Monad} from '@/shared';

export class ReaderTaskEither<Env, L, R> implements Monad<R> {
    private constructor(
        private readonly fn: (env: Env) => Task<Either<L, R>>
    ) {
    }

    public static ask<Env>(): ReaderTaskEither<Env, never, Env> {
        return new ReaderTaskEither((env) =>
            Task.of(() => Promise.resolve(Either.right(env)))
        );
    }

    public static of<Env, L, R>(value: R): ReaderTaskEither<Env, L, R> {
        return new ReaderTaskEither(() => Task.of(() => Promise.resolve(Either.right(value))));
    }

    public static left<Env, L, R>(error: L): ReaderTaskEither<Env, L, R> {
        return new ReaderTaskEither(() => Task.of(() => Promise.resolve(Either.left(error))));
    }

    public static right<Env, L, R>(value: R): ReaderTaskEither<Env, L, R> {
        return new ReaderTaskEither(() => Task.of(() => Promise.resolve(Either.right(value))));
    }

    public run(env: Env): Task<Either<L, R>> {
        return this.fn(env);
    }

    public map<T>(f: (r: R) => T): ReaderTaskEither<Env, L, T> {
        return new ReaderTaskEither((env) =>
            this.fn(env).map((either) => either.map(f))
        );
    }

    public mapLeft<T>(f: (l: L) => T): ReaderTaskEither<Env, T, R> {
        return new ReaderTaskEither((env) =>
            this.fn(env).map((either) => either.mapLeft(f))
        );
    }

    public flatMapLeft<T>(
        f: (l: L) => ReaderTaskEither<Env, T, R>
    ): ReaderTaskEither<Env, T, R> {
        return new ReaderTaskEither((env) =>
            this.fn(env).flatMap((either) =>
                either.match(
                    (r) => Task.of(() => Promise.resolve(Either.right(r))),
                    (l) => f(l).run(env)
                )
            )
        );
    }

    public flatMap<T>(
        f: (r: R) => ReaderTaskEither<Env, L, T>
    ): ReaderTaskEither<Env, L, T> {
        return new ReaderTaskEither((env) =>
            this.fn(env).flatMap((either) =>
                either.match(
                    (r) => f(r).run(env),
                    (l) => Task.of(() => Promise.resolve(Either.left(l)))
                )
            )
        );
    }
}

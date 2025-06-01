import {Monad} from '@/shared';

export class Reader<Env, A> implements Monad<A> {
    private constructor(private readonly runFn: (env: Env) => A) {
    }

    public static of<Env, A>(value: A): Reader<Env, A> {
        return new Reader(() => value);
    }

    public static ask<Env>(): Reader<Env, Env> {
        return new Reader((env) => env);
    }

    public run(env: Env): A {
        return this.runFn(env);
    }

    public map<B>(f: (a: A) => B): Reader<Env, B> {
        return new Reader((env) => f(this.runFn(env)));
    }

    public flatMap<B>(f: (a: A) => Reader<Env, B>): Reader<Env, B> {
        return new Reader((env) => f(this.runFn(env)).run(env));
    }
}

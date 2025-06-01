import { Monad } from '@/shared/monad';

export class IO<T> implements Monad<T> {
    private readonly effect: () => T;

    private constructor(effect: () => T) {
        this.effect = effect;
    }

    public static of<T>(effect: () => T): IO<T> {
        return new IO(effect);
    }

    public map<U>(fn: (value: T) => U): IO<U> {
        return new IO(() => fn(this.effect()));
    }

    public flatMap<U>(fn: (value: T) => IO<U>): IO<U> {
        return new IO(() => fn(this.effect()).run());
    }

    public run(): T {
        return this.effect();
    }
}

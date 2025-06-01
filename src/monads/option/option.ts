import {Matchable, Monad} from '@/shared';

export abstract class Option<T> implements Monad<T>, Matchable<T, void> {
    public abstract isSome(): this is Some<T>;

    public abstract isNone(): this is None;

    public abstract map<U>(fn: (value: T) => U): Option<U>;

    public abstract flatMap<U>(fn: (value: T) => Option<U>): Option<U>;

    public abstract getOrElse(defaultValue: T): T;

    public abstract match<S>(fn: (value: T) => S, otherFn: (other: void) => S): S;

    public static some<T>(value: T): Option<T> {
        return Some.of(value);
    }

    public static none<T = never>(): Option<T> {
        return None.of();
    }

    public static fromNullable<T>(value: T | null | undefined): Option<T> {
        return value === null || value === undefined ? Option.none() : Option.some(value);
    }
}

export class Some<T> extends Option<T> {
    private constructor(private readonly value: T) {
        super();
    }

    public static of<T>(value: T): Some<T> {
        return new Some(value);
    }

    public isSome(): this is Some<T> {
        return true;
    }

    public isNone(): this is None {
        return false;
    }

    public map<U>(fn: (value: T) => U): Option<U> {
        return new Some(fn(this.value));
    }

    public flatMap<U>(fn: (value: T) => Option<U>): Option<U> {
        return fn(this.value);
    }

    public getOrElse(_: T): T {
        return this.value;
    }

    public match<S>(fn: (value: T) => S, _: (other: void) => S): S {
        return fn(this.value);
    }
}

export class None extends Option<never> {
    private constructor() {
        super();
    }

    public static of(): None {
        return new None();
    }

    public isSome(): this is Some<never> {
        return false;
    }

    public isNone(): this is None {
        return true;
    }

    public map<U>(_: (value: never) => U): Option<U> {
        return this;
    }

    public flatMap<U>(_: (value: never) => Option<U>): Option<U> {
        return this;
    }

    public getOrElse<U>(defaultValue: U): U {
        return defaultValue;
    }

    public match<S>(_: (value: never) => S, otherFn: (other: void) => S): S {
        return otherFn(undefined);
    }
}

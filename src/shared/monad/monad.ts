import {Functor} from './functor';

export interface Monad<T> extends Functor<T> {
    flatMap<U>(fn: (value: T) => Monad<U>): Monad<U>;
}
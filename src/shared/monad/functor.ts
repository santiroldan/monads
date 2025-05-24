export interface Functor<T> {
    map<U>(fn: (value: T) => U): Functor<U>;
}

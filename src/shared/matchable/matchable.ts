export interface Matchable<T, U> {
    match<S>(fn: (value: T) => S, otherFn: (other: U) => S): S;
}
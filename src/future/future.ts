import { Monad } from "@/shared/monad";

export interface Futurizable<T> {
  toFuture(): Future<T>;
}

export class Future<T> implements Monad<T> {
  private constructor(private readonly action: () => Promise<T>) {}

  public static of<T>(action: () => Promise<T>): Future<T> {
    return new Future(action);
  }

  public map<U>(transform: (value: T) => U): Future<U> {
    return new Future<U>(() => this.action().then(transform));
  }

  public flatMap<U>(transform: (value: T) => Future<U>): Future<U> {
    return new Future<U>(() => this.action().then((value) => transform(value).action()));
  }

  public complete<S>(onSuccess: (value: T) => S, onFailure: (error: Error) => S): Promise<S> {
    return this.action().then(onSuccess).catch(onFailure);
  }
}
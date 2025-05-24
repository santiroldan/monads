import { Monad } from "@/shared/monad";

export interface Taskable<T> {
  toTask(): Task<T>;
}

export class Task<T> implements Monad<T> {
  private constructor(private readonly effect: () => Promise<T>) {}

  public static of<T>(effect: () => Promise<T>): Task<T> {
    return new Task(effect);
  }

  public run(): Promise<T> {
    return this.effect();
  }

  public map<U>(transform: (value: T) => U): Task<U> {
    return new Task<U>(() => this.effect().then(transform));
  }

  public flatMap<U>(transform: (value: T) => Task<U>): Task<U> {
    return new Task<U>(() => this.effect().then((value) => transform(value).run()));
  }

  public complete<S>(onSuccess: (value: T) => S, onFailure: (error: Error) => S): Promise<S> {
    return this.effect().then(onSuccess).catch(onFailure);
  }
}
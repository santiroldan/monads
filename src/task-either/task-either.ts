import {Monad} from "@/shared/monad";
import {Task, Taskable} from "@/task/task";
import {Either} from "@/either/either";


export class TaskEither<L, R> implements Monad<R>, Taskable<R> {
    private constructor(private readonly task: Task<Either<L, R>>) {
    }

    public static of<L, R>(task: Task<Either<L, R>>): TaskEither<L, R> {
        return new TaskEither(task);
    }

    public static right<R>(value: R): TaskEither<never, R> {
        return new TaskEither(Task.of(() => Promise.resolve(Either.right(value))));
    }

    public static left<L>(value: L): TaskEither<L, never> {
        return new TaskEither(Task.of(() => Promise.resolve(Either.left(value))));
    }

    public static tryCatch<L, R>(
        execute: () => Promise<R>,
        onError: (error: unknown) => L
    ): TaskEither<L, R> {
        return new TaskEither(
            Task.of(async () => {
                try {
                    const result = await execute();
                    return Either.right(result);
                } catch (error) {
                    return Either.left(onError(error));
                }
            })
        );
    }

    public map<T>(transform: (r: R) => T): TaskEither<L, T> {
        return new TaskEither(
            this.task.map(either => either.map(transform))
        );
    }

    public flatMap<T>(transform: (r: R) => TaskEither<L, T>): TaskEither<L, T> {
        return new TaskEither(
            Task.of(async () => {
                const either = await this.task.run();
                return await either.match(
                    async (right) => transform(right).run(),
                    async (left) => Either.left(left)
                );
            })
        );
    }

    public match<T>(
        ifRight: (r: R) => T,
        ifLeft: (l: L) => T
    ): Task<T> {
        return Task.of(async () => {
            const either = await this.task.run();
            return either.match(ifRight, ifLeft);
        });
    }

    public toTask(): Task<R> {
        return Task.of(() => this.task.run().then(either => either.match(r => r, l => {
            throw new Error(String(l));
        })));
    }

    public run(): Promise<Either<L, R>> {
        return this.task.run();
    }
}

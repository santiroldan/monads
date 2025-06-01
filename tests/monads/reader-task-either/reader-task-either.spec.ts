import {describe, expect, it} from "vitest";
import {ReaderTaskEither} from "@/monads/reader-task-either/reader-task-either";

describe("ReaderTaskEither - All methods", () => {
    it("should provide the environment with ask", async () => {
        const rte = ReaderTaskEither.ask<number>();
        const result = await rte.run(42).run();
        expect(result.isRight()).toBe(true);
        expect(result.match(x => x, () => 0)).toBe(42);
    });

    it("should create a Right with of", async () => {
        const rte = ReaderTaskEither.of<number, string, string>("success");
        const result = await rte.run(0).run();
        expect(result.isRight()).toBe(true);
        expect(result.match(x => x, () => "")).toBe("success");
    });

    it("should create a Left with left", async () => {
        const rte = ReaderTaskEither.left<number, string, number>("error");
        const result = await rte.run(1).run();
        expect(result.isLeft()).toBe(true);
        expect(result.match(() => "error", l => l)).toBe("error");
    });

    it("should create a Right with right", async () => {
        const rte = ReaderTaskEither.right<number, string, number>(100);
        const result = await rte.run(2).run();
        expect(result.isRight()).toBe(true);
        expect(result.match(x => x, () => 0)).toBe(100);
    });

    it("should map the Right value", async () => {
        const rte = ReaderTaskEither.right<number, string, number>(5).map(x => x * 2);
        const result = await rte.run(0).run();
        expect(result.isRight()).toBe(true);
        expect(result.match(x => x, () => 0)).toBe(10);
    });

    it("should mapLeft the Left value", async () => {
        const rte = ReaderTaskEither.left<number, string, number>("fail").mapLeft(e => e + "ed");
        const result = await rte.run(0).run();
        expect(result.isLeft()).toBe(true);
        expect(result.match(() => "no value", l => l)).toBe("failed");
    });

    it("should flatMap the Right value", async () => {
        const rte = ReaderTaskEither.right<number, string, number>(3)
            .flatMap(x => ReaderTaskEither.right<number, string, string>(`Value: ${x}`));
        const result = await rte.run(0).run();
        expect(result.isRight()).toBe(true);
        expect(result.match(x => x, () => "")).toBe("Value: 3");
    });

    it("should not flatMap on Left", async () => {
        const rte = ReaderTaskEither.left<number, string, number>("fail")
            .flatMap(x => ReaderTaskEither.right<number, string, string>(`Value: ${x}`));
        const result = await rte.run(0).run();
        expect(result.isLeft()).toBe(true);
        expect(result.match(() => "", l => l)).toBe("fail");
    });

    it("should flatMapLeft the Left value", async () => {
        const rte = ReaderTaskEither.left<number, string, number>("fail")
            .flatMapLeft(e => ReaderTaskEither.left<number, number, number>(e.length));
        const result = await rte.run(0).run();
        expect(result.isLeft()).toBe(true);
        expect(result.match(() => 0, l => l)).toBe(4);
    });

    it("should not flatMapLeft on Right", async () => {
        const rte = ReaderTaskEither.right<number, string, number>(10)
            .flatMapLeft(() => ReaderTaskEither.left<number, number, number>(999));
        const result = await rte.run(0).run();
        expect(result.isRight()).toBe(true);
        expect(result.match(x => x, () => 0)).toBe(10);
    });

    it("should return the environment as Right with ask", async () => {
        const rte = ReaderTaskEither.ask<string>();
        const result = await rte.run("my-env").run();
        expect(result.isRight()).toBe(true);
        expect(result.match(x => x, () => "")).toBe("my-env");
    });
});
import {Either} from 'src/either/either';
import {describe, expect, it} from 'vitest';
import {None, Option, Some} from "@/option/option";

describe("Option", () => {
    describe("Option.some", () => {
        it("should create a Some instance", () => {
            const opt = Option.some(42);
            expect(opt).toBeInstanceOf(Some);
            expect(opt.isSome()).toBe(true);
            expect(opt.isNone()).toBe(false);
        });
    });

    describe("Option.none", () => {
        it("should create a None instance", () => {
            const opt = Option.none();
            expect(opt).toBeInstanceOf(None);
            expect(opt.isSome()).toBe(false);
            expect(opt.isNone()).toBe(true);
        });
    });

    describe("Option.fromNullable", () => {
        it("should return Some if value is not null or undefined", () => {
            const opt = Option.fromNullable("value");
            expect(opt.isSome()).toBe(true);
        });

        it("should return None if value is null", () => {
            const opt = Option.fromNullable(null);
            expect(opt.isNone()).toBe(true);
        });

        it("should return None if value is undefined", () => {
            const opt = Option.fromNullable(undefined);
            expect(opt.isNone()).toBe(true);
        });
    });

    describe("Some", () => {
        const some = new Some(10);

        it("map should transform the value", () => {
            const mapped = some.map(x => x * 2);
            expect(mapped).toBeInstanceOf(Some);
            expect(mapped.getOrElse(0)).toBe(20);
        });

        it("flatMap should chain options", () => {
            const flatMapped = some.flatMap(x => Option.some(x + 5));
            expect(flatMapped).toBeInstanceOf(Some);
            expect(flatMapped.getOrElse(0)).toBe(15);
        });

        it("getOrElse should return the inner value", () => {
            expect(some.getOrElse(99)).toBe(10);
        });

        it("match should execute the value function", () => {
            const result = some.match(
                v => `Value: ${v}`,
                () => "None"
            );
            expect(result).toBe("Value: 10");
        });
    });

    describe("None", () => {
        const none = new None();

        it("map should return None", () => {
            const mapped = none.map(x => x);
            expect(mapped).toBeInstanceOf(None);
        });

        it("flatMap should return None", () => {
            const flatMapped = none.flatMap(x => Option.some(x));
            expect(flatMapped).toBeInstanceOf(None);
        });

        it("getOrElse should return the default value", () => {
            expect(none.getOrElse(123)).toBe(123);
        });

        it("match should execute the None function", () => {
            const result = none.match(
                () => "Some value",
                () => "None"
            );
            expect(result).toBe("None");
        });
    });
});
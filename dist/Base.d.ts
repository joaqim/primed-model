import "reflect-metadata";
import type { BaseConstructorPayload } from "./Reflect.h";
export declare class Base<T, U = undefined> {
    constructor(payload?: BaseConstructorPayload<T, U>);
    static readonly tag: string;
    private init;
    private makeEnumerableGetters;
    clone(): T;
}

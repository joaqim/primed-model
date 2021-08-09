import "reflect-metadata";
import type { Constructor } from "./Reflect.h";
export declare function Model(constructor: Constructor): void;
export declare function Model(name: string): (constructor: Constructor) => void;

import "reflect-metadata";
import type { Factory, IPropertyOptions } from "./Reflect.h";
declare class PropertyOptions implements IPropertyOptions {
    required?: boolean;
    array?: boolean;
}
export declare function Primed(factory: Factory, propertyOptions?: PropertyOptions): (instance: any, propertyKey: string | symbol) => void;
export {};

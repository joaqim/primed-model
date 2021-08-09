// Adapted from 'primed-model': https://github.com/cuzox/primed-model
/* eslint-disable */
import "reflect-metadata";
import type {
  BaseConstructorPayload,
  ClassNameMapping,
  Constructor,
  Indexable,
  PropertiesMeta,
} from "./Reflect.h";
import {
  CLASS_NAME,
  CLASS_NAME_MAPPING,
  PRIMED_PROPERTIES_META,
} from "./Symbols";

export class Base<T, U = undefined> {
  // Method purely for typing purposes
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-useless-constructor
  constructor(payload?: BaseConstructorPayload<T, U>) {}

  public static readonly tag: string;

  private init(
    payload: Indexable = {},
    trace: Set<Constructor | string> = new Set()
  ) {
    this.makeEnumerableGetters(this);
    const primedProperties: PropertiesMeta =
      Reflect.getMetadata(PRIMED_PROPERTIES_META, this) || {};
    const updatedTrace = new Set(trace).add(
      trace.size ? (this.constructor as Constructor) : "STUB"
    );
    const notPrimed = Object.keys(payload).reduce(
      (acc, key) => (key in primedProperties ? acc : [...acc, key]),
      [] as string[]
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const key of notPrimed) {
      const desc = Object.getOwnPropertyDescriptor(this, key);
      if (
        // eslint-disable-next-line no-prototype-builtins
        this.hasOwnProperty(key) &&
        (!desc || desc.writable === true || typeof desc.set === "function")
      ) {
        (this as Indexable)[key] = payload[key];
      }
    }

    for (const key in primedProperties) {
      let { factory, options } = primedProperties[key];
      if (factory === undefined) {
        console.log(key);
        console.log("Factory is undefined");
        continue;
      }
      const classNameMappingMetadata: ClassNameMapping = Reflect.getMetadata(
        CLASS_NAME_MAPPING,
        Base.constructor
      );
      const factoryIsString = typeof factory === "string";
      const factoryExtendsBase =
        !factoryIsString && (factory as Constructor).prototype instanceof Base;
      if (factoryIsString || factoryExtendsBase) {
        const factoryName = factoryIsString
          ? factory
          : Reflect.getMetadata(CLASS_NAME, factory);
        factory = classNameMappingMetadata[factoryName];
        if (!factory) {
          throw Error(`Class ${factoryName} was never added`);
        }
      }

      const value = payload[key];
      if (options.array && payload && payload[key] && !Array.isArray(value)) {
        throw Error(`Array expected for field ${key}`);
      } else if (!options.array && value && Array.isArray(value)) {
        throw Error(`Array not expected for field ${key}`);
      }

      if (value !== undefined && value !== null) {
        const values: any = Array.isArray(value) ? value : [value];
        let instances: any[] = [];
        if ((factory as Constructor).prototype instanceof Base) {
          instances = values.map((val: any) =>
            Reflect.construct(factory as Constructor, [val, updatedTrace])
          );
        } else {
          const getArgs = (value: any) => (value !== undefined ? [value] : []);
          instances = values.map((val: any) =>
            (factory as Function)(...getArgs(val))
          );
        }
        (this as Indexable)[key] = options.array ? instances : instances.pop();
      } else if (options.required) {
        let instance;
        if ((factory as Constructor).prototype instanceof Base) {
          const isCyclic = updatedTrace.has(factory as Constructor);
          if (isCyclic) {
            (this as Indexable)[key] = undefined;
            continue;
          }
          instance = Reflect.construct(factory as Constructor, [
            undefined,
            updatedTrace,
          ]);
        } else {
          instance = (factory as Function)();
        }
        (this as Indexable)[key] = options.array ? [instance] : instance;
      } else if (options.array) {
        (this as Indexable)[key] = [];
      } else {
        (this as Indexable)[key] = null;
      }
    }

    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  private makeEnumerableGetters(instance: any) {
    for (
      let o = instance;
      o !== Object.prototype;
      o = Object.getPrototypeOf(o)
    ) {
      // eslint-disable-next-line no-restricted-syntax
      for (const name of Object.getOwnPropertyNames(o)) {
        const desc = Object.getOwnPropertyDescriptor(o, name) || {};
        const hasGetter = typeof desc.get === "function";
        // if (hasGetter && name != "id" && name != "_id") {
        if (hasGetter) {
          desc.enumerable = true;
          Object.defineProperty(instance, name, desc);
        }
      }
    }
  }

  clone(): T {
    return Reflect.construct(this.constructor, [this]);
  }
}

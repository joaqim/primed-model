// Adapted from 'primed-model': https://github.com/cuzox/primed-model
/* eslint max-classes-per-file: "off" */
/* eslint no-underscore-dangle: "off" */
import "reflect-metadata";
import { Base } from "./Base";
import type { Constructor } from "./Reflect.h";
import { CLASS_NAME, CLASS_NAME_MAPPING } from "./Symbols";

export function Model(constructor: Constructor): void;
export function Model(name: string): (constructor: Constructor) => void;
export function Model<T extends Constructor>(constructorOrName: string | T) {
  const classNameMappingMetadata =
    Reflect.getMetadata(CLASS_NAME_MAPPING, Base.constructor) || {};

  if (typeof constructorOrName === "string") {
    return (constructor: T) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const _class = class extends constructor {
        public static readonly tag = constructorOrName;

        constructor(...args: any[]) {
          super();
          this.init(args[0], args[1]);
          // this.tag = constructorOrName;
        }
      };

      classNameMappingMetadata[constructorOrName] = _class;
      Reflect.defineMetadata(
        CLASS_NAME_MAPPING,
        classNameMappingMetadata,
        Base.constructor
      );
      Reflect.defineMetadata(CLASS_NAME, constructorOrName, constructor);
      return _class;
    };
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _class = class extends constructorOrName {
    public static readonly tag: string = (constructorOrName as Constructor)
      .name;

    constructor(...args: any[]) {
      super();
      this.init(args[0], args[1]);
    }
  };

  classNameMappingMetadata[constructorOrName.name] = _class;
  Reflect.defineMetadata(
    CLASS_NAME_MAPPING,
    classNameMappingMetadata,
    Base.constructor
  );
  Reflect.defineMetadata(CLASS_NAME, constructorOrName.name, constructorOrName);
  return _class;
}

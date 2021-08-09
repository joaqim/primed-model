// Adapted from 'primed-model': https://github.com/cuzox/primed-model
import "reflect-metadata";
import type { Factory, IPropertyOptions } from "./Reflect.h";
import { PRIMED_PROPERTIES_META } from "./Symbols";

class PropertyOptions implements IPropertyOptions {
  required?: boolean = true;

  array?: boolean = false;
}

export function Primed(
  factory: Factory,
  propertyOptions: PropertyOptions = {}
) {
  return (instance: any, propertyKey: string | symbol) => {
    const options = Object.assign(new PropertyOptions(), propertyOptions);
    const metadata =
      Reflect.getMetadata(PRIMED_PROPERTIES_META, instance) || {};
    metadata[propertyKey] = { factory, options };
    Reflect.defineMetadata(PRIMED_PROPERTIES_META, metadata, instance);
  };
}

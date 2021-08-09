// Adapted from 'primed-model': https://github.com/cuzox/primed-model
export type Constructor<T = any> = { new (...args: any[]): T };
export type Factory = Function | Constructor | string;
export type Indexable = { [key: string]: any };

// https://github.com/krzkaczor/ts-essentials
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

export type BaseConstructorPayload<T, U = undefined> = DeepPartial<
  U extends undefined ? T : T | U
>;

export interface IPropertyOptions {
  required?: boolean;
  array?: boolean;
}

export interface PropertiesMeta {
  [key: string]: {
    factory: Factory;
    options: IPropertyOptions;
  };
}

export interface ClassNameMapping {
  [key: string]: Constructor;
}

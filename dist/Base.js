"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
// Adapted from 'primed-model': https://github.com/cuzox/primed-model
/* eslint-disable */
require("reflect-metadata");
const Symbols_1 = require("./Symbols");
class Base {
    // Method purely for typing purposes
    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line no-useless-constructor
    constructor(payload) { }
    init(payload = {}, trace = new Set()) {
        this.makeEnumerableGetters(this);
        const primedProperties = Reflect.getMetadata(Symbols_1.PRIMED_PROPERTIES_META, this) || {};
        const updatedTrace = new Set(trace).add(trace.size ? this.constructor : "STUB");
        const notPrimed = Object.keys(payload).reduce((acc, key) => (key in primedProperties ? acc : [...acc, key]), []);
        // eslint-disable-next-line no-restricted-syntax
        for (const key of notPrimed) {
            const desc = Object.getOwnPropertyDescriptor(this, key);
            if (
            // eslint-disable-next-line no-prototype-builtins
            this.hasOwnProperty(key) &&
                (!desc || desc.writable === true || typeof desc.set === "function")) {
                this[key] = payload[key];
            }
        }
        for (const key in primedProperties) {
            let { factory, options } = primedProperties[key];
            if (factory === undefined) {
                console.log(key);
                console.log("Factory is undefined");
                continue;
            }
            const classNameMappingMetadata = Reflect.getMetadata(Symbols_1.CLASS_NAME_MAPPING, Base.constructor);
            const factoryIsString = typeof factory === "string";
            const factoryExtendsBase = !factoryIsString && factory.prototype instanceof Base;
            if (factoryIsString || factoryExtendsBase) {
                const factoryName = factoryIsString
                    ? factory
                    : Reflect.getMetadata(Symbols_1.CLASS_NAME, factory);
                factory = classNameMappingMetadata[factoryName];
                if (!factory) {
                    throw Error(`Class ${factoryName} was never added`);
                }
            }
            const value = payload[key];
            if (options.array && payload && payload[key] && !Array.isArray(value)) {
                throw Error(`Array expected for field ${key}`);
            }
            else if (!options.array && value && Array.isArray(value)) {
                throw Error(`Array not expected for field ${key}`);
            }
            if (value !== undefined && value !== null) {
                const values = Array.isArray(value) ? value : [value];
                let instances = [];
                if (factory.prototype instanceof Base) {
                    instances = values.map((val) => Reflect.construct(factory, [val, updatedTrace]));
                }
                else {
                    const getArgs = (value) => (value !== undefined ? [value] : []);
                    instances = values.map((val) => factory(...getArgs(val)));
                }
                this[key] = options.array ? instances : instances.pop();
            }
            else if (options.required) {
                let instance;
                if (factory.prototype instanceof Base) {
                    const isCyclic = updatedTrace.has(factory);
                    if (isCyclic) {
                        this[key] = undefined;
                        continue;
                    }
                    instance = Reflect.construct(factory, [
                        undefined,
                        updatedTrace,
                    ]);
                }
                else {
                    instance = factory();
                }
                this[key] = options.array ? [instance] : instance;
            }
            else if (options.array) {
                this[key] = [];
            }
            else {
                this[key] = null;
            }
        }
        return this;
    }
    // eslint-disable-next-line class-methods-use-this
    makeEnumerableGetters(instance) {
        for (let o = instance; o !== Object.prototype; o = Object.getPrototypeOf(o)) {
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
    clone() {
        return Reflect.construct(this.constructor, [this]);
    }
}
exports.Base = Base;

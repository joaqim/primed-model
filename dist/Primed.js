"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primed = void 0;
// Adapted from 'primed-model': https://github.com/cuzox/primed-model
require("reflect-metadata");
const Symbols_1 = require("./Symbols");
class PropertyOptions {
    constructor() {
        this.required = true;
        this.array = false;
    }
}
function Primed(factory, propertyOptions = {}) {
    return (instance, propertyKey) => {
        const options = Object.assign(new PropertyOptions(), propertyOptions);
        const metadata = Reflect.getMetadata(Symbols_1.PRIMED_PROPERTIES_META, instance) || {};
        metadata[propertyKey] = { factory, options };
        Reflect.defineMetadata(Symbols_1.PRIMED_PROPERTIES_META, metadata, instance);
    };
}
exports.Primed = Primed;

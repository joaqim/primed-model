"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
// Adapted from 'primed-model': https://github.com/cuzox/primed-model
/* eslint max-classes-per-file: "off" */
/* eslint no-underscore-dangle: "off" */
require("reflect-metadata");
const Base_1 = require("./Base");
const Symbols_1 = require("./Symbols");
function Model(constructorOrName) {
    var _a;
    const classNameMappingMetadata = Reflect.getMetadata(Symbols_1.CLASS_NAME_MAPPING, Base_1.Base.constructor) || {};
    if (typeof constructorOrName === "string") {
        return (constructor) => {
            var _a;
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const _class = (_a = class extends constructor {
                    constructor(...args) {
                        super();
                        this.init(args[0], args[1]);
                        // this.tag = constructorOrName;
                    }
                },
                _a.tag = constructorOrName,
                _a);
            classNameMappingMetadata[constructorOrName] = _class;
            Reflect.defineMetadata(Symbols_1.CLASS_NAME_MAPPING, classNameMappingMetadata, Base_1.Base.constructor);
            Reflect.defineMetadata(Symbols_1.CLASS_NAME, constructorOrName, constructor);
            return _class;
        };
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _class = (_a = class extends constructorOrName {
            constructor(...args) {
                super();
                this.init(args[0], args[1]);
            }
        },
        _a.tag = constructorOrName
            .name,
        _a);
    classNameMappingMetadata[constructorOrName.name] = _class;
    Reflect.defineMetadata(Symbols_1.CLASS_NAME_MAPPING, classNameMappingMetadata, Base_1.Base.constructor);
    Reflect.defineMetadata(Symbols_1.CLASS_NAME, constructorOrName.name, constructorOrName);
    return _class;
}
exports.Model = Model;

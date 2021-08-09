"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// Adapted from 'primed-model': https://github.com/cuzox/primed-model
const _1 = require(".");
let Cat = /** @class */ (() => {
    let Cat = class Cat extends _1.Base {
        constructor() {
            super(...arguments);
            this.name = null;
            this.breed = null;
        }
    };
    Cat = tslib_1.__decorate([
        _1.Model
    ], Cat);
    return Cat;
})();
let Person = /** @class */ (() => {
    var Person_1;
    let Person = Person_1 = class Person extends _1.Base {
        constructor() {
            super(...arguments);
            this.name = "";
            this.middleName = "";
            this.lastName = "";
        }
        get fullName() {
            return ([this.name, this.middleName, this.lastName].join(" ").trim() ||
                "Empty Name");
        }
    };
    tslib_1.__decorate([
        _1.Primed(Person_1)
    ], Person.prototype, "parent", void 0);
    tslib_1.__decorate([
        _1.Primed("Cat", { array: true })
    ], Person.prototype, "cats", void 0);
    Person = Person_1 = tslib_1.__decorate([
        _1.Model
    ], Person);
    return Person;
})();
describe(">>> Reflect", () => {
    it("Constructs Model with Primed values", () => {
        expect(new Person()).toEqual({
            name: "",
            middleName: "",
            lastName: "",
            fullName: "Empty Name",
            parent: {
                name: "",
                middleName: "",
                lastName: "",
                fullName: "Empty Name",
                cats: [
                    {
                        name: null,
                        breed: null,
                    },
                ],
            },
            cats: [
                {
                    name: null,
                    breed: null,
                },
            ],
        });
    });
    it("Constructs Model with object structure as payload", () => {
        const alice = new Person({
            name: "Alice",
            lastName: "Liddell",
            cats: [
                {
                    name: "garfield",
                },
            ],
            parent: {
                name: "Bob",
                cats: [
                    {
                        name: "Tom",
                    },
                ],
            },
        });
        expect(alice.name).toBe("Alice");
        expect(alice.cats[0].name).toBe("garfield");
        expect(alice.parent.name).toBe("Bob");
        expect(alice.parent.cats[0].name).toBe("Tom");
    });
});

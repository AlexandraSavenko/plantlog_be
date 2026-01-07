"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnumGuard = createEnumGuard;
function createEnumGuard(list) {
    return (value) => {
        return list.includes(value);
    };
}
//it's a factory function which accepts one this -- a tuple of string (list) and return a type-narrowing validator function

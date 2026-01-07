"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envString = exports.env = void 0;
require("dotenv/config");
//for port
const env = (name, defaultValue) => {
    const value = process.env[name];
    if (value)
        return value;
    if (defaultValue)
        return defaultValue;
    throw new Error(`Missing process.env[${name}]`);
};
exports.env = env;
//the first helper returns string | number value, which is impossible for jwtToken secret and not god for other things
//for jwtToken
const envString = (name) => {
    const value = process.env[name];
    if (value)
        return value;
    throw new Error(`Missing process.env[${name}]`);
};
exports.envString = envString;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authProviderList = exports.refreshTokenLifeTime = exports.accessTokenLifeTime = exports.emailRegex = void 0;
exports.emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
exports.accessTokenLifeTime = 1000 * 60 * 15;
// 1 min has 1000 miliseconds
exports.refreshTokenLifeTime = 1000 * 60 * 60 * 24 * 7;
exports.authProviderList = ["local", "google"];

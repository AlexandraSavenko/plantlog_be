"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePaginationParams = void 0;
const parseNumber = (value, defaultValue) => {
    const parsed = parseInt(String(value), 10);
    return Number.isNaN(parsed) ? defaultValue : parsed;
};
//String(value) converts null -> "null" and undefined -> "undefined"
const parsePaginationParams = ({ page, perPage }) => {
    return {
        page: parseNumber(page, 1),
        perPage: parseNumber(perPage, 10)
    };
};
exports.parsePaginationParams = parsePaginationParams;

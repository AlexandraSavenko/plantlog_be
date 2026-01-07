"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePaginationData = void 0;
const calculatePaginationData = ({ totalItems, page, perPage, }) => {
    const totalPages = Math.ceil(totalItems / perPage);
    const hasNextPage = page > totalPages;
    const hasPrevPage = page > 1;
    return {
        page,
        perPage,
        totalItems,
        hasNextPage,
        hasPrevPage
    };
};
exports.calculatePaginationData = calculatePaginationData;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePlantsFilterParams = void 0;
const plants_1 = require("../constants/plants");
// import { filterByPlantTypeList } from "../db/models/Plant";
const parsePlantsFilterParams = ({ name, growthForm, origin, }) => {
    const filters = {};
    //making case insensitive search in mongo db
    // there are also other settings: https://www.mongodb.com/docs/manual/reference/operator/query/regex/
    // db request could be terminated l06.11part2
    if (name) {
        filters.name = { $regex: String(name), $options: "i" };
    }
    if (growthForm && (0, plants_1.isGrowthForm)(growthForm)) {
        filters.growthForm = growthForm;
    }
    if (origin && (0, plants_1.isOrigin)(origin)) {
        filters.origin = origin;
    }
    return filters;
};
exports.parsePlantsFilterParams = parsePlantsFilterParams;

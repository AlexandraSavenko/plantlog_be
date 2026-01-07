"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOrigin = exports.OriginList = exports.isGrowthForm = exports.GrowthFormList = void 0;
const typeGuards_1 = require("../utils/typeGuards");
exports.GrowthFormList = [
    "tree",
    "shrub",
    "herb",
    "grass",
    "vine",
    "succulent",
    "fern",
    "moss",
];
exports.isGrowthForm = (0, typeGuards_1.createEnumGuard)(exports.GrowthFormList);
exports.OriginList = ["wild", "cultivated"];
exports.isOrigin = (0, typeGuards_1.createEnumGuard)(exports.OriginList);
//typescript trick: T[number] → “give me the type of whatever is stored inside this tuple/array” because arrays/tuples are indexed by numbers:
//the array is literal tuple (as const);

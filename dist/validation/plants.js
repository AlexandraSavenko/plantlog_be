"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plantUpdateSchema = exports.plantAddSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const plants_1 = require("../constants/plants");
exports.plantAddSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    growthForm: joi_1.default.string().valid(...plants_1.GrowthFormList),
    origin: joi_1.default.string().valid(...plants_1.OriginList)
});
//no need for photo here for joi only check text fields of a request
//name: Joi.string().required().messages({
// "any.required": "You need to write a proper name", 
// "string.empty": "name should not be empty string"})
exports.plantUpdateSchema = joi_1.default.object({
    name: joi_1.default.string(),
    description: joi_1.default.string(),
    growthForm: joi_1.default.string().valid(...plants_1.GrowthFormList),
    origin: joi_1.default.string().valid(...plants_1.OriginList)
});

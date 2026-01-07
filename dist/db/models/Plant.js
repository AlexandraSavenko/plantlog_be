"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterByPlantTypeList = exports.sortByList = void 0;
const mongoose_1 = require("mongoose");
const plants_1 = require("../../constants/plants");
const hooks_1 = require("../hooks");
const plantSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    photo: {
        type: String,
        // required: [true, "Photo is required"],
    },
    growthForm: {
        type: String,
        enum: plants_1.GrowthFormList,
        required: true,
        default: "tree",
    },
    origin: {
        type: String,
        enum: plants_1.OriginList,
        required: true,
        default: "wild",
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
}, { versionKey: false, timestamps: true });
//Mongoose Hook:
//to set status in case req.body doesn't match schema (cause if it doesn't md throws error, ctrlWrapper catches it but there's no status ->> 500)
//we can use this middleware on mongooseSchema
//post doesn't mean http-method, it means "after", there's also before
//md has many methods like .findOneById, but under the hood it has intermal operations, one of them is "save" and it's first argument,
// the second should be a function with three!! arguments
//it's like we go inside the method and in case saving went unsuccessfully run this function firts and then go on
// from "https://mongoosejs.com/docs/validation.html"
//this function in hooks applies all three hooks to the schema
(0, hooks_1.applySchemaHooks)(plantSchema);
//this list should be changed if the schema changes! it is used in parseSortParams function;
exports.sortByList = [
    "name",
    "description",
    "photo",
    "growthForm",
    "origin"
];
exports.filterByPlantTypeList = ["tree", "bush", "grass"];
const PlantCollection = (0, mongoose_1.model)("plants", plantSchema);
exports.default = PlantCollection;

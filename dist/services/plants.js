"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlant = exports.updatePlant = exports.addPlant = exports.getPlantById = exports.getPlants = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const Plant_1 = __importDefault(require("../db/models/Plant"));
const calculatePaginationData_1 = require("../utils/calculatePaginationData");
// Mongoose queries are then-able thus they return Promise-like object.
// export const getPlants = () => PlantCollection.find();
const getPlants = async ({ page = 1, perPage = 10, sortBy = "_id", sortOrder = "asc", filters = {} }) => {
    //.skip() method skips as many elements of a collection as the argument tells it.
    const skip = (page - 1) * perPage;
    const query = Plant_1.default.find(filters).skip(skip).limit(perPage).sort({ [sortBy]: sortOrder });
    const data = await query;
    //Mongoose can't run the same request twise because an error will happen: Query was already executed: plants.countDocuments
    //so to count total items with filters we need to create a new request and merge query in it.
    const totalItems = await Plant_1.default.find().merge(query).countDocuments();
    const paginationData = (0, calculatePaginationData_1.calculatePaginationData)({ page, perPage, totalItems });
    return { data, ...paginationData };
};
exports.getPlants = getPlants;
const getPlantById = (id) => Plant_1.default.findById(id);
exports.getPlantById = getPlantById;
const addPlant = (payload) => Plant_1.default.create(payload);
exports.addPlant = addPlant;
const updatePlant = async ({ userId, _id, payload, options = {}, }) => {
    //to findOneAndUpdate we pass conditions of search (an object with such _id, or title or anything)?? and updated object
    // by default mongoose passes back an old object so new:true is needed. It will be added in hooks.
    // without upsert: true null will be returned in case plant doesn't exist and status will still be 200
    const existing = await Plant_1.default.findOne({ _id });
    //check in case user A wants to upsert user B's element of the collection
    if (existing && existing.userId.toString() !== userId) {
        throw (0, http_errors_1.default)(403, "Updating this element is forbidden");
    }
    const rawResult = await Plant_1.default.findOneAndUpdate({ _id }, { $set: payload, $setOnInsert: { userId } }, {
        ...options,
        //to know whether update or create worked we have to write includeResaltMetaDate
        // rawresult will be an object with value: {new or updated plant} and lastErrorObject: {upserted would only contain _id if the object was created}
        includeResultMetadata: true,
        //by default mongoose only checks with schema when adding but when updating it doesn't, so we need to check:
        // runValidators: true,
        //but instead we will add another hook, check hooks...
    });
    if (!rawResult || !rawResult.value)
        return null;
    return { data: rawResult.value, isNew: rawResult.lastErrorObject?.upserted };
};
exports.updatePlant = updatePlant;
const deletePlant = async (filter) => {
    return Plant_1.default.findOneAndDelete(filter);
};
exports.deletePlant = deletePlant;

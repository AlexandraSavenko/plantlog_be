"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlantController = exports.patchPlantController = exports.upsertPlantController = exports.addPlantController = exports.getPlantByIdController = exports.getPlantsController = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const plantsServises = __importStar(require("../services/plants"));
const parsePaginationParams_1 = require("../utils/parsePaginationParams");
const Plant_1 = require("../db/models/Plant");
const parseSortParams_1 = require("../utils/parseSortParams");
const parsePlantsFilterParams_1 = require("../utils/parsePlantsFilterParams");
const saveFileToUploadDir_1 = require("../utils/saveFileToUploadDir");
const path = __importStar(require("node:path"));
const env_1 = require("../utils/env");
const saveFileToCloudinary_1 = require("../utils/saveFileToCloudinary");
const enableCloudinary = (0, env_1.envString)("ENABLE_CLOUDINARY");
const getPlantsController = async (req, res) => {
    const { page, perPage } = (0, parsePaginationParams_1.parsePaginationParams)(req.query);
    const { sortBy, sortOrder } = (0, parseSortParams_1.parseSortParams)(req.query, Plant_1.sortByList);
    const filters = (0, parsePlantsFilterParams_1.parsePlantsFilterParams)(req.query);
    //there seems to be no need to create private controller
    if (req.user?._id) {
        filters.userId = req.user._id;
    }
    const data = await plantsServises.getPlants({ page, perPage, sortBy, sortOrder, filters });
    res.status(200).json({
        status: 200,
        message: "Successfully fetched plant list",
        data,
    });
};
exports.getPlantsController = getPlantsController;
const getPlantByIdController = async (req, res) => {
    const { id } = req.params;
    const data = await plantsServises.getPlantById(id);
    //if the plant doesn't exist, we receive null and will get into iff ->> 404
    //if the id value is invalid md_id (eg name), md method .findOneById will throw error
    //a middleware (isValidId) should check if id looks like md_id
    if (!data) {
        throw (0, http_errors_1.default)(404, `Plant with id=${id} not found`);
        //the error we are throwing will be caught by next in ctrlWrapper
    }
    res.status(200).json({
        status: 200,
        message: `Plant with id: ${id} is here`,
        data,
    });
};
exports.getPlantByIdController = getPlantByIdController;
//req.body don't have json automaticlly because express can't read it(it sees binary code only) so in server we call a function that converts req.body to json
const addPlantController = async (req, res) => {
    if (!req.user) {
        throw (0, http_errors_1.default)(401, "User not authenticated");
    }
    // console.log("AddPlantController", req.file)
    let photo = null;
    if (req.file) {
        if (enableCloudinary === "true") {
            photo = await (0, saveFileToCloudinary_1.saveFileToCloudinary)(req.file, "plants_photos");
        }
        else {
            await (0, saveFileToUploadDir_1.saveFileToUploadDir)(req.file);
            //now we save relative (not absolute) path to photo variable. We should not save absolute path(with site address) because in case it changes all photos in db will have wrong path
            // name of the folder "uploads" is not needed because it is written in server in express.static
            photo = path.join(req.file.filename);
        }
    }
    const { _id: userId } = req.user;
    const data = await plantsServises.addPlant({ ...req.body, photo, userId });
    res.status(201).json({
        status: 201,
        message: "Success",
        data,
    });
};
exports.addPlantController = addPlantController;
const upsertPlantController = async (req, res) => {
    //------------------------------------------
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            status: 400,
            message: "Request body is missing. Please, send a req.body.",
        });
    }
    //------------------------------------------
    if (!req.user) {
        throw (0, http_errors_1.default)(401, "User not authenticated");
    }
    const { _id: userId } = req.user;
    const { id: _id } = req.params;
    const result = await plantsServises.updatePlant({
        userId: userId.toString(),
        _id,
        payload: req.body,
        options: { upsert: true },
    });
    const status = result?.isNew ? 201 : 200;
    res.status(status).json({
        status,
        message: "Plant has been updated",
        data: result?.data,
    });
};
exports.upsertPlantController = upsertPlantController;
const patchPlantController = async (req, res) => {
    const { id: _id } = req.params;
    const result = await plantsServises.updatePlant({ _id, payload: req.body });
    if (!result)
        throw (0, http_errors_1.default)(404, `Plant with id=${_id} not found`);
    res.status(200).json({
        status: 200,
        message: `Plant with name ${result.data.name} has been updated`,
        data: result.data,
    });
};
exports.patchPlantController = patchPlantController;
const deletePlantController = async (req, res) => {
    const { id: _id } = req.params;
    const data = await plantsServises.deletePlant({ _id });
    if (!data)
        throw (0, http_errors_1.default)(404, `Plant with id=${_id} not found`);
    //status 204 is called no content and body won't be sent" 
    res.status(200).json({
        status: 200,
        message: `Plant with the name ${data.name} has been deleted`,
        data,
    });
};
exports.deletePlantController = deletePlantController;

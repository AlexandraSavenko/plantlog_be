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
const express_1 = require("express");
const plantsControllers = __importStar(require("../controllers/plants"));
const ctrlWrapper_1 = __importDefault(require("../utils/ctrlWrapper"));
const plants_1 = require("../validation/plants");
const validateBody_1 = __importDefault(require("../utils/validateBody"));
const isValidId_1 = __importDefault(require("../middlewares/isValidId"));
const authenticate_1 = require("../middlewares/authenticate");
const upload_1 = require("../middlewares/upload");
//!Router is an empty object that saves routes
// console.log("object plantRouter looks like this:", plantsRouter.stack[1].route)
//controller is a handler functions as a second argument after a route. 
const plantsRouter = (0, express_1.Router)();
//middlewares for router could also be added: plantsRouter.use((req) => {if(req.method === "GET")} do something)
//if a middleware has to be used to every route the following could be done:
//plantsRouter.use(authenticate);
plantsRouter.get("/", (0, ctrlWrapper_1.default)(plantsControllers.getPlantsController));
//it's vital to keep /own before /:id otherwise it would treat /own --> /:id for it reads from top to bottom
plantsRouter.get("/own", authenticate_1.authenticate, (0, ctrlWrapper_1.default)(plantsControllers.getPlantsController));
plantsRouter.get("/:id", isValidId_1.default, (0, ctrlWrapper_1.default)(plantsControllers.getPlantByIdController));
plantsRouter.post("/", authenticate_1.authenticate, upload_1.upload.single("photo"), (0, validateBody_1.default)(plants_1.plantAddSchema), (0, ctrlWrapper_1.default)(plantsControllers.addPlantController));
plantsRouter.put("/:id", authenticate_1.authenticate, isValidId_1.default, (0, validateBody_1.default)(plants_1.plantAddSchema), (0, ctrlWrapper_1.default)(plantsControllers.upsertPlantController));
plantsRouter.patch("/:id", authenticate_1.authenticate, isValidId_1.default, (0, validateBody_1.default)(plants_1.plantUpdateSchema), (0, ctrlWrapper_1.default)(plantsControllers.patchPlantController));
plantsRouter.delete("/:id", authenticate_1.authenticate, isValidId_1.default, (0, ctrlWrapper_1.default)(plantsControllers.deletePlantController));
exports.default = plantsRouter;
//!!! higher order functions !!! don't call other functions, they return them so ehat Express receives:
// plantsRouter.post("/", 
//   (req,res,next)=> validateBody returns this,
//   (req,res,next)=> ctrlWrapper returns this
// );
//Middleware is a funciton expecting (req, res, next)
//validateBody() and ctrlWrapper are !!! factories !!! that return such functions and express calls them himself.

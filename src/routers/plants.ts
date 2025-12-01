import {Router} from "express";
import * as plantsControllers from "../controllers/plants"
import ctrlWrapper from "../utils/ctrlWrapper";

//!Router is an empty object that saves routes
// console.log("object plantRouter looks like this:", plantsRouter.stack[1].route)
//controller is a handler functions as a second argument after a route. 
const plantsRouter = Router()


plantsRouter.get("/", ctrlWrapper(plantsControllers.getPlantsController))

plantsRouter.get("/:id", ctrlWrapper(plantsControllers.getPlantByIdController))

export default plantsRouter;
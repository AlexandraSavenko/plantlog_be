import {Router} from "express";
import * as plantsControllers from "../controllers/plants"
import ctrlWrapper from "../utils/ctrlWrapper";

//!Router is an empty object that saves routes
// console.log("object plantRouter looks like this:", plantsRouter.stack[1].route)
//controller is a handler functions as a second argument after a route. 
const plantsRouter = Router()
//middlewares for router could also be added: plantsRouter.use((req) => {if(req.method === "GET")} do something)

plantsRouter.get("/", ctrlWrapper(plantsControllers.getPlantsController))

plantsRouter.get("/:id", ctrlWrapper(plantsControllers.getPlantByIdController))

plantsRouter.post("/", ctrlWrapper(plantsControllers.addPlantController))

plantsRouter.put("/:id", ctrlWrapper(plantsControllers.upsertPlantController))

export default plantsRouter;
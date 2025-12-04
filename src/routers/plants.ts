import {Router} from "express";
import * as plantsControllers from "../controllers/plants"
import ctrlWrapper from "../utils/ctrlWrapper";
import { plantAddSchema, plantUpdateSchema } from "../validation/plants";
import validateBody from "../utils/validateBody";
//!Router is an empty object that saves routes
// console.log("object plantRouter looks like this:", plantsRouter.stack[1].route)
//controller is a handler functions as a second argument after a route. 
const plantsRouter = Router()
//middlewares for router could also be added: plantsRouter.use((req) => {if(req.method === "GET")} do something)

plantsRouter.get("/", ctrlWrapper(plantsControllers.getPlantsController))

plantsRouter.get("/:id", ctrlWrapper(plantsControllers.getPlantByIdController))

plantsRouter.post("/", validateBody(plantAddSchema), ctrlWrapper(plantsControllers.addPlantController))

plantsRouter.put("/:id", validateBody(plantAddSchema), ctrlWrapper(plantsControllers.upsertPlantController))

plantsRouter.patch("/:id", validateBody(plantUpdateSchema), ctrlWrapper(plantsControllers.patchPlantController))

plantsRouter.delete("/:id", ctrlWrapper(plantsControllers.deletePlantController))

export default plantsRouter;

//!!! higher order functions !!! don't call other functions, they return them so ehat Express receives:
// plantsRouter.post("/", 
//   (req,res,next)=> validateBody returns this,
//   (req,res,next)=> ctrlWrapper returns this
// );
//Middleware is a funciton expecting (req, res, next)
//validateBody() and ctrlWrapper are !!! factories !!! that return such functions and express calls them himself.
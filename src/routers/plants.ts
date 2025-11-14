import * as plantsServises from "../services/plants";
import {Router} from "express";

//Router is an empty object
const plantsRouter = Router()


plantsRouter.get("/", async (req, res) => {
    const data = await plantsServises.getPlants()
    res.status(200).json({
        status: 200,
        message: "Plantlog the best",
        data
    })
})

plantsRouter.get("/:id", async (req, res) => {
    const {id} = req.params;

    const data = await plantsServises.getPlantById(id);
    if(!data){
        return res.status(404).json({
            status: 404,
            message: `Plant with id: ${id} is not found`
        })
    }
    res.status(200).json({
        status: 200,
        message: `Plant with id: ${id} is here`,
        data
    })
})

export default plantsRouter;
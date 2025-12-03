import createHttpError from "http-errors";
import * as plantsServises from "../services/plants";
import { Request, Response, NextFunction } from "express";

export const getPlantsController = async (req: Request, res: Response) => {
  const data = await plantsServises.getPlants();
  res.status(200).json({
    status: 200,
    message: "Plantlog the best",
    data,
  });
};

export const getPlantByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const data = await plantsServises.getPlantById(id);
  if (!data) {
    throw createHttpError(404, `Movie with id=${id} not found`);
    //the error we are throwing will be caught by next in ctrlWrapper
  }
  res.status(200).json({
    status: 200,
    message: `Plant with id: ${id} is here`,
    data,
  });
};

//req.body don't have json automaticlly because express can't read it(it sees binary code only) so in server we call a function that converts req.body to json
export const addPlantController = async (req: Request, res: Response) => {
  const data = await plantsServises.addPlant(req.body)
  res.status(201).json({
    status: 201,
    message: "Success",
    data
  })
}

export const upsertPlantController = async (req: Request, res: Response) => {
  const {id:_id} = req.params;
  const data = await plantsServises.upsertPlant({_id, payload: req.body})
res.status(200).json({
  status: 200,
  message: "Plant has been updated",
  data
})
}
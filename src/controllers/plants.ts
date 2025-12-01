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

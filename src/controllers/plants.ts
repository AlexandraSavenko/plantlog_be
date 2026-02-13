import createHttpError from "http-errors";
import * as plantsServises from "../services/plants";
import { Request, Response, NextFunction } from "express";
import { parsePaginationParams } from "../utils/parsePaginationParams";
import { sortByList } from "../db/models/Plant";
import { parseSortParams } from "../utils/parseSortParams";
import { parsePlantsFilterParams } from "../utils/parsePlantsFilterParams";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir";
import * as path from "node:path";
import { envString } from "../utils/env";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary";

const enableCloudinary = envString("ENABLE_CLOUDINARY")

export const getPlantsController = async (req: Request, res: Response) => {
  const {page, perPage} = parsePaginationParams(req.query);
  const {sortBy, sortOrder} = parseSortParams(req.query, sortByList);
  const filters = parsePlantsFilterParams(req.query);
  //there seems to be no need to create private controller
  if(req.user?._id){
    filters.userId = req.user._id
  }
  const data = await plantsServises.getPlants({page, perPage, sortBy, sortOrder, filters});
  res.status(200).json({
    status: 200,
    message: "Successfully fetched plant list",
    data,
  });
};

export const getPlantNameList = async (req: Request, res: Response) => {
const data = await plantsServises.getNameList();
res.status(200).json({
  status: 200,
  message: "Success",
  data
})
}
export const getPlantByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const data = await plantsServises.getPlantById(id);
  //if the plant doesn't exist, we receive null and will get into iff ->> 404
  //if the id value is invalid md_id (eg name), md method .findOneById will throw error
  //a middleware (isValidId) should check if id looks like md_id
  if (!data) {
    throw createHttpError(404, `Plant with id=${id} not found`);
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
  if(!req.user){
    throw createHttpError(401, "User not authenticated");
  }
  // console.log("AddPlantController", req.file)
  console.log(req.body)
  let photo = null;
  if(req.file){
    if(enableCloudinary === "true"){
      photo = await saveFileToCloudinary(req.file, "plants_photos")
    }else{
      await saveFileToUploadDir(req.file)
    //now we save relative (not absolute) path to photo variable. We should not save absolute path(with site address) because in case it changes all photos in db will have wrong path
  // name of the folder "uploads" is not needed because it is written in server in express.static
    photo = path.join(req.file.filename)
    }
  }
 const {_id: userId} = req.user;
  const data = await plantsServises.addPlant({...req.body, photo, userId});
  res.status(201).json({
    status: 201,
    message: "Successfully created a plant file",
    data,
  });
};

export const getUserFavorites = async (req: Request, res: Response) => {
  const result = await plantsServises.getUserFavorites(req.user._id)
res.status(200).json({
  status: 200,
  message: "Here's you list of favorites",
  data: result
})
}

export const toggleFavoritePlantController = async (req: Request, res: Response) => {
  const result = await plantsServises.togglePlantFavorite(req.params.id, req.user._id)
res.status(201).json({
  status: 201,
  message: `Plant id ${result.action}`,
  data: result.data
})
}
export const upsertPlantController = async (req: Request, res: Response) => {
  //------------------------------------------
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Request body is missing. Please, send a req.body.",
    });
  }
  //------------------------------------------
if(!req.user){
    throw createHttpError(401, "User not authenticated");
  }
 const {_id: userId} = req.user
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

export const patchPlantController = async (req: Request, res: Response) => {
  const { id: _id } = req.params;

  const result = await plantsServises.updatePlant({ _id, payload: req.body });
  if (!result) throw createHttpError(404, `Plant with id=${_id} not found`);

  res.status(200).json({
    status: 200,
    message: `Plant with name ${result.data.name} has been updated`,
    data: result.data,
  });
};

export const deletePlantController = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const data = await plantsServises.deletePlant({ _id });
  if (!data) throw createHttpError(404, `Plant with id=${_id} not found`);
  //status 204 is called no content and body won't be sent" 
  res.status(200).json({
    status: 200,
    message: `Plant with the name ${data.name} has been deleted`,
    data,
  });
};

import PlantCollection from "../db/models/Plant";
import { plantType, upsertPlantParams } from "../types/types";

export const getPlants = () => PlantCollection.find();

export const getPlantById = (id: string) => PlantCollection.findById(id);

export const addPlant = (payload: plantType) => PlantCollection.create(payload);

export const upsertPlant = async ({
  _id,
  payload,
  options = {},
}: upsertPlantParams) => {
  //to findOneAndUpdate we pass conditions of search (an object with such _id, or title or anything)?? and updated object
  // by default mongoose passes back an old object so new:true is needed
  // without upsert: true null will be returned in case plant doesn't exist and status will still be 200 
  const data = await PlantCollection.findOneAndUpdate({ _id }, payload, {
    ...options,
    new: true,
    upsert: true
  });
  return data;
};

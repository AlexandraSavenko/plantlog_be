import PlantCollection from "../db/models/Plant";
import { plantType, upsertPlantParams } from "../types/types";

export const getPlants = () => PlantCollection.find();

export const getPlantById = (id: string) => PlantCollection.findById(id);

export const addPlant = (payload: plantType) => PlantCollection.create(payload);

export const updatePlant = async ({
  _id,
  payload,
  options = {},
}: upsertPlantParams) => {
  //to findOneAndUpdate we pass conditions of search (an object with such _id, or title or anything)?? and updated object
  // by default mongoose passes back an old object so new:true is needed
  // without upsert: true null will be returned in case plant doesn't exist and status will still be 200 
  const rawResult = await PlantCollection.findOneAndUpdate({ _id }, payload, {
    ...options,
    new: true,
    //to know whether update or create worked we have to write includeResaltMetaDate
    // rawresult will be an object with value: {new or updated plant} and lastErrorObject: {upserted would only contain _id if the object was created}
    includeResultMetadata: true
  });
    if(!rawResult || !rawResult.value) return null;

  return {data: rawResult.value, isNew: rawResult.lastErrorObject?.upserted};
};

export const deletePlant = async (filter: {_id: string}) => {
  return PlantCollection.findOneAndDelete(filter)
}

import createHttpError from "http-errors";
import PlantCollection from "../db/models/Plant";
import { plantType, SortOrderType, upsertPlantParams } from "../types/plants";
import { calculatePaginationData } from "../utils/calculatePaginationData";

// Mongoose queries are then-able thus they return Promise-like object.
// export const getPlants = () => PlantCollection.find();
export const getPlants = async ({page = 1, perPage = 10, sortBy = "_id", sortOrder = "asc", filters = {}}) => {
  //.skip() method skips as many elements of a collection as the argument tells it.
  const skip = (page - 1) * perPage;
  const query = PlantCollection.find(filters).skip(skip).limit(perPage).sort({[sortBy]: sortOrder as SortOrderType});
  const data = await query
  //Mongoose can't run the same request twise because an error will happen: Query was already executed: plants.countDocuments
  //so to count total items with filters we need to create a new request and merge query in it.
  const totalItems = await PlantCollection.find().merge(query).countDocuments();
  const paginationData = calculatePaginationData({page, perPage, totalItems});
  return {data, ...paginationData};
};

export const getPlantById = (id: string) => PlantCollection.findById(id);

export const addPlant = (payload: plantType) => PlantCollection.create(payload);

export const updatePlant = async ({
  userId,
  _id,
  payload,
  options = {},
}: upsertPlantParams) => {
  //to findOneAndUpdate we pass conditions of search (an object with such _id, or title or anything)?? and updated object
  // by default mongoose passes back an old object so new:true is needed. It will be added in hooks.
  // without upsert: true null will be returned in case plant doesn't exist and status will still be 200
  const existing = await PlantCollection.findOne({_id})
  //check in case user A wants to upsert user B's element of the collection
  if(existing && existing.userId.toString() !== userId){
    throw createHttpError(403, "Updating this element is forbidden")
  }
  const rawResult = await PlantCollection.findOneAndUpdate({ _id}, {$set: payload, $setOnInsert: {userId}}, {
    ...options,
    //to know whether update or create worked we have to write includeResaltMetaDate
    // rawresult will be an object with value: {new or updated plant} and lastErrorObject: {upserted would only contain _id if the object was created}
    includeResultMetadata: true,
    //by default mongoose only checks with schema when adding but when updating it doesn't, so we need to check:
    // runValidators: true,
    //but instead we will add another hook, check hooks...
  });
  if (!rawResult || !rawResult.value) return null;

  return { data: rawResult.value, isNew: rawResult.lastErrorObject?.upserted };
};

export const deletePlant = async (filter: { _id: string }) => {
  return PlantCollection.findOneAndDelete(filter);
};

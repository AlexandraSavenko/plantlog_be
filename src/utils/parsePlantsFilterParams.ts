import { ParsedQs } from "qs";
import { filterByPlantTypeList } from "../db/models/Plant";

export const parsePlantsFilterParams = ({ name, plantType }: ParsedQs) => {
  const filters: Record<string, unknown> = {};
  //making case insensitive search in mongo db
  // there are also other settings: https://www.mongodb.com/docs/manual/reference/operator/query/regex/
  // db request could be terminated l06.11part2
  if (name) {
    filters.name = {$regex:String(name), $options: "i"};
  }
  if (plantType && filterByPlantTypeList.includes(String(plantType))) {
    filters.plantType = String(plantType);
  }

  return filters;
};

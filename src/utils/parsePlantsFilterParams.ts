import { ParsedQs } from "qs";
import { filterByPlantTypeList } from "../db/models/Plant";

export const parsePlantsFilterParams = ({ name, plantType }: ParsedQs) => {
  const filters: Record<string, unknown> = {};
  if (name) {
    filters.name = String(name);
  }
  if (plantType && filterByPlantTypeList.includes(String(plantType))) {
    filters.plantType = String(plantType);
  }

  return filters;
};

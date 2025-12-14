// type ParsedQs = {
//   [key: string]:
//     | string
//     | string[]
//     | ParsedQs
//     | ParsedQs[]
//     | undefined;
// };

import { GrowthForm, Origin } from "../constants/plants";

//instead of using these types they were created in constants from the lists of possible strings
// export type GrowthForm = "tree" | "shrub" | "herb" | "grass" | "vine" | "succulent" | "fern" | "moss"; 
// export type Origin = "wild" | "cultivated"

export interface plantType {
  name: string;
  description: string;
  photo: string;
  growthForm: GrowthForm;
  origin: Origin
}

export interface upsertPlantParams {
  userId?: string,
  _id: string;
  payload: {
    name?: string;
    description?: string;
    photo?: string;
    growthForm?: GrowthForm;
    origin?: Origin
  };
  options?: { upsert?: boolean };
}

export type SortOrderType = "asc" | "desc";
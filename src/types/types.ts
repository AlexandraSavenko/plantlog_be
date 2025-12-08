// type ParsedQs = {
//   [key: string]:
//     | string
//     | string[]
//     | ParsedQs
//     | ParsedQs[]
//     | undefined;
// };

export interface plantType {
  name: string;
  description: string;
  photo: string;
  plantType: "tree" | "bush" | "grass";
}

export interface upsertPlantParams {
  _id: string;
  payload: {
    name?: string;
    description?: string;
    photo?: string;
    plantType?: "tree" | "bush" | "grass";
  };
  options?: { upsert?: boolean };
}

export type SortOrderType = "asc" | "desc";

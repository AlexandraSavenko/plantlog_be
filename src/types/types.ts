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
  options?: {};
}

import PlantCollection from "../db/models/Plant"


export const getPlants = () => PlantCollection.find()


export const getPlantById = (id: string) => PlantCollection.findById(id)
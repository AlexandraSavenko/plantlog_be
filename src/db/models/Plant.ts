import { Schema, model } from "mongoose";

const plantSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    }
});

const PlantCollection = model("plants", plantSchema);

export default PlantCollection;
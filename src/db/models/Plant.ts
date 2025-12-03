import { Schema, model } from "mongoose";
import { plantsTypelist } from "../../constants/plants";

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
    },
    plantType: {
        type: String,
        enum: plantsTypelist,
        required: true,
        default: "tree"
    },
}, {versionKey: false, timestamps: true});

const PlantCollection = model("plants", plantSchema);

export default PlantCollection;
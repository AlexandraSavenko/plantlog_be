import { CallbackError, Schema, model } from "mongoose";
import { plantsTypelist } from "../../constants/plants";
import { handleSaveErrorStatus, setUpdateSettings } from "../hooks";
import { plantType } from "../../types/types";


const plantSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    photo: {
        type: String,
        required: [true, "Photo is required"],
    },
    plantType: {
        type: String,
        enum: plantsTypelist,
        required: true,
        default: "tree"
    },
}, {versionKey: false, timestamps: true});
//Mongoose Hook:
//to set status in case req.body doesn't match schema (cause if it doesn't md throws error, ctrlWrapper catches it but there's no status ->> 500)
//we can use this middleware on mongooseSchema
//post doesn't mean http-method, it means "after", there's also before
//md has many methods like .findOneById, but under the hood it has intermal operations, one of them is "save" and it's first argument, 
// the second should be a function with three!! arguments
//it's like we go inside the method and in case saving went unsuccessfully run this function firts and then go on
// from "https://mongoosejs.com/docs/validation.html"
plantSchema.post("save", handleSaveErrorStatus);

plantSchema.pre("findOneAndUpdate", setUpdateSettings);

plantSchema.post("findOneAndUpdate", handleSaveErrorStatus);

//this list should be changed if the schema changes! it is used in parseSortParams function;
export const sortByList: (keyof plantType)[] = ["name", "description", "photo", "plantType"];
export const filterByPlantTypeList = ["tree", "bush", "grass"]
const PlantCollection = model("plants", plantSchema);

export default PlantCollection;
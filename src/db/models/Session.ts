import { CallbackError, Schema, model } from "mongoose";
import { handleSaveErrorStatus, setUpdateSettings } from "../hooks";
import { required } from "joi";

const sessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        //it's a good practice to write from which table usreId comes from
        ref: "users",
        required: true
    }, accessToken: {
        type: String,
        required: true
    }, refreshToken: {
         type: String,
        required: true
    }, accessTokenValidUntill: {
        type: Date,
        required: true
    }, refreshTokenValidUntill: {
        type: Date,
        required: true
    }
}, {versionKey: false, timestamps: true})

sessionSchema.post("save", handleSaveErrorStatus);

sessionSchema.pre("findOneAndUpdate", setUpdateSettings);

sessionSchema.post("findOneAndUpdate", handleSaveErrorStatus);
const SessionCollection = model("session", sessionSchema);

export default SessionCollection;
import { CallbackError, Schema, model } from "mongoose";
import { applySchemaHooks, handleSaveErrorStatus, setUpdateSettings } from "../hooks";
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
    }, accessTokenValidUntil: {
        type: Date,
        required: true
    }, refreshTokenValidUntil: {
        type: Date,
        required: true
    }
}, {versionKey: false, timestamps: true})

applySchemaHooks(sessionSchema);
const SessionCollection = model("session", sessionSchema);

export default SessionCollection;
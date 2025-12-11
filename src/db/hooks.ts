import { NextFunction } from "express";
import { plantType } from "../types/plants";
import mongoose, { CallbackError, Query} from "mongoose";
export const handleSaveErrorStatus = (error: any, data: plantType, next: (err?: CallbackError) => void) => {
    //in case email already exist in db, error will have code 11000 but in case email is invalid error.code = undefined
    const {code, name} = error;
    error.status = (name === "MongoServerError" && code === 11000) ? 409 : 400;
    next()
}

//arrow function wouldn't allow to use this, so function expression is used !!!
//Also without passing this as an argument mongoose looses track of it because the function is in hooks.ts
export const setUpdateSettings = function(this: Query<any, any>, next: (err?: CallbackError) => void){
    // this.options.runValidators = true;
    // this.options.new = true
    this.setOptions({runValidators: true, new: true});
    next()
}

export const applySchemaHooks = (schema: mongoose.Schema) => {
schema.post("save", handleSaveErrorStatus);
schema.pre("findOneAndUpdate", setUpdateSettings);
schema.post("findOneAndUpdate", handleSaveErrorStatus);
// schema.post("save", function() {
//     console.log("Saving went well!")
// })
}
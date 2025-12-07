import { NextFunction } from "express";
import { plantType } from "../types/types";
import { CallbackError, Query} from "mongoose";
export const handleSaveErrorStatus = (error: any, data: plantType, next: (err?: CallbackError) => void) => {
    error.status = 400
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
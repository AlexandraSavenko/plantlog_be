import Joi from "joi";
import { GrowthFormList, OriginList } from "../constants/plants";

export const plantAddSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    photo: Joi.string().required(),
    growthForm: Joi.string().valid(...GrowthFormList),
    origin: Joi.string().valid(...OriginList)
})

//name: Joi.string().required().messages({
// "any.required": "You need to write a proper name", 
// "string.empty": "name should not be empty string"})

export const plantUpdateSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    photo: Joi.string(),
    growthForm: Joi.string().valid(...GrowthFormList),
    origin: Joi.string().valid(...OriginList)
})
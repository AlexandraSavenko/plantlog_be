import Joi from "joi";
import { plantsTypelist } from "../constants/plants";

export const plantAddSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    photo: Joi.string().required(),
    plantType: Joi.string().valid(...plantsTypelist)
})

//name: Joi.string().required().messages({
// "any.required": "You need to write a proper name", 
// "string.empty": "name should not be empty string"})

export const plantUpdateSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    photo: Joi.string(),
    plantType: Joi.string().valid(...plantsTypelist)
})
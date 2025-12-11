import { CallbackError, Schema, model } from "mongoose";
import { plantsTypelist } from "../../constants/plants";
import { emailRegex } from "../../constants/users";
import { applySchemaHooks, handleSaveErrorStatus, setUpdateSettings } from "../hooks";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    match: emailRegex,
    //in atlas in the db there is a tab called indexes and there should be not only _id but also email, if not it should be created manually
    //this is the only exception when check is made after db request not before it thus in service we need to make two db requests to send error message that will look userfriendly
    unique: true,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  }
}, {versionKey: false, timestamps: true});

//gives status 400 to mongo db errors
//makes mongoose check with schema on put and patch and return new object
applySchemaHooks(userSchema)

const UsersCollection = model("users", userSchema);

export default UsersCollection;
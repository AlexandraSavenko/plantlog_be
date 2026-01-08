import { CallbackError, Schema, model, Document } from "mongoose";
import { authProviderList, emailRegex } from "../../constants/users";
import {
  applySchemaHooks,
  handleSaveErrorStatus,
  setUpdateSettings,
} from "../hooks";
import { UserType } from "../../types/auth";
import { required } from "joi";

// export interface UserDocument extends UserType, Document {};
//this interface did the opposite, it confused typescript!!!!
const userSchema = new Schema(
  {
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
    },
    favoritePlants: [
      {
        type: Schema.Types.ObjectId,
        ref: "plants",
      },
    ],
    verify: {
      type: Boolean,
      default: false,
      required: true,
    },
    authProvider: {
      type: String,
      enum: authProviderList,
      default: "local",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

//gives status 400 to mongo db errors
//makes mongoose check with schema on put and patch and return new object
applySchemaHooks(userSchema);

const UsersCollection = model("users", userSchema);

export default UsersCollection;

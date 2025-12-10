import { CallbackError, Schema, model } from "mongoose";
import { plantsTypelist } from "../../constants/plants";
import { emailRegex } from "../../constants/users";
import { handleSaveErrorStatus, setUpdateSettings } from "../hooks";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    match: emailRegex,
    unique: true,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  }
});

//gives status 400 to mongo db errors
userSchema.post("save", handleSaveErrorStatus);
//makes mongoose check with schema on put and patch and return new object
userSchema.pre("findOneAndUpdate", setUpdateSettings);

userSchema.post("findOneAndUpdate", handleSaveErrorStatus);

const UsersCollection = model("users", userSchema);

export default UsersCollection;
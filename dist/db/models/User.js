"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const users_1 = require("../../constants/users");
const hooks_1 = require("../hooks");
// export interface UserDocument extends UserType, Document {};
//this interface did the opposite, it confused typescript!!!!
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        match: users_1.emailRegex,
        //in atlas in the db there is a tab called indexes and there should be not only _id but also email, if not it should be created manually
        //this is the only exception when check is made after db request not before it thus in service we need to make two db requests to send error message that will look userfriendly
        unique: true,
        required: [true, "email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    favorites: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
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
        enum: users_1.authProviderList,
        default: "local",
        required: true,
    },
}, { versionKey: false, timestamps: true });
//gives status 400 to mongo db errors
//makes mongoose check with schema on put and patch and return new object
(0, hooks_1.applySchemaHooks)(userSchema);
const UsersCollection = (0, mongoose_1.model)("users", userSchema);
exports.default = UsersCollection;

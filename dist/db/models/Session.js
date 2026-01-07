"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const hooks_1 = require("../hooks");
const sessionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { versionKey: false, timestamps: true });
(0, hooks_1.applySchemaHooks)(sessionSchema);
const SessionCollection = (0, mongoose_1.model)("session", sessionSchema);
exports.default = SessionCollection;

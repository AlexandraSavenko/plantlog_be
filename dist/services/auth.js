"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInOrUpWithGoogle = exports.signout = exports.refreshUserSession = exports.findUserById = exports.findSession = exports.signin = exports.verifyUser = exports.signup = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const User_1 = __importDefault(require("../db/models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Session_1 = __importDefault(require("../db/models/Session"));
//crypto is express built-in;
const crypto_1 = require("crypto");
const users_1 = require("../constants/users");
//email-verification
const sendEmail_1 = require("../utils/sendEmail");
// import * as path from "node:path";
// import { TEMPLATE_DIR } from "../constants/emailVerification";
//what is this I've no idea
// import * as fs from "node:fs/promises";
// import Handlebars from "handlebars";
// import {env} from "../utils/env"
const jwt_1 = require("../utils/jwt");
const createEmail_1 = require("../emails/createEmail");
const googleOAuth2_1 = require("../utils/googleOAuth2");
// const emailTemplatePath = path.join(TEMPLATE_DIR, "verify-email.html")
// const appDomain = env("APP_DOMAIN");
// //console.log(emailTemplatePath) --> D:\Projects\plantlog_be\src\templates\verify-email.html
const createSession = async (userId) => {
    //should be better that delete one
    await Session_1.default.deleteMany({ userId });
    const accessToken = (0, crypto_1.randomBytes)(30).toString("base64");
    //check pattern called Refresh Token Rotation (RTR) in the future
    const refreshToken = (0, crypto_1.randomBytes)(30).toString("base64");
    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: Date.now() + users_1.accessTokenLifeTime,
        refreshTokenValidUntil: Date.now() + users_1.refreshTokenLifeTime,
    };
};
const signup = async (payload) => {
    const { email, password } = payload;
    const user = await findUserByEmail({ email });
    if (user) {
        throw (0, http_errors_1.default)(409, "Email is already in use");
    }
    const hashPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = await User_1.default.create({
        ...payload,
        password: hashPassword,
        authProvider: "local"
    });
    const jwtToken = (0, jwt_1.createJWT)(email);
    const verifyEmail = await (0, createEmail_1.createEmail)(email, jwtToken);
    await (0, sendEmail_1.sendEmail)(verifyEmail);
    return newUser;
};
exports.signup = signup;
const verifyUser = async (email) => {
    const user = await findUserByEmail({ email });
    if (!user) {
        throw (0, http_errors_1.default)(404, "User not found!");
    }
    const data = await User_1.default.findByIdAndUpdate(user._id, {
        verify: true,
    });
    return data;
};
exports.verifyUser = verifyUser;
const signin = async ({ email, password }) => {
    const user = await User_1.default.findOne({ email });
    if (!user) {
        throw (0, http_errors_1.default)(401, "Email is incorrect");
    }
    if (!user.verify) {
        throw (0, http_errors_1.default)(401, "You need to verify your email");
    }
    const checkPassword = await bcryptjs_1.default.compare(password, user.password);
    if (!checkPassword) {
        throw (0, http_errors_1.default)(401, "Password is incorrect");
    }
    //   await SessionCollection.deleteOne({ userId: user._id });
    const newSession = await createSession(user._id.toString());
    return Session_1.default.create({
        userId: user._id,
        ...newSession,
    });
};
exports.signin = signin;
//this request is for authenticate.ts middleware to check if token is valid and exists in one of the sessions
const findSession = (filter) => Session_1.default.findOne(filter);
exports.findSession = findSession;
const findUserById = (filter) => User_1.default.findById(filter).lean();
exports.findUserById = findUserById;
const findUserByEmail = (filter) => User_1.default.findOne(filter);
const refreshUserSession = async ({ sessionId, refreshToken, }) => {
    const session = await Session_1.default.findOne({
        _id: sessionId,
        refreshToken,
    });
    if (!session) {
        throw (0, http_errors_1.default)(401, "Session not found");
    }
    if (Date.now() > session.refreshTokenValidUntil.getTime()) {
        throw (0, http_errors_1.default)(401, "Refresh token has expired");
    }
    //   await SessionCollection.deleteOne({ _id: sessionId });
    const newSession = await createSession(session.userId.toString());
    return Session_1.default.create({
        userId: session.userId,
        ...newSession,
    });
};
exports.refreshUserSession = refreshUserSession;
const signout = async (sessionId) => {
    //even if there was no session, it can't hurt anyone
    await Session_1.default.deleteOne({ _id: sessionId });
};
exports.signout = signout;
const signInOrUpWithGoogle = async (code) => {
    const signTicket = await (0, googleOAuth2_1.validateCode)(code);
    //information in ticket is hidden so it should be decoded
    const payload = signTicket.getPayload();
    if (!payload) {
        throw (0, http_errors_1.default)(401);
    }
    //now sign in vs sign up logics needs to be worked through
    let user = await User_1.default.findOne({
        email: payload.email,
    });
    if (!user) {
        // console.log("not user, user create");
        const password = await bcryptjs_1.default.hash((0, crypto_1.randomBytes)(10).toString("hex"), 10);
        const username = payload.given_name || payload.email?.split("@")[0];
        user = await User_1.default.create({
            email: payload.email,
            username,
            password,
            verify: true,
            authProvider: "google"
        });
    }
    const newSession = await createSession(user._id.toString());
    return Session_1.default.create({
        userId: user._id,
        ...newSession,
    });
};
exports.signInOrUpWithGoogle = signInOrUpWithGoogle;

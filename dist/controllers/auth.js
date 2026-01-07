"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinWithGoogleController = exports.getGoogleOAuthURLController = exports.signoutController = exports.refreshSessionController = exports.signinController = exports.verifyController = exports.signupController = void 0;
const authServices = __importStar(require("../services/auth"));
const http_errors_1 = __importDefault(require("http-errors"));
const googleOAuth2_1 = require("../utils/googleOAuth2");
const setupSession = (res, session) => {
    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });
    //no idea why session id could be saved in cookies, but obviously there could be some need
    //and it's for refresh
    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });
};
const signupController = async (req, res) => {
    const data = await authServices.signup(req.body);
    res.status(201).json({
        status: 201,
        message: "User has been successfully signed up",
        data: data.username,
    });
};
exports.signupController = signupController;
const verifyController = async (req, res) => {
    if (!req.userEmail) {
        return (0, http_errors_1.default)(400, "Could not verify email");
    }
    await authServices.verifyUser(req.userEmail);
    res.json({
        status: 200,
        message: "User has been verifies",
    });
};
exports.verifyController = verifyController;
const signinController = async (req, res) => {
    const session = await authServices.signin(req.body);
    setupSession(res, session);
    res.json({
        status: 200,
        message: "User has been successfully signed in",
        data: {
            accessToken: session.accessToken,
        },
    });
};
exports.signinController = signinController;
const refreshSessionController = async (req, res) => {
    const session = await authServices.refreshUserSession(req.cookies);
    setupSession(res, session);
    res.json({
        status: 200,
        message: "Session has been successfully refreshed",
        data: {
            accessToken: session.accessToken,
        },
    });
};
exports.refreshSessionController = refreshSessionController;
const signoutController = async (req, res) => {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
        const data = await authServices.signout(sessionId);
    }
    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");
    res.status(200).json({
        status: 200,
        message: "User has been successfully signed out",
    });
};
exports.signoutController = signoutController;
const getGoogleOAuthURLController = async (req, res) => {
    const url = await (0, googleOAuth2_1.generateAuthUrl)();
    //place everything about google into utilite;
    res.json({
        status: 200,
        message: "Successfully get GoogleOAuth",
        data: {
            url
        }
    });
};
exports.getGoogleOAuthURLController = getGoogleOAuthURLController;
const signinWithGoogleController = async (req, res) => {
    const session = await authServices.signInOrUpWithGoogle(req.body.code);
    setupSession(res, session);
    res.json({
        status: 200,
        message: "Session has been successfully created with google code",
        data: {
            accessToken: session.accessToken,
        },
    });
};
exports.signinWithGoogleController = signinWithGoogleController;

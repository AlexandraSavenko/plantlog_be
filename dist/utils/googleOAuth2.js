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
exports.validateCode = exports.generateAuthUrl = void 0;
const google_auth_library_1 = require("google-auth-library");
const path = __importStar(require("node:path"));
const promises_1 = require("fs/promises");
const env_1 = require("./env");
const http_errors_1 = __importDefault(require("http-errors"));
//JSON file google-auth.json should be read and some data from it should be taken
const googleOAuthSettingsPath = path.resolve("google-oauth.json");
const clientId = (0, env_1.envString)("GOOGLE_CLIENT_ID");
const clientSecret = (0, env_1.envString)("GOOGLE_CLIENT_SECRET");
let oauthClient = null;
const getGoogleOAuthClient = async () => {
    if (oauthClient)
        return oauthClient;
    const file = await (0, promises_1.readFile)(googleOAuthSettingsPath, "utf-8");
    const oauthConfig = JSON.parse(file);
    const googleOAuthClient = new google_auth_library_1.OAuth2Client({
        clientId,
        clientSecret,
        redirectUri: oauthConfig.web.redirect_uris[0],
    });
    return googleOAuthClient;
};
const generateAuthUrl = async () => {
    const client = await getGoogleOAuthClient();
    return client.generateAuthUrl({
        //scope tell google which information is needed
        scope: ["https://www.googleapis.com/auth/userinfo.email"],
    });
};
exports.generateAuthUrl = generateAuthUrl;
const validateCode = async (code) => {
    // console.log("Code", code)
    const client = await getGoogleOAuthClient();
    //   console.log("Client", client)
    let response;
    try {
        response = await client.getToken(code);
        //   console.log("Response", response) 
    }
    catch (error) {
        throw error;
    }
    const token = response?.tokens.id_token;
    if (!token) {
        throw (0, http_errors_1.default)(401);
    }
    //jwt.io
    //instead of decoding the token it should be sent to google to get info about user
    const ticket = await client.verifyIdToken({
        idToken: token
    });
    // console.log("Valid code here is your ticket", ticket)
    return ticket;
};
exports.validateCode = validateCode;

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
exports.createEmail = void 0;
const path = __importStar(require("node:path"));
const emailVerification_1 = require("../constants/emailVerification");
const env_1 = require("../utils/env");
const fs = __importStar(require("node:fs/promises"));
const handlebars_1 = __importDefault(require("handlebars"));
const emailTemplatePath = path.join(emailVerification_1.TEMPLATE_DIR, "verify-email.html");
const appDomain = (0, env_1.env)("APP_DOMAIN");
//console.log(emailTemplatePath) --> D:\Projects\plantlog_be\src\templates\verify-email.html
const createEmail = async (email, token) => {
    //we need to read the content of the html file with email and transform it from binary to text
    const templateSource = await fs.readFile(emailTemplatePath, "utf-8");
    //next handlebars template needs to be created. Handlears turns text to object
    const template = handlebars_1.default.compile(templateSource);
    //html content of the letter needs to be created --> we call template as a function and pass content
    //and this html goes as verifyEmail.html
    const html = template({ link: `${appDomain}/auth/verify?token=${token}` });
    const verifyEmail = {
        to: email,
        subject: "Plantlog email verification",
        html
    };
    return verifyEmail;
};
exports.createEmail = createEmail;

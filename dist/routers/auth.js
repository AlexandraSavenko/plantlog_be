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
const express_1 = require("express");
const authControllers = __importStar(require("../controllers/auth"));
const ctrlWrapper_1 = __importDefault(require("../utils/ctrlWrapper"));
const auth_1 = require("../validation/auth");
const validateBody_1 = __importDefault(require("../utils/validateBody"));
const emailVerificationAuth_1 = require("../middlewares/emailVerificationAuth");
const authRouter = (0, express_1.Router)();
authRouter.post("/signup", (0, validateBody_1.default)(auth_1.authSignUpSchema), (0, ctrlWrapper_1.default)(authControllers.signupController));
authRouter.get("/verify", emailVerificationAuth_1.emailVerificationAuth, (0, ctrlWrapper_1.default)(authControllers.verifyController));
authRouter.post("/signin", (0, validateBody_1.default)(auth_1.authSignInSchema), (0, ctrlWrapper_1.default)(authControllers.signinController));
//to read cookies a lib called cookie-parser needs to be installed and used in server
authRouter.post("/refresh", (0, ctrlWrapper_1.default)(authControllers.refreshSessionController));
authRouter.post("/signout", (0, ctrlWrapper_1.default)(authControllers.signoutController));
authRouter.get("/get-oauth-url", (0, ctrlWrapper_1.default)(authControllers.getGoogleOAuthURLController));
authRouter.post("/confirm-oauth", (0, validateBody_1.default)(auth_1.authOAuthGoogleSchema), (0, ctrlWrapper_1.default)(authControllers.signinWithGoogleController));
exports.default = authRouter;

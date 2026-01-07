"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const auth_1 = require("../services/auth");
const authenticate = async (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        //throw error won't work here because we don't wrap this function in ctrlWrapper so throwing error will crash backend
        //authenticate could be wrapped in ctrlWrapper but with editional difficulties ???
        return next((0, http_errors_1.default)(401, "Authorization header missing"));
    }
    const [bearer, token] = authHeader?.split(" ");
    if (bearer !== "Bearer") {
        return next((0, http_errors_1.default)(401, "Authorization header must be of type 'Bearer'"));
    }
    //to check if token is valid an additional function in serivces has to be created
    const session = await (0, auth_1.findSession)({ accessToken: token });
    if (!session) {
        return next((0, http_errors_1.default)(401, "Session is not found"));
    }
    //mongoose return some NativeDate object instead of number, so it should be converted with .getTime() method
    if (Date.now() > session.accessTokenValidUntil.getTime()) {
        return next((0, http_errors_1.default)(401, "Access token expired"));
    }
    //check if user exists any way is needed
    const user = await (0, auth_1.findUserById)({ _id: session.userId });
    if (!user) {
        return next((0, http_errors_1.default)(401, "Access token expired"));
    }
    //as userId is not in the req.body it should be added manually, so this is the place to do it:
    //to allow user in req type I've added .d.ts file in types, typed Schema and model in /db/models/User and added additional line to tsconfig.json
    //however nodemon couldn't compile it all together untill I added nodemon.json file and restarted nodemon with:
    //npx nodemon --exec "npx ts-node --files" src/index.ts
    //adding this command to package.json allowed me to avoid typing it each time 
    //so the whole problem with making user bacome part of req type took me two days and I had to turn what db returned to a plain object with .lean()
    //becuase its type wouldn't match the type I've created otherwise and also I've typed the schema itself, though I can't clearly understand it at the moment
    req.user = user;
    next();
};
exports.authenticate = authenticate;

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirIfNotExist = void 0;
//fs is Node.js's built-in File System Module (not method or class) that exposes function for working with files and directories
//this is promise-based API: import {promises as fs} from "fs"; which means both fs.access and fs.mkdir are async function (https://nodejs.org/api/fs.html)
const fs = __importStar(require("node:fs/promises"));
//since mulder(lib that works with files like pictures) can't find folder it will not work
const createDirIfNotExist = async (path) => {
    try {
        //fs.access check if the folder exists
        await fs.access(path);
    }
    catch (error) {
        //If the directory doesn't exist Node creates a system error and throws it (rejected Promise)
        //this is what error looks like: {
        //   code: "ENOENT",
        //   errno: -2,
        //   syscall: "access",
        //   path: "/some/path"
        // }
        //error: unknown and I can't access properties on unknown!!! so I can't do this: if(error.code === "ENOENT")
        if (error instanceof Error &&
            "code" in error &&
            error.code === "ENOENT") {
            await fs.mkdir(path, { recursive: true });
        }
        else {
            //when I call this function in middleware/controller/route handler Express will catch it and pass it to error-handleing middleware(the one with four argument)
            //without error handler Epress sends 500 Internal Server Error, but the message may be hidden
            //this function is called in index.js before Express has created req and so it won't ba caught unless trycatch wraps the Express call
            throw error;
        }
    }
};
exports.createDirIfNotExist = createDirIfNotExist;

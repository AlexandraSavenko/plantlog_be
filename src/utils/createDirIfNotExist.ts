//fs is Node.js's built-in File System Module (not method or class) that exposes function for working with files and directories
//this is promise-based API: import {promises as fs} from "fs"; which means both fs.access and fs.mkdir are async function (https://nodejs.org/api/fs.html)
import * as fs from "node:fs/promises";

//since mulder(lib that works with files like pictures) can't find folder it will not work
export const createDirIfNotExist = async (path: string) => {
  try {
    //fs.access check if the folder exists
    await fs.access(path);
  } catch (error) {
    //If the directory doesn't exist Node creates a system error and throws it (rejected Promise)
    //this is what error looks like: {
    //   code: "ENOENT",
    //   errno: -2,
    //   syscall: "access",
    //   path: "/some/path"
    // }
    //error: unknown and I can't access properties on unknown!!! so I can't do this: if(error.code === "ENOENT")
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      await fs.mkdir(path, { recursive: true });
    } else {
      //when I call this function in middleware/controller/route handler Express will catch it and pass it to error-handleing middleware(the one with four argument)
      //without error handler Epress sends 500 Internal Server Error, but the message may be hidden
      //this function is called in index.js before Express has created req and so it won't ba caught unless trycatch wraps the Express call
      throw error;
    }
  }
};

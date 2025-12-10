import { Router } from "express";

import * as authControllers from "../controllers/auth"
import validateBody from "../utils/validateBody";
import { authSignUpSchema } from "../validation/auth";
import ctrlWrapper from "../utils/ctrlWrapper";

const authRouter = Router();

authRouter.post("/signup", validateBody(authSignUpSchema), ctrlWrapper(authControllers.signupController) )

export default authRouter;
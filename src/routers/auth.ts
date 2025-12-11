import { Router } from "express";
import * as authControllers from "../controllers/auth";
import ctrlWrapper from "../utils/ctrlWrapper";
import { authSignInSchema, authSignUpSchema } from "../validation/auth";
import validateBody from "../utils/validateBody";

const authRouter = Router();

authRouter.post(
  "/signup", 
  validateBody(authSignUpSchema),
  ctrlWrapper(authControllers.signupController)
);
authRouter.post("/signin", validateBody(authSignInSchema), ctrlWrapper(authControllers.signinController))

export default authRouter;

import { Router } from "express";
import * as authControllers from "../controllers/auth";
import ctrlWrapper from "../utils/ctrlWrapper";
import { authSignUpSchema } from "../validation/auth";
import validateBody from "../utils/validateBody";

const authRouter = Router();

authRouter.post(
  "/register", 
  validateBody(authSignUpSchema),
  ctrlWrapper(authControllers.signupController)
);


export default authRouter;

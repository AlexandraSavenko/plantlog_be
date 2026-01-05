import { Router } from "express";
import * as authControllers from "../controllers/auth";
import ctrlWrapper from "../utils/ctrlWrapper";
import { authSignInSchema, authSignUpSchema } from "../validation/auth";
import validateBody from "../utils/validateBody";
import { emailVerificationAuth } from "../middlewares/emailVerificationAuth";

const authRouter = Router();

authRouter.post(
  "/signup", 
  validateBody(authSignUpSchema),
  ctrlWrapper(authControllers.signupController)
);

authRouter.get("/verify", emailVerificationAuth, ctrlWrapper(authControllers.verifyController))
authRouter.post("/signin", validateBody(authSignInSchema), ctrlWrapper(authControllers.signinController))

//to read cookies a lib called cookie-parser needs to be installed and used in server
authRouter.post("/refresh", ctrlWrapper(authControllers.refreshSessionController))

authRouter.post("/signout", ctrlWrapper(authControllers.signoutController))

authRouter.get("/get-oauth-url", ctrlWrapper(authControllers.getGoogleOAuthURLController))

export default authRouter;

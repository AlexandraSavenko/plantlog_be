import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import ctrlWrapper from "../utils/ctrlWrapper";
import { getUserController } from "../controllers/users";

const userRouter = Router();

userRouter.get("/", authenticate, ctrlWrapper(getUserController))

export default userRouter;
import express from "express";
import { activateUser, regHandler } from "../controller/user.controller";

const userRouter = express.Router();

userRouter.post("/registration", regHandler);
userRouter.post("/activateUser", activateUser);

export default userRouter;

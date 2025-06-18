import express from "express";
import { regHandler } from "../controller/user.controller";

const userRouter = express.Router();

userRouter.post("/registration", regHandler);

export default userRouter;

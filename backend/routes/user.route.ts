import express from "express";
import {
  activateUser,
  loginUser,
  logoutUser,
  regHandler,
} from "../controller/user.controller";

const userRouter = express.Router();

userRouter.post("/registration", regHandler);
userRouter.post("/activateUser", activateUser);

userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

export default userRouter;

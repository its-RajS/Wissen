import express from "express";
import {
  activateUser,
  deleteUser_Admin,
  getAllUsersAdmin,
  getUserInfo,
  loginUser,
  logoutUser,
  regHandler,
  socialAuth,
  updateAccessToken,
  updateUserAvatar,
  updateUserInfo,
  updateUserPassword,
  updateUserRole_Admin,
} from "../controller/user.controller";
import { authoriedRole, isAuthenticate } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/registration", regHandler);
userRouter.post("/activateUser", activateUser);

userRouter.post("/login", loginUser);
userRouter.post("/logout", isAuthenticate, logoutUser);

userRouter.get("/refresh", updateAccessToken);

userRouter.get("/me", isAuthenticate, getUserInfo);

userRouter.post("/socialAuth", socialAuth);

userRouter.put("/updateUserInfo", isAuthenticate, updateUserInfo);
userRouter.put("/updateUserPassword", isAuthenticate, updateUserPassword);
userRouter.put("/updateUserAvatar", isAuthenticate, updateUserAvatar);

userRouter.get(
  "/allUsers",
  isAuthenticate,
  authoriedRole("admin"),
  getAllUsersAdmin
);

userRouter.put(
  "/updateUserRole",
  isAuthenticate,
  authoriedRole("admin"),
  updateUserRole_Admin
);
userRouter.delete(
  "/deleteUser/:id",
  isAuthenticate,
  authoriedRole("admin"),
  deleteUser_Admin
);

export default userRouter;

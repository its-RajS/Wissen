import express from "express";
import { authoriedRole, isAuthenticate } from "../middleware/auth";
import {
  getAllNotitfication,
  UpdateNotitfication,
} from "../controller/notification.controller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/allAdminNotification",
  isAuthenticate,
  authoriedRole("admin"),
  getAllNotitfication
);

notificationRouter.put(
  "/updateNotification/:id",
  isAuthenticate,
  authoriedRole("admin"),
  UpdateNotitfication
);

export default notificationRouter;

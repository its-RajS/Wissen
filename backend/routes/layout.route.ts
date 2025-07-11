import express from "express";
import { authoriedRole, isAuthenticate } from "../middleware/auth";
import {
  createLayout,
  editLayout,
  getLayout,
} from "../controller/layout.controller";

const layoutRouter = express.Router();

layoutRouter.post(
  "/createLayout",
  isAuthenticate,
  authoriedRole("admin"),
  createLayout
);
layoutRouter.put(
  "/editLayout",
  isAuthenticate,
  authoriedRole("admin"),
  editLayout
);
layoutRouter.get("/getLayout", getLayout);

export default layoutRouter;

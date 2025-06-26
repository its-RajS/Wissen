import express from "express";
import { authoriedRole, isAuthenticate } from "../middleware/auth";
import { editCourse, uploadCourse } from "../controller/course.controller";

const courseRouter = express.Router();

courseRouter.post(
  "/createCourse",
  isAuthenticate,
  authoriedRole("admin"),
  uploadCourse
);

courseRouter.put(
  "/editCourse/:id",
  isAuthenticate,
  authoriedRole("admin"),
  editCourse
);

export default courseRouter;

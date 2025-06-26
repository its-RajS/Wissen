import express from "express";
import { authoriedRole, isAuthenticate } from "../middleware/auth";
import {
  editCourse,
  getAllCourse,
  getSingleCourse,
  getUserCourse,
  uploadCourse,
} from "../controller/course.controller";

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

courseRouter.get("/getCourse/:id", getSingleCourse);
courseRouter.get("/getCourse", getAllCourse);

courseRouter.get("/getUserCourseContent/:id", isAuthenticate, getUserCourse);

export default courseRouter;

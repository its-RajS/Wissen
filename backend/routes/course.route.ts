import express from "express";
import { authoriedRole, isAuthenticate } from "../middleware/auth";
import {
  addCommentReplies,
  addComments,
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

courseRouter.put("/addComment", isAuthenticate, addComments);
courseRouter.put("/addCommentReply", isAuthenticate, addCommentReplies);

export default courseRouter;

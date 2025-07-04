import express from "express";
import { authoriedRole, isAuthenticate } from "../middleware/auth";
import {
  addCommentReplies,
  addComments,
  addReview,
  adminReviewReply,
  deleteCourse_Admin,
  editCourse,
  getAlCoursesUsersAdmin,
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

courseRouter.put("/addReview/:id", isAuthenticate, addReview);
courseRouter.put(
  "/adminReviewReply",
  isAuthenticate,
  authoriedRole("admin"),
  adminReviewReply
);

courseRouter.get(
  "/getAllCourse",
  isAuthenticate,
  authoriedRole("admin"),
  getAlCoursesUsersAdmin
);

courseRouter.delete(
  "/deleteCourse",
  isAuthenticate,
  authoriedRole("admin"),
  deleteCourse_Admin
);

export default courseRouter;

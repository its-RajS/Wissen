import express from "express";
import { authoriedRole, isAuthenticate } from "../middleware/auth";
import {
  getCourseAnalytics,
  getOrderAnalytics,
  getUserAnalytics,
} from "../controller/analytics.controller";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/userAnalytics",
  isAuthenticate,
  authoriedRole("admin"),
  getUserAnalytics
);
analyticsRouter.get(
  "/coursesAnalytics",
  isAuthenticate,
  authoriedRole("admin"),
  getCourseAnalytics
);
analyticsRouter.get(
  "/orderAnalytics",
  isAuthenticate,
  authoriedRole("admin"),
  getOrderAnalytics
);

export default analyticsRouter;

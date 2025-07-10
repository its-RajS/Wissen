import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import { generateLast12MonthData } from "../utils/analytics";
import userModel from "../models/user.model";
import courseModel from "../models/course.model";
import orderModel from "../models/order.model";

//? User Analytics
export const getUserAnalytics = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //* Get the users analytics
      const users = generateLast12MonthData(userModel);

      return res.status(201).json({
        success: true,
        message: "Last 12 Month users Data",
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//? Courses Analytics
export const getCourseAnalytics = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //* Get the courses analytics
      const courses = generateLast12MonthData(courseModel);

      return res.status(201).json({
        success: true,
        message: "Last 12 Month courses Data",
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//? Orders Analytics
export const getOrderAnalytics = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //* Get the orders analytics
      const orders = generateLast12MonthData(orderModel);

      return res.status(201).json({
        success: true,
        message: "Last 12 Month orders Data",
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

import { Response, Request, NextFunction } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import path from "path";
import ejs from "ejs";
import notificationModel from "../models/notification.model";

//? Get all notification --> only for admin
export const getAllNotitfication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await notificationModel
        .find()
        .sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        message: "All notification fetched successfully",
        notification,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//? Update notification status --> admin only
export const UpdateNotitfication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await notificationModel.findById(req.params.id);
      if (notification) notification.status = "read";
      else return next(new ErrorHandler("Notification not found", 500));

      await notification.save();

      const notifications = await notificationModel
        .find()
        .sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        message: "updated notification fetched successfully",
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

import { Response, Request, NextFunction } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import notificationModel from "../models/notification.model";
import nodeCron from "node-cron";

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

nodeCron.schedule("0 0 0 * * *", async () => {
  const thirtyDaysNotification = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  );
  await notificationModel.deleteMany({
    status: "read",
    createdAt: {
      $lt: thirtyDaysNotification,
    },
  });
  console.log("Deleted read notification");
});

import { Response, Request, NextFunction } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import { IOrder } from "../@types/order";
import userModel from "../models/user.model";
import courseModel from "../models/course.model";
import { newOrder } from "../services/order.service";
import notificationModel from "../models/notification.model";

//? Create Order
export const createOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info }: IOrder = req.body;

      const user = await userModel.findById(req.user?._id);
      const userCourseExist = user?.courses.find(
        (data: any) => data._id.toString() === courseId
      );

      if (userCourseExist)
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );

      const course = await courseModel.findById(courseId);
      if (!course)
        return next(
          new ErrorHandler("Sorry, this course is not available", 400)
        );

      const courseData = <any>{
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      const orderMailData = {
        order: {
          _id: course._id,
          courseName: course.name,
          courseDescription: course.description,
          price: course.price,
          date: new Date().toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/orderMail.ejs"),
        { order: orderMailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            templete: "orderMail.ejs",
            data: orderMailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user?.courses.push({ courseId: course?._id as string });

      course.purchased ? (course.purchased += 1) : course.purchased;

      await user?.save();

      //* Let the course owner know there is a purchase
      await notificationModel.create({
        userId: user?._id,
        title: "New order",
        message: `You have a new order from ${user?.name} for ${course.name} `,
      });

      newOrder(courseData, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

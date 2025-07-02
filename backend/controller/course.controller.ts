import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import courseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import notificationModel from "../models/notification.model";

//? Upload Course
export const uploadCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//? Edit courses
export const editCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const courseId = req.params.id;

      const course = await courseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        {
          new: true,
        }
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//? Get single courses --> anyone can access it
export const getSingleCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseData = await courseModel
        .findById(req.params.id)
        .select(
          "-courseData.videoUrl -courseData.videoPlayer -courseData.links -courseData.suggestion -courseData.question"
        );

      res.status(201).json({
        success: true,
        courseData,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//? Get all courses --> anyone can access it
export const getAllCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //! Redis cache to aviod server load
      const isRedisCached = await redis.get("allCourses");
      if (isRedisCached) {
        const courses = JSON.parse(isRedisCached);
        res.status(201).json({
          success: true,
          courses,
        });
      } else {
        const courseData = await courseModel
          .find()
          .select(
            "-courseData.videoUrl -courseData.videoPlayer -courseData.links -courseData.suggestion -courseData.question"
          );

        await redis.set("allCourses", JSON.stringify(courseData));

        res.status(201).json({
          success: true,
          courseData,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//? Get single course --> only to valid user/ purchased users
export const getUserCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourse = req.user?.courses;
      const courseId = req.params?.id;
      const userCourseExits = userCourse?.find(
        (course: any) => course.courseId.toString() === courseId
      );

      if (!userCourseExits)
        return next(
          new ErrorHandler(
            "You are not eligible to access this course. Kindly purchase it ",
            500
          )
        );

      //? if course exists then return course data
      const course = await courseModel.findById(courseId);
      const courseContent = course?.courseData;

      res.status(201).json({
        success: true,
        courseContent,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//? Add comments in a course
export const addComments = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, courseDataId }: IAddComments = req.body;
      const course = await courseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(courseDataId))
        return next(new ErrorHandler("Invalid course Id", 400));

      const courseData = course?.courseData?.find((data: any) =>
        data._id.equals(courseDataId)
      );
      if (!courseData) return next(new ErrorHandler("Invalid course Id", 400));

      //! Add our comment obj
      const newComment = <any>{
        user: req.user,
        comment,
        commentReplies: [],
      };

      //* add this to our course
      courseData.comment.push(newComment);

      await notificationModel.create({
        userId: req.user?._id,
        title: "New Comment",
        message: `You have a new comment from ${req.user?.name} for ${courseData?.title}`,
      });

      await course?.save();

      res.status(200).json({
        success: true,
        message: "Comment added successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//? Add comment replies in a course
export const addCommentReplies = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        commentReplie,
        courseId,
        courseDataId,
        commentId,
      }: IAddCommentReplies = req.body;
      const course = await courseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(courseDataId))
        return next(new ErrorHandler("Invalid course Id", 400));

      const courseData = course?.courseData?.find((data: any) =>
        data._id.equals(courseDataId)
      );
      if (!courseData) return next(new ErrorHandler("Invalid course Id", 400));

      //* get our comment
      const comment = courseData.comment.find((data: any) =>
        data._id.equals(commentId)
      );
      if (!comment) return next(new ErrorHandler("Invalid comment", 400));

      //! Add our comment reply obj
      const newCommentReply = <any>{
        user: req.user,
        commentReplie,
      };

      //* add this to our course
      comment?.commentReplies.push(newCommentReply);

      await course?.save();

      if (req.user?._id === comment.user._id) {
        await notificationModel.create({
          userId: req.user?._id,
          title: "New comment reply",
          message: `You have a new reply from ${req.user?.name} for ${courseData?.title} `,
        });
      } else {
        const data = {
          name: comment.user.name,
          title: courseData.title,
          originalComment: comment.comment,
          commentReplie: newCommentReply.commentReplie,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/commentReply.ejs"),
          data
        );

        try {
          await sendMail({
            email: comment.user.email,
            subject: "Comment Reply",
            templete: "commentReply.ejs",
            data: data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }
      res.status(200).json({
        success: true,
        message: "Comment added successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//? Add review in a course
export const addReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourses = req.user?.courses;
      const courseId = req.params.id;

      //* check if the courses is purchased by the user
      const userCourseExits = userCourses?.find(
        (data: any) => data._id.toString() === courseId.toString()
      );
      if (!userCourseExits)
        return next(new ErrorHandler("Kindly purchase the course first", 400));

      const course = await courseModel.findById(courseId);

      const { review, rating }: IAddReview = req.body;

      const reviewData: any = {
        user: req.user,
        rating,
        comment: review,
      };

      course?.reviews.push(reviewData);

      let avg = 0;
      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) course.rating = avg / course.reviews.length;

      await course?.save();

      const notification: any = {
        title: "New Review",
        message: `${req.user?.name} has given a review for your course ${course?.name}`,
      };

      //?Create notification
      await notificationModel.create({
        userId: req.user?._id,
        title: "New order",
        message: `You have a new order from ${req.user?.name} for ${course?.name} `,
      });

      res.status(200).json({
        success: true,
        message: "Review added successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//? Admin only review reply
export const adminReviewReply = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reviewReply, reviewId, courseId }: IAdminReviewReply = req.body;

      const course = await courseModel.findById(courseId);
      if (!course) return next(new ErrorHandler("No such course exits", 400));

      const review = course.reviews.find(
        (data: any) => data._id.toString() === reviewId
      );
      if (!review) return next(new ErrorHandler("No such review exits", 400));

      const replyData: any = {
        user: req.user,
        comment: reviewReply,
      };
      if (!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies.push(replyData);

      await course?.save();

      res.status(200).json({
        success: true,
        message: "Review added successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

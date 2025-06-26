import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import courseModel from "../models/course.model";
import { redis } from "../utils/redis";

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

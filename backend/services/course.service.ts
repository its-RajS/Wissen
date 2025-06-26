import { Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import courseModel from "../models/course.model";

export const createCourse = asyncHandler(async (data: any, res: Response) => {
  const course = await courseModel.create(data);
  return res.status(201).json({
    success: true,
    message: "Course created successfully",
    course,
  });
});

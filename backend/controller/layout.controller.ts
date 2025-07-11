import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { IBannerImg } from "../@types/layout";
import layoutModel from "../models/layout.model";

//? Create Layout
export const createLayout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isTypeExist = await layoutModel.findOne({ type });
      if (isTypeExist)
        return next(new ErrorHandler(`${type} already exist`, 400));

      if (type === "Banner") {
        const { img, title, subtitle } = req.body;
        //* upload img it to cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(img, {
          folder: "Layout",
        });
        const banner = {
          img: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subtitle,
        };

        await layoutModel.create({ type: "Banner", banner: banner });
      }
      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItem = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await layoutModel.create({ type: "FAQ", faq: faqItem });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categorieItem = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await layoutModel.create({
          type: "Categories",
          categories: categorieItem,
        });
      }

      res.status(201).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//? Edit Layout
export const editLayout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      if (type === "Banner") {
        const bannerData = <any>await layoutModel.findOne({ type: "Banner" });
        const { img, title, subtitle } = req.body;
        if (bannerData)
          await cloudinary.v2.uploader.destroy(bannerData?.img?.public_id);
        //* upload new img it to cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(img, {
          folder: "Layout",
        });
        const banner = {
          img: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subtitle,
        };

        await layoutModel.findByIdAndUpdate(bannerData?._id, { banner });
      }
      if (type === "FAQ") {
        const { faq } = req.body;
        const faqData = <any>await layoutModel.findOne({ type: "FAQ" });
        const faqItem = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await layoutModel.findByIdAndDelete(faqData?._id, {
          type: "FAQ",
          faq: faqItem,
        });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categorieData = <any>(
          await layoutModel.findOne({ type: "Categories" })
        );
        const categorieItem = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await layoutModel.findByIdAndDelete(categorieData?._id, {
          type: "Categories",
          faq: categorieItem,
        });
      }

      res.status(201).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//? Get Layout
export const getLayout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const layout = await layoutModel.findOne({ type: req.body.type });
      if (!layout) return next(new ErrorHandler("Layout not found", 400));
      res.status(201).json({
        success: true,
        message: "Layout fetched successfully",
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

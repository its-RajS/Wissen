import { NextFunction, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import orderModel from "../models/order.model";

export const newOrder = asyncHandler(
  async (data: any, res: Response, next: NextFunction) => {
    const order = await orderModel.create(data);
    res.status(201).json({
      success: true,
      message: "Order successfully",
      order,
    });
  }
);

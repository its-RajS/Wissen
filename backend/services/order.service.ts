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

//? Get all orders
export const getAllOrderService = async (res: Response) => {
  const orders = await orderModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    orders,
  });
};

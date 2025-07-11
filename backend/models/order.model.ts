import mongoose, { Model, Schema } from "mongoose";
import { IOrder } from "../@types/order";

const orderSchema = new Schema<IOrder>(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

const orderModel: Model<IOrder> = mongoose.model("Order", orderSchema);

export default orderModel;

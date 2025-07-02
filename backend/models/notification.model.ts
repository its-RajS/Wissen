import mongoose, { Model, Schema } from "mongoose";
import { INotification } from "../@types/notification";

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "unread",
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const notificationModel: Model<INotification> = mongoose.model(
  "Notification",
  notificationSchema
);

export default notificationModel;

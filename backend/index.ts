import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";

//?config dotenv and port no.
dotenv.config();
const port = process.env.PORT || 8000;

//! configure the cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//? configure the db
connectDB();

//? Create the instance for the express
const app = express();

//? body parser
app.use(express.json({ limit: "50mb" }));

//? Cookie parser
app.use(cookieParser());

//! cors
const origin = process.env.ORIGIN;
app.use(
  cors({
    origin: origin,
    credentials: true,
  })
);

//! Router
app.use("/api/v1", userRouter, courseRouter, orderRouter, notificationRouter);

// ! unknown routes
// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   const err = Error(`Route ${req.originalUrl} not found 🔴🔴🔴`) as Error & {
//     statusCode?: number;
//   };
//   err.statusCode = 404;
//   next(err);
// });

//* Make our server listen
app.listen(port, () => console.log(`Server is running on this port:${port}`));

app.use(ErrorMiddleware);

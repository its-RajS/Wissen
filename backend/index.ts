import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db";

//?config dotenv and port no.
dotenv.config();
const port = process.env.PORT || 8000;

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
    origin: origin || "http://localhost:3000",
    credentials: true,
  })
);
//? Test api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API working 🟢🟢🟢",
  });
});

//! unknown routes
// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   const err = Error(`Route ${req.originalUrl} not found 🔴🔴🔴`) as Error & {
//     statusCode?: number;
//   };
//   err.statusCode = 404;
//   next(err);
// });

//* Make our server listen
app.listen(port, () => console.log(`Server is running on this port:${port}`));

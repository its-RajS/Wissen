import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "./asyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

export const isAuthenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken)
      return next(
        new ErrorHandler("Pleasr login to access this resource", 400)
      );

    const decode = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;
    if (!decode) return next(new ErrorHandler("Access token not valid", 400));

    const user = await redis.get(decode.id);
    if (!user) return next(new ErrorHandler("User not found", 400));

    req.user = JSON.parse(user);

    next();
  }
);

//? Validate user role
export const authoriedRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || ""))
      return next(
        new ErrorHandler(
          `Role ${req.user?.role} is not allowed to access this resource`,
          400
        )
      );
    next();
  };
};

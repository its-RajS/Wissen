import { IToken } from "../@types/auth";
import { IUser } from "../@types/model";
import { Response } from "express";
import dotenv from "dotenv";
import { redis } from "./redis";

dotenv.config();

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  //?tokens
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  //?Upload session to redis
  redis.set(user._id as string, JSON.stringify(user) as any);

  //?Parse env variable to integrate with fallback values
  const accessTokenExpire = parseInt(
    process.env.ACCESS_TOKEN_EXPIRE || "300",
    10
  );
  const refreshTokenExpire = parseInt(
    process.env.REFRESH_TOKEN_EXPIRE || "1200",
    10
  );

  //! Cookies
  const accessTokenCookie: IToken = {
    expires: new Date(Date.now() + accessTokenExpire * 1000),
    maxAge: accessTokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
  };
  const refreshTokenCookie: IToken = {
    expires: new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge: refreshTokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  //?secure only in production
  if (process.env.NODE_ENV === "production") accessTokenCookie.secure = true;

  res.cookie("access_token", accessToken, accessTokenCookie);
  res.cookie("refresh_token", refreshToken, refreshTokenCookie);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};

import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import {
  IActivationRequest,
  IActivationToken,
  IRegistrationBody,
} from "../types/user.types";
import { IUser } from "../types/model.types";
import { ILoginRequest } from "../types/auth.types";
import { sendToken } from "../utils/jwt";

dotenv.config();

//! New User
export const regHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const emailExists = await userModel.findOne({ email });
      if (emailExists)
        return next(new ErrorHandler("Email already exist", 400));

      const newUser: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = ActivationToken(newUser);

      const activationCode = activationToken.activateCode;

      const ejsData = { user: { name: newUser.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activationMail.ejs"),
        ejsData
      );

      try {
        await sendMail({
          email: newUser.email,
          subject: "Activate your account",
          templete: "activationMail.ejs",
          data: ejsData,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${newUser.email} to activate your account!`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//? Activation token
export const ActivationToken = (user: any): IActivationToken => {
  const activateCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    { user, activateCode },
    process.env.ACTIVATION_SECRET_KEY as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activateCode };
};

export const activateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activationToken, activationCode } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activateCode: string } = jwt.verify(
        activationToken,
        process.env.ACTIVATION_SECRET_KEY as string
      ) as { user: IUser; activateCode: string };

      console.log("🟢🟢Decoded user from token:", newUser);

      if (newUser.activateCode !== activationCode)
        return next(new ErrorHandler("Invalid activation code", 400));

      const { name, email, password } = newUser.user;

      const userExist = await userModel.findOne({ email });

      if (userExist) return next(new ErrorHandler("Email already exist", 400));

      await userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//? Login User
export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      if (!email || !password)
        return next(new ErrorHandler("Please enter email and password", 400));

      const user = await userModel.findOne({ email }).select("+password");
      if (!user) return next(new ErrorHandler("Invalid user", 400));

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch)
        return next(new ErrorHandler("Invalid password", 400));

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
export const logoutUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      res.status(201).json({
        success: true,
        message: "Logged Successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

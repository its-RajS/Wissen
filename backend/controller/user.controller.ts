import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

dotenv.config();

//?Types of registered user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

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

//? Tyoe for the activaion token
interface IActivationToken {
  token: string;
  activateCode: string;
}

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

//? Type for the activaion token
interface IActivationRequest {
  activationToken: string;
  activationCode: string;
}

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

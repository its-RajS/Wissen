import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import {
  IActivationRequest,
  IActivationToken,
  IRegistrationBody,
  IUpdateAvatar,
  IUpdatePassword,
  IUpdateUserInfo,
} from "../@types/user";
import { IUser } from "../@types/model";
import { ILoginRequest, ISocialAuth } from "../@types/auth";
import { accessTokenCookie, refreshTokenCookie, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getUserById } from "../services/user.service";
import cloudinary from "cloudinary";

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
      //?delete the cache from redis
      const userId = req.user?._id?.toString() || "";
      redis.del(userId);
      res.status(201).json({
        success: true,
        message: "Logged Successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateAccessToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;

      const decode = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const message = "Could not refresh token";
      if (!decode) return next(new ErrorHandler(message, 400));

      const session = await redis.get(decode.id as string);
      if (!session) return next(new ErrorHandler(message, 400));

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );

      req.user = user;

      res.cookie("access_token", accessToken, accessTokenCookie);
      res.cookie("refresh_token", refreshToken, refreshTokenCookie);

      res.status(201).json({
        success: true,
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//? Get user info
export const getUserInfo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id as string;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//? Social auth
export const socialAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuth;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateUserInfo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.body as IUpdateUserInfo;
      const userId = req.user?._id as string;

      const user = await userModel.findById(userId);

      if (email && user) {
        const emailExists = await userModel.findOne({ email });
        if (emailExists)
          return next(new ErrorHandler("Email already exists", 400));

        user.email = email;
      }

      if (name && user) {
        user.name = name;
      }

      await user?.save();
      await redis.set(userId, JSON.stringify(user));

      res.status(201).json({
        success: true,
        message: "Info updated successfully🟢",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateUserPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword)
        return next(
          new ErrorHandler("Please enter old and new password ", 400)
        );

      const user = await userModel.findById(req.user?._id).select("+password");
      //?for social auth edge case
      if (user?.password === undefined)
        return next(new ErrorHandler("Invalid user", 400));

      const isPasswordMatch = await user.comparePassword(oldPassword);
      if (!isPasswordMatch)
        return next(new ErrorHandler("Invalid old password ", 400));

      user.password = newPassword;

      await user.save();

      await redis.set(req.user?._id as string, JSON.stringify(user));

      res.status(201).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateUserAvatar = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateAvatar;

      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      if (avatar && user) {
        //* avatar exist then delete the old one and update it with new one
        if (user.avatar.public_id) {
          //? delete the avatar
          cloudinary.v2.uploader.destroy(user.avatar.public_id);

          //?Update the avatar
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.url,
          };
        } else {
          //?Update the avatar
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.url,
          };
        }
      }

      await user?.save();
      await redis.set(userId as string, JSON.stringify(user));

      res.status(201).json({
        success: true,
        message: "Avatar updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

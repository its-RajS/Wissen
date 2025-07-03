import { Response } from "express";
import { redis } from "../utils/redis";
import userModel from "../models/user.model";

//? Get user by id
export const getUserById = async (id: string, res: Response) => {
  const userByIdJson = await redis.get(id);

  if (userByIdJson) {
    const userById = JSON.parse(userByIdJson);
    res.status(201).json({
      success: true,
      userById,
    });
  }
};

//? Get all user
export const getAllUsers = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    users,
  });
};

//? Update User role
export const updateUserRoleService = async (
  id: string,
  role: string,
  res: Response
) => {
  const roleUpdate = await userModel.findByIdAndUpdate(
    id,
    { role },
    { new: true }
  );
  res.status(201).json({
    success: true,
    roleUpdate,
  });
};

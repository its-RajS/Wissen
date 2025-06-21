import { Response } from "express";
import { redis } from "../utils/redis";

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

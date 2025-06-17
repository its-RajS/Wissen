import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

const redisClient = () => {
  if (redisUrl) {
    console.log("Redis Connected 🟢🟢🟢");
    return redisUrl;
  }
  throw new Error("Redis failed to connect 🔴🔴🔴");
};

export const redis = new Redis(redisClient());

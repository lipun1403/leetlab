import { redisClient } from "./redis.js";

export const invalidateProblemCache = async () => {
  try {
    const keys = await redisClient.keys("all-problems-*");

    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log("🗑 Problem cache invalidated");
    }
  } catch (error) {
    console.error("Error invalidating cache", error);
  }
};
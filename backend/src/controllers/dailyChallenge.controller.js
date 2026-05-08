import { prisma } from "../libs/prisma.ts";
import { redisClient } from "../libs/redis.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDailyChallenge = asyncHandler( async (req, res) => {
    const cachedChallenge = await redisClient.get("daily_challenge");

    if (cachedChallenge) {
      return res.status(200).json(
        new ApiResponse(
          200,
          "Daily challenge fetched successfully",
          JSON.parse(cachedChallenge),
        )
      );
    }

    console.log("Generating new daily challenge");

    const problems = await prisma.problem.findMany();

    const randomProblem = problems[Math.floor(Math.random() * problems.length)];

    await redisClient.set("daily_challenge", JSON.stringify(randomProblem), {
      EX: 60 * 60 * 24, 
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        "Daily challenge fetched successfully",
        randomProblem,
      )
    );
});
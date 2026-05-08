
import { prisma } from "../libs/prisma.ts";
import {
  submitBatch,
  pollBatchResults,
  getJudge0LanguageId,
} from "../libs/judge0.lib.js";
import { redisClient } from "../libs/redis.js";
import { invalidateProblemCache } from "../libs/cache.utils.js";
import { getAllProblemsKey } from "../libs/cacheKeys.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createProblem = asyncHandler(async (req, res) => {
  // going to all data from req body - title, desc,etc
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  //going to checck user role again for admin
  if (req.user.role !== "ADMIN") {
    console.log("Role mismatch");
    throw new ApiError(403, "Only admins can create problems");
  }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      //taking language and solution code from refernce sol
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        console.log("Invalid language:", language);
        throw new ApiError(400, `Language ${language} not supported`);
      }
      //loop through each reference solution for different language

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          console.log(`Testcase ${i + 1} failed for language ${language}`);
          throw new ApiError(400, `Testcase ${i + 1} failed for language ${language}`);
        }
      }
    }
    const newProblem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    if (!newProblem) {
      console.log("Problem creation failed");
      throw new ApiError(500, "Error creating problem");
    }
    await invalidateProblemCache();

    return res.status(201).json(
      new ApiResponse(
        201,
        "Problem created successfully",
        newProblem,
      ),
    );

});

export const getAllProblems = asyncHandler(async (req, res) => {
  const start = Date.now();

    const cacheKey = getAllProblemsKey(req.user.id);
    let cachedProblems = null;

    try {
      cachedProblems = await redisClient.get(cacheKey);
    } catch (err) {
      console.log("Redis read failed:", err.message);
    }

    if (cachedProblems) {
      console.log(
        `Retrieved cached problem storage in ${Date.now() - start} ms`,
      );
      return res.status(200).json({
        success: true,
        source: "redis",
        problems: JSON.parse(cachedProblems),
        responseTime: `${Date.now() - start} ms`,
      });
    }

    console.log("Redis MISS → fetching from database....");

    const problems = await prisma.problem.findMany({
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    if (!problems) {
      return res.status(404).json(
        new ApiError(404, "No problems found")
      );
    }

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(problems));

    console.log(`Request time for getting problems: ${Date.now() - start} ms`);

    return res.status(200).json(
      new ApiResponse(
        200,
        "Problems fetched successfully",
        problems,
      ),
    );
  
});

export const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

    const problem = await prisma.problem.findUnique({
      where: {
        id,
      },
    });
    
    if (!problem) {
      console.log("Problem not found");
      throw new ApiError(404, "Problem not found");
    }

    console.log("Problem fetched successfully");
    return res.status(201).json(
      new ApiResponse(
        201,
        problem,
        "Problem fetched successfully",
      ),
    );
  
});

export const updateProblem = asyncHandler(async (req, res) => {
  //id nikalo

  const { id } = req.params;

  const {
    title,
    description,
    difficulty,
    tags,
    companyTags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  const problem = await prisma.problem.findUnique({
    where: {
      id,
    },
  });

  if (!problem) {
    return res.status(404).json(
      new ApiError(404, "No problem found for updation")
    );
  }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      //taking language and solution code from refernce sol
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return req.status(403).json(
          new ApiError(403, "Invalid language")
        );
      }
      //loop through each reference solution for different language

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res.status(400).json(
            new ApiError(400, `Testcase ${i + 1} failed for language ${language}`)
          );
        }
      }
    }

    const updatedProblem = await prisma.problem.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        difficulty,
        tags,
        companyTags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    await invalidateProblemCache();

    return res.status(200).json(
      new ApiResponse(
        200,
        "Problem updated successfully",
        updatedProblem,
      )
    );

});

export const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

    const deletedProblem = await prisma.problem.delete({
      where: {
        id,
      },
    });
    await invalidateProblemCache();

    return res.status(200).json(
      new ApiResponse(
        200,
        "Problem deleted successfully",
        deletedProblem,
      )
    );
});

export const getSolvedProblemsSolveprismayUser = asyncHandler(async (req, res) => {
    const problems = await prisma.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });
    console.log("Solved problems fetched successfully");
    console.log("problems: ", problems);
    return res.status(200).json(
      new ApiResponse(
        200,
        problems,
        "Problems fetched successfully",
      )
    );
  
});

export const addtoCompanyTags = asyncHandler(async (req, res) => {
    const { problemsids, companyTags } = req.body;

    if (problemsids == undefined || companyTags == undefined) {
      return res.status(500).json(
        new ApiError(500, "no data found")
      );
    }
    if (problemsids !== undefined && companyTags !== undefined) {
      problemsids.forEach(async (id) => {
        const problem = await prisma.problem.findUnique({
          where: {
            id,
          },
        });
        const updatedProblem = await prisma.problem.update({
          where: {
            id: problem.id,
          },
          data: {
            companyTags: [...problem.companyTags, ...companyTags],
          },
        });
      });
      await invalidateProblemCache();
      return res.status(200).json(
        new ApiResponse(
          200,
          "Company tags added successfully",
          null,
        )
      );
    }
  
});
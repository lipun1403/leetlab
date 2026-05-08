// import asyncHandler from "../utils/asyncHandler.js";
// import { prisma } from "../lib/prisma.ts"
// import { ApiError } from "../utils/apiError.js";
// import { getJudge0LangId, pollBatchResults, submitBatch } from "../lib/judge0.lib.js";
// import { ApiResponse } from "../utils/apiResponse.js";

// const createProblem = asyncHandler(async (req, res) => {
//     const { 
//         title, 
//         description, 
//         difficulty, 
//         tags, 
//         examples, 
//         constraints, 
//         testcases, 
//         codeSnippets, 
//         referenceSolution 
//     } = req.body

//     // if(!title || !description || !difficulty || !tags || !examples || !constraints || !testcases || !codeSnippets || !referenceSolution) {
//     //     throw new ApiError(400, "Every field is mandatory")
//     // }

    

//     for (const [language, solutionCode] of Object.entries(referenceSolution)) {
//     // for (const obj of referenceSolution) {
//         // const language = Object.keys(obj)[0];
//         // const solutionCode = obj[language];

//         const languageId = getJudge0LangId(language);

//         console.log("Language:", language, "ID:", languageId);

//         if(!languageId) {
//             throw new ApiError(400, "Invalid language selection")
//         }

//         const submissions = testcases.map(({input, output}) => ({
//             source_code: solutionCode,
//             language_id: languageId,
//             stdin: input,
//             expected_output: output
//         }))

//         const submissionResult = await submitBatch(submissions)

//         const tokens = submissionResult.map((res) => res.token) 

//         const results = await pollBatchResults(tokens)

//         if (!results || results.length !== tokens.length) {
//             console.log("Tokens:", tokens);
//             console.log("Results:", results);

//             throw new ApiError(
//                 500,
//                 `Judge0 returned incomplete results for ${language}`
//             );
//         }
        
//         for(let i=0;i<results.length;i++) {
//             console.log(results[i]);
//             if(results[i].status.id !== 3) {
//                 console.log("Failed testcase:",testcases[i]);
                
//                 throw new ApiError(
//                     400, 
//                     `Language ${language} failed on testcase ${i+1}: ${results[i].status.description}`
//                 )
//             }
//         }
//     }

//     const newProblem = await prisma.problem.create({
//         data: {
//             title,
//             description,
//             difficulty,
//             tags,
//             examples,
//             constraints,
//             createprismay: req.user.id,
//             testcases,
//             codeSnippets,
//             referenceSolution
//         }
//     })

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 newProblem,
//                 "Problem created successfully!!"
//             )
//         )
// })

// const updateProblem = asyncHandler(async (req, res) => {
//     const { problemId } = req.params;

//     if (!problemId) {
//         throw new ApiError(400, "Invalid problem");
//     }

//     if (Object.keys(req.body).length === 0) {
//         throw new ApiError(400, "No data provided for update");
//     }

//     const allowedFields = [
//         "title",
//         "description",
//         "difficulty",
//         "tags",
//         "examples",
//         "constraints",
//         "testcases",
//         "codeSnippets",
//         "referenceSolution"
//     ];

//     const updateData = {};

//     for (const key of allowedFields) {
//         if (req.body[key] !== undefined) {
//             updateData[key] = req.body[key];
//         }
//     }

//     if (updateData.referenceSolution && updateData.testcases) {

//         for (const obj of updateData.referenceSolution) {
//             const language = Object.keys(obj)[0];
//             const solutionCode = obj[language];

//             const languageId = getJudge0LangId(language);

//             console.log("Language:", language, "ID:", languageId);

//             if (!languageId) {
//                 throw new ApiError(400, `Invalid language: ${language}`);
//             }

//             const submissions = updateData.testcases.map(({ input, output }) => ({
//                 source_code: solutionCode,
//                 language_id: languageId,
//                 stdin: input,
//                 expected_output: output
//             }));

//             const submissionResult = await submitBatch(submissions);
//             const tokens = submissionResult.map(res => res.token);
//             const results = await pollBatchResults(tokens);

//             for (let i = 0; i < results.length; i++) {
//                 if (results[i].status.id !== 3) {
//                     throw new ApiError(
//                         422,
//                         `Language ${language} failed on testcase ${i + 1}: ${results[i].status.description}`
//                     );
//                 }
//             }
//         }
//     }

//     const updatedProblem = await prisma.problem.update({
//         where: { id: problemId },
//         data: updateData,
//         select: {
//             title: true,
//             description: true,
//             difficulty: true,
//             tags: true
//         }
//     });

//     return res.status(200).json(
//         new ApiResponse(
//             200,
//             updatedProblem,
//             "Problem updated successfully"
//         )
//     );
// });

// const getAllProblem = asyncHandler(async (req, res) => {
//     const problems = await prisma.problem.findMany({
//         select: {
//             id: true,
//             title: true,
//             difficulty: true,
//             tags: true
//         }
//     })

//     if(problems.length === 0) {
//         throw new ApiError(
//             400,
//             "Cannot fetch problems"
//         )
//     }
    
//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 problems,
//                 "Problems fetched successfully"
//             )
//         )
// })

// const getProblemById = asyncHandler(async (req, res) => {
//     const { problemId } = req.params

//     console.log("Problem Id: ", problemId)

//     if(!problemId) {
//         throw new ApiError(
//             400,
//             "Invalid problem Id!"
//         )
//     }

//     const problem = await prisma.problem.findUnique({
//         where: {
//             id: problemId
//         },
//         select: {
//             title: true,
//             description: true,
//             difficulty: true,
//             tags: true,
//             examples: true,
//             testcases:true,
//             constraints: true,
//             hints: true,
//             codeSnippets: true,
//             createdAt: true
//         }
//     })

//     if(!problem) {
//         throw new ApiError(
//             401,
//             "Cannot fetch the problem"
//         )
//     }

//     console.log("Problem fetched!");
    
//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 problem,
//                 "Problem fetched successfully",
//             )
//         )
// })

// const deleteProblem = asyncHandler(async (req, res) => {
//     const { problemId } = req.params

//     if(!problemId) {
//         throw new ApiError(
//             400,
//             "Invalid problem"
//         )
//     }

//     const problem = await prisma.problem.findUnique({
//         where: {
//             id: problemId
//         },
//         select: {
//             title: true,
//             description: true,
//             difficulty: true,
//             tags: true,
//             createprismay: true
//         }
//     })

//     if(!problem) {
//         throw new ApiError(
//             400,
//             "Can't delete the problem"
//         )
//     }

//     await prisma.problem.delete({
//         where: {
//             id: problemId
//         }
//     })

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 problem,
//                 "Problem deleted successfully!",
//             )
//         )
// })

// const getAllSolvedProblem = asyncHandler(async (req, res) => {
//     const userId = req.user.id

//     if(!userId) {
//         throw new ApiError(
//             400,
//             "Invalid user!"
//         )
//     }

//     const result = await prisma.problemSolved.findMany({
//         where: {
//             userId
//         },
//         orderBy: {
//             createdAt: "desc"
//         },
//         select: {
//             problemId: true,
//             problem: {
//                 select: {
//                     title: true,
//                     difficulty: true,
//                     tags: true
//                 }
//             }
//         }
//     })

//     const solvedProblems = result.map((r) => ({
//         problemId: r.problemId,
//         title: r.problem.title,
//         difficulty: r.problem.difficulty,
//         tags: r.problem.tags
//     }))

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 solvedProblems,
//                 "Solved problems fetched successfully!",
//             )
//         )
// })

// export {
//     createProblem,
//     updateProblem,
//     getAllProblem,
//     getProblemById,
//     deleteProblem,
//     getAllSolvedProblem
// }



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
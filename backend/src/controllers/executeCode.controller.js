// import { getJudge0LangName, pollBatchResults, submitBatch } from "../lib/judge0.lib.js";
// import { ApiError } from "../utils/apiError.js";
// import { ApiResponse } from "../utils/apiResponse.js";
// import { prisma } from "../lib/prisma.ts"
// import asyncHandler from "../utils/asyncHandler.js";

// const run = asyncHandler(async (req, res) => {
//     console.log("Body: ", req.body);

//     const { stdin, languageId, sourceCode } = req.body
    

//     if( !Array.isArray(stdin) || stdin.length === 0) {
//         throw new ApiError(
//             400,
//             "Invalid or missing testcases!"
//         )
//     }

//     const submissions = stdin.map((input) => ({
//         source_code: sourceCode,
//         language_id: languageId,
//         stdin: input
//     }))

//     const submitResponse = await submitBatch(submissions)

//     const tokens = submitResponse.map((res) => res.token);

//     const results = await pollBatchResults(tokens)

//     console.log("Result: ", results)

//     const finalResult = results.map((result, i) => {
//         const stdout = result.stdout?.trim()

//         return {
//             testCase: i+1,
//             stdout,
//             stderr: result.stderr || null,
//             compiledOutput: result.compile_output || null,
//             status: result.status.description,
//             memory: result.memory ? `${result.memory} KB` : undefined,
//             time: result.time? `${result.time} s` : undefined
//         }
//     })

//     console.log("Final result: ", finalResult);

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 finalResult,
//                 "Executed successfully",
//             )
//         )
// })

// const submit = asyncHandler(async (req, res) => {
//     console.log("Body: ", req.body);

//     const { stdin, expectedOutput, languageId, problemId, sourceCode } = req.body
    
//     const userId = req.user.id

//     if( !Array.isArray(stdin) || stdin.length === 0 || !Array.isArray(expectedOutput) || expectedOutput.length !== stdin.length ) {
//         throw new ApiError(
//             400,
//             "Invalid or missing testcases!"
//         )
//     }

//     const submissions = stdin.map((input) => ({
//         source_code: sourceCode,
//         language_id: languageId,
//         stdin: input
//     }))

//     const submitResponse = await submitBatch(submissions)

//     const tokens = submitResponse.map((res) => res.token);

//     const results = await pollBatchResults(tokens)

//     console.log("Result: ", results)

//     let allPassed = true;
//     const finalResult = results.map((result, i) => {
//         const stdout = result.stdout?.trim()

//         const expected = expectedOutput[i]?.trim()
//         const passed = stdout===expected

//         if(!passed) allPassed = false

//         return {
//             testCase: i+1,
//             passed,
//             stdout,
//             expected,
//             stderr: result.stderr || null,
//             compiledOutput: result.compile_output || null,
//             status: result.status.description,
//             memory: result.memory ? `${result.memory} KB` : undefined,
//             time: result.time? `${result.time} s` : undefined
//         }
//     })

//     console.log("Final result: ", finalResult);
    
//     const submission = await prisma.submission.create({
//         data: {
//             userId,
//             problemId,
//             sourceCode,
//             language: getJudge0LangName(languageId),
//             stdin: stdin.join("\n"),
//             stdout: JSON.stringify(finalResult.map((r) => r.stdout)),
//             stderr: finalResult.some((r) => r.stderr)? JSON.stringify(finalResult.map((r) => r.stderr)) : null,
//             compileOutput: finalResult.some((r) => r.compiledOutput)? JSON.stringify(finalResult.map((r) => r.compiledOutput)) : null,
//             status: allPassed ? "Accepted" : "Wrong Answer",
//             memory: finalResult.some((r) => r.memory)? JSON.stringify(finalResult.map((r) => r.memory)) : null,
//             time: finalResult.some((r) => r.time)? JSON.stringify(finalResult.map((r) => r.time)) : null
//         }
//     })

//     if(allPassed) {
//         await prisma.problemSolved.upsert({  // upsert: if not exists create else update
//             where: {
//                 userId_problemId: {
//                     userId, problemId
//                 }
//             },
//             update: {},
//             create: {
//                 userId, problemId
//             }
//         })
//     }

//     const testCaseResult = finalResult.map((result) => ({
//         submissionId: submission.id,
//         testCase: result.testCase,
//         passed: result.passed,
//         stdout: result.stdout,
//         expected: result.expected,
//         stderr: result.stderr,
//         compiledOutput: result.compileOutput,
//         status: result.status,
//         memory: result.memory,
//         time: result.time
//     }))

//     await prisma.testCaseResult.createMany({
//         data: testCaseResult
//     })
    
//     const submissionWithTestcase = await prisma.submission.findUnique({
//         where: {
//             id: submission.id
//         },
//         include: {
//             testCases: true
//         }
//     })

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 submissionWithTestcase,
//                 "Executed successfully",
//             )
//         )
// })

// export {
//     run,
//     submit
// }



import { prisma } from "../libs/prisma.ts";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;

    // Validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or Missing test cases" });
    }

    // Reset detailedResults before executing new code
    const detailedResults = [];

    // Prepare each test case for Judge0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // Send batch of submissions to Judge0
    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((res) => res.token);

    // Poll Judge0 for results of all submitted test cases
    const results = await pollBatchResults(tokens);

    // Analyze test case results
    let allPassed = true;
    results.forEach((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      if (!passed) allPassed = false;

      detailedResults.push({
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
      });
    });

    res.status(200).json({
      success: true,
      message: "Code Executed Successfully!",
      detailedResults,
    });
  } catch (error) {
    console.error("Error executing code:", error.message);
    res.status(500).json({ error: "Failed to execute code" });
  }
};

export const submitCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;
    const userId = req.user.id;

    // Validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or Missing test cases" });
    }

    // Reset detailedResults before submitting new code
    const detailedResults = [];

    // Prepare each test case for Judge0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // Send batch of submissions to Judge0
    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((res) => res.token);

    // Poll Judge0 for results of all submitted test cases
    const results = await pollBatchResults(tokens);

    // Analyze test case results
    let allPassed = true;
    results.forEach((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      if (!passed) allPassed = false;

      detailedResults.push({
        testCase: i + 1,
        stdin: result.stdin?.trim(),
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      });
    });

    // Store submission summary
    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });

    // If all test cases passed, mark problem as solved for the user
    if (allPassed) {
      await prisma.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    // Save individual test case results using detailedResults
    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await prisma.testCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCase = await prisma.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Code Submitted Successfully!",
      submission: submissionWithTestCase,
    });
  } catch (error) {
    console.error("Error submitting code:", error.message);
    res.status(500).json({ error: "Failed to submit code" });
  }
};
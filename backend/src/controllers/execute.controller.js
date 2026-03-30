import { getJudge0LangName, pollBatchResults, submitBatch } from "../lib/judge0.lib.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { prisma } from "../lib/prisma.ts"
import asyncHandler from "../utils/asyncHandler.js";

const run = asyncHandler((req, res) => {
    const { stdin, expectedOutput, languageId, problemId, sourceCode } = req.body()

    const userId = req.user.id


})

const submit = asyncHandler(async (req, res) => {
    console.log("Body: ", req.body);

    const { stdin, expectedOutput, languageId, problemId, sourceCode } = req.body
    
    const userId = req.user.id

    if( !Array.isArray(stdin) || stdin.length === 0 || !Array.isArray(expectedOutput) || expectedOutput.length !== stdin.length ) {
        throw new ApiError(
            400,
            "Invalid or missing testcases!"
        )
    }

    const submissions = stdin.map((input) => ({
        source_code: sourceCode,
        language_id: languageId,
        stdin: input
    }))

    const submitResponse = await submitBatch(submissions)

    const tokens = submitResponse.map((res) => res.token);

    const results = await pollBatchResults(tokens)

    console.log("Result: ", results)

    let allPassed = true;
    const finalResult = results.map((result, i) => {
        const stdout = result.stdout?.trim()

        const expected = expectedOutput[i]?.trim()
        const passed = stdout===expected

        if(!passed) allPassed = false

        return {
            testCase: i+1,
            passed,
            stdout,
            expected,
            stderr: result.stderr || null,
            compiledOutput: result.compile_output || null,
            status: result.status.description,
            memory: result.memory ? `${result.memory} KB` : undefined,
            time: result.time? `${result.time} s` : undefined
        }
    })

    console.log("Final result: ", finalResult);
    
    const submission = await prisma.submission.create({
        data: {
            userId,
            problemId,
            sourceCode,
            language: getJudge0LangName(languageId),
            stdin: stdin.join("\n"),
            stdout: JSON.stringify(finalResult.map((r) => r.stdout)),
            stderr: finalResult.some((r) => r.stderr)? JSON.stringify(finalResult.map((r) => r.stderr)) : null,
            compileOutput: finalResult.some((r) => r.compiledOutput)? JSON.stringify(finalResult.map((r) => r.compiledOutput)) : null,
            status: allPassed ? "Accepted" : "Wrong Answer",
            memory: finalResult.some((r) => r.memory)? JSON.stringify(finalResult.map((r) => r.memory)) : null,
            time: finalResult.some((r) => r.time)? JSON.stringify(finalResult.map((r) => r.time)) : null
        }
    })

    if(allPassed) {
        await prisma.problemSolved.upsert({  // upsert: if not exists create else update
            where: {
                userId_problemId: {
                    userId, problemId
                }
            },
            update: {},
            create: {
                userId, problemId
            }
        })
    }

    const testCaseResult = finalResult.map((result) => ({
        submissionId: submission.id,
        testCase: result.testCase,
        passed: result.passed,
        stdout: result.stdout,
        expected: result.expected,
        stderr: result.stderr,
        compiledOutput: result.compileOutput,
        status: result.status,
        memory: result.memory,
        time: result.time
    }))

    await prisma.testCaseResult.createMany({
        data: testCaseResult
    })
    
    const submissionWithTestcase = await prisma.submission.findUnique({
        where: {
            id: submission.id
        },
        include: {
            testCases: true
        }
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Executed successfully",
                submissionWithTestcase
            )
        )
})

export {
    run,
    submit
}

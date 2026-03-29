import { pollBatchResults, submitBatch } from "../lib/judge0.lib.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
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

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Executed successfully"
            )
        )
})

export {
    run,
    submit
}

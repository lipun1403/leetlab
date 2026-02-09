import asyncHandler from "../utils/asyncHandler.js";
import { prisma } from "../lib/prisma.ts"
import { ApiError } from "../utils/apiError.js";
import { stdin } from "node:process";
import { getJudge0LangId, pollBatchResults, submitBatch } from "../lib/judge0.lib.js";
import { ApiResponse } from "../utils/apiResponse.js";

const createProblem = asyncHandler(async (req, res) => {
    const { 
        title, 
        description, 
        difficulty, 
        tags, 
        examples, 
        constraints, 
        testcases, 
        codeSnippets, 
        referenceSolution 
    } = req.body

    if(!title || !description || !difficulty || !tags || !examples || !constraints || !testcases || !codeSnippets || !referenceSolution) {
        throw new ApiError(400, "Every field is mandatory")
    }

    for(const [lang, solutionCode] of Object.entries(referenceSolution)) {
        const languageId = getJudge0LangId(lang)

        if(!languageId) {
            throw new ApiError(400, "Invalid language selection")
        }

        const submissions = testcases.map(({input, output}) => ({
            source_code: solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output
        }))

        const submissionResult = await submitBatch(submissions)

        const tokens = submissionResult.map((res) => res.token) 

        const results = await pollBatchResults(tokens)

        for(let i=0;i<results.length;i++) {
            if(results[i].status.id !== 3) {
                throw new ApiError(
                    400, 
                    `Language ${lang} failed on testcase ${i+1}: ${results[i].status.description}`
                )
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
            createdBy: req.user.id,
            testcases,
            codeSnippets,
            referenceSolution
        }
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newProblem,
                "Problem created successfully!!"
            )
        )
})

const updateProblem = asyncHandler(async (req, res) => {

})

const getAllProblem = asyncHandler(async (req, res) => {

})

const getProblemById = asyncHandler(async (req, res) => {

})

const deleteProblem = asyncHandler(async (req, res) => {

})

const getAllSolvedProblem = asyncHandler(async (req, res) => {

})

export {
    createProblem,
    updateProblem,
    getAllProblem,
    getProblemById,
    deleteProblem,
    getAllSolvedProblem
}
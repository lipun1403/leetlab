import asyncHandler from "../utils/asyncHandler.js";
import { prisma } from "../lib/prisma.ts"
import { ApiError } from "../utils/apiError.js";
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

    

    // for (const [language, solutionCode] of Object.entries(referenceSolution)) {
    for (const obj of referenceSolution) {
        const language = Object.keys(obj)[0];
        const solutionCode = obj[language];

        const languageId = getJudge0LangId(language);

        console.log("Language:", language, "ID:", languageId);

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
            console.log(results[i]);
            if(results[i].status.id !== 3) {
                throw new ApiError(
                    400, 
                    `Language ${language} failed on testcase ${i+1}: ${results[i].status.description}`
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
    const { problemId } = req.params;

    if (!problemId) {
        throw new ApiError(400, "Invalid problem");
    }

    if (Object.keys(req.body).length === 0) {
        throw new ApiError(400, "No data provided for update");
    }

    const allowedFields = [
        "title",
        "description",
        "difficulty",
        "tags",
        "examples",
        "constraints",
        "testcases",
        "codeSnippets",
        "referenceSolution"
    ];

    const updateData = {};

    for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
            updateData[key] = req.body[key];
        }
    }

    if (updateData.referenceSolution && updateData.testcases) {

        for (const obj of updateData.referenceSolution) {
            const language = Object.keys(obj)[0];
            const solutionCode = obj[language];

            const languageId = getJudge0LangId(language);

            console.log("Language:", language, "ID:", languageId);

            if (!languageId) {
                throw new ApiError(400, `Invalid language: ${language}`);
            }

            const submissions = updateData.testcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output
            }));

            const submissionResult = await submitBatch(submissions);
            const tokens = submissionResult.map(res => res.token);
            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.length; i++) {
                if (results[i].status.id !== 3) {
                    throw new ApiError(
                        422,
                        `Language ${language} failed on testcase ${i + 1}: ${results[i].status.description}`
                    );
                }
            }
        }
    }

    const updatedProblem = await prisma.problem.update({
        where: { id: problemId },
        data: updateData,
        select: {
            title: true,
            description: true,
            difficulty: true,
            tags: true
        }
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Problem updated successfully",
            updatedProblem
        )
    );
});

const getAllProblem = asyncHandler(async (req, res) => {
    const problems = await prisma.problem.findMany({
        select: {
            title: true,
            difficulty: true,
            tags: true
        }
    })

    if(problems.length === 0) {
        throw new ApiError(
            400,
            "Cannot fetch thye problems"
        )
    }

    console.log("All problems fetched successfully!");
    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Problems fetched successfully",
                problems
            )
        )
})

const getProblemById = asyncHandler(async (req, res) => {
    const { problemId } = req.params

    console.log("Problem Id: ", problemId)

    if(!problemId) {
        throw new ApiError(
            400,
            "Invalid problem Id!"
        )
    }

    const problem = await prisma.problem.findUnique({
        where: {
            id: problemId
        },
        select: {
            title: true,
            description: true,
            difficulty: true,
            tags: true,
            examples: true,
            constraints: true,
            hints: true,
            codeSnippets: true
        }
    })

    if(!problem) {
        throw new ApiError(
            401,
            "Cannot fetch the problem"
        )
    }

    console.log("Problem fetched!");
    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Problem fetched successfully",
                problem
            )
        )
})

const deleteProblem = asyncHandler(async (req, res) => {
    const { problemId } = req.params

    if(!problemId) {
        throw new ApiError(
            400,
            "Invalid problem"
        )
    }

    const problem = await prisma.problem.findUnique({
        where: {
            id: problemId
        },
        select: {
            title: true,
            description: true,
            difficulty: true,
            tags: true,
            createdBy: true
        }
    })

    if(!problem) {
        throw new ApiError(
            400,
            "Can't delete the problem"
        )
    }

    await prisma.problem.delete({
        where: {
            id: problemId
        }
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Problem deleted successfully!",
                problem
            )
        )
})

const getAllSolvedProblem = asyncHandler(async (req, res) => {
    const userId = req.user.id

    if(!userId) {
        throw new ApiError(
            400,
            "Invalid user!"
        )
    }

    const result = await prisma.problemSolved.findMany({
        where: {
            userId
        },
        select: {
            problem: {
                select: {
                    title: true,
                    difficulty: true,
                    tags: true
                }
             }
        }
    })

    if(!result) {
        throw new ApiError(
            400,
            "Cannot fetch the solved problems!"
        )
    }

    const solvedProblems = result.map((prob) => prob.problem)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Solved problems fetched successfully!",
                solvedProblems
            )
        )
})

export {
    createProblem,
    updateProblem,
    getAllProblem,
    getProblemById,
    deleteProblem,
    getAllSolvedProblem
}
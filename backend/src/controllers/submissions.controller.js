import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { prisma } from "../lib/prisma.ts"
import { ApiResponse } from "../utils/apiResponse.js";

const getAllSubmissions = asyncHandler( async(req, res) => {
    const userId = req.user.id

    if(!userId) {
        throw new ApiError (
            400,
            "Can't fetch all the submissions"
        )
    }

    const result = await prisma.submission.findMany({
        where: {
            userId
        },
        select: {
            problem: {
                select: {
                    title: true
                }
            },
            problemId: true,
            language: true,
            status: true,
            memory: true,
            time: true
        }
    })

    if(!result) {
        throw new ApiError(
            400,
            "Error fetching the submissions"
        )
    }

    // const allSubmissions = result.map((r) => r.problem)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "All submissions fethced successfully",
                result
            )
        )
})

const getSubmissionsForProblem = asyncHandler( async(req, res) => {
    const { problemId } = req.params

    if(!problemId) {
        throw new ApiError(
            400,
            "Invalid problem!"
        )
    }

    const result = await prisma.submission.findMany({
        where: {
            problemId
        },
        select: {
            language: true,
            status: true,
            memory: true,
            time: true,
            updatedAt: true
        }
    })

    if(!result) {
        throw new ApiError(
            400,
            "Can't perform the task now, please try again later!"
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "All submissions for the problem is fetched",
                result
            )
        )
})

const getSubmissionCount = asyncHandler( async(req, res) => {
    const userId = req.user.id

    if(!userId) {
        throw new ApiError(
            400,
            "Invalid user"
        )
    }

    const result = await prisma.submission.count({
        where: {
            userId
        }
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Submission count fetched successfully",
                result
            )
        )
})

export {
    getAllSubmissions,
    getSubmissionsForProblem,
    getSubmissionCount
}
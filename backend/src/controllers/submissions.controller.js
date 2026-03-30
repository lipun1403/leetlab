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
    const userId = req.user.id

    if(!problemId) {
        throw new ApiError(
            400,
            "Invalid problem!"
        )
    }

    const result = await prisma.submission.findMany({
        where: {
            problemId,
            userId
        },
        select: {
            language: true,
            status: true,
            memory: true,
            time: true,
            updatedAt: true
        }
    })

    
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

const getSubmissionCountForProblem = asyncHandler( async(req, res) => {
    const userId = req.user.id

    if(!userId) {
        throw new ApiError(
            400,
            "Invalid user"
        )
    }

    const result = await prisma.submission.count({
        where: {
            problemId
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
    getSubmissionCountForProblem
}
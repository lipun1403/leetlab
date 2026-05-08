
import { prisma } from "../libs/prisma.ts";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

export const getAllSubmissionsforaUser= asyncHandler( async (req, res) => {
        const userId= req.user.id;
        
        const submissions = await prisma.submission.findMany({
            where:{
                userId:userId
            }
        })
       return res.status(200).json(
        new ApiResponse(
          200,
          "All submissions for the user fetched successfully",
          submissions,
        )
       )
    
})

export const getallSubmissionForProblembyUser  = asyncHandler( async (req, res) => {
        const userId = req.user.id;
        const problemId= req.params.problemId;
        const submissions = await prisma.submission.findMany({
          where: {
            userId: userId,
            problemId:problemId
          },
        });
         return res.status(200).json(
          new ApiResponse(
            200,
            "All submissions for a problem by user fetched successfully",
            submissions,
          )
         );
});

export const getTheSubmissionsCountForProblem = asyncHandler( async (req, res) => { 
        const problemId =req.params.problemId;
        const submissionsCount= await prisma.submission.count({
            where:{
                problemId
            }
        })
          res.status(200).json(
            new ApiResponse(
              200,
              "Submissions Count for a problem fetched successfully",
              submissionsCount,
            )
          );
});
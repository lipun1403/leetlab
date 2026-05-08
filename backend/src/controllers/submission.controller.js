// import { ApiError } from "../utils/apiError.js";
// import asyncHandler from "../utils/asyncHandler.js";
// import { prisma } from "../lib/prisma.ts"
// import { ApiResponse } from "../utils/apiResponse.js";

// const getAllSubmissions = asyncHandler( async(req, res) => {
//     const userId = req.user.id

//     if(!userId) {
//         throw new ApiError (
//             400,
//             "Can't fetch all the submissions"
//         )
//     }

//     const result = await prisma.submission.findMany({
//         where: {
//             userId
//         },
//         select: {
//             problem: {
//                 select: {
//                     title: true
//                 }
//             },
//             problemId: true,
//             language: true,
//             status: true,
//             memory: true,
//             time: true
//         }
//     })

    
//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 result,
//                 "All submissions fethced successfully",
//             )
//         )
// })

// const getSubmissionsForProblem = asyncHandler( async(req, res) => {
//     const { problemId } = req.params
//     const userId = req.user.id

//     if(!problemId) {
//         throw new ApiError(
//             400,
//             "Invalid problem!"
//         )
//     }

//     const result = await prisma.submission.findMany({
//         where: {
//             problemId,
//             userId
//         },
//         select: {
//             language: true,
//             status: true,
//             memory: true,
//             time: true,
//             updatedAt: true
//         }
//     })

    
//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 result,
//                 "All submissions for the problem is fetched",
//             )
//         )
// })

// const getSubmissionCountForProblem = asyncHandler( async(req, res) => {
//     const userId = req.user.id
//     const problemId = req.query.problemId

//     if(!userId) {
//         throw new ApiError(
//             400,
//             "Invalid user"
//         )
//     }

//     const result = await prisma.submission.count({
//         where: {
//             problemId
//         }
//     })

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 result,
//                 "Submission count fetched successfully",
//             )
//         )
// })

// export {
//     getAllSubmissions,
//     getSubmissionsForProblem,
//     getSubmissionCountForProblem
// }


import { prisma } from "../libs/prisma.ts";

export const getAllSubmissionsforaUser= async (req, res) => { //is userid ke sare submission nikalo leetlab se
    try {
        const userId= req.user.id;
        
        const submissions = await prisma.submission.findMany({
            where:{
                userId:userId
            }
        })
       return res.status(200).json({
            success:true,
            message:"All submissions by particular user fetched successfully!",
            submissions
        })
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            message : "Error while getting all submissions by our user"
        })
        
    }
    
}
export const getallSubmissionForProblembyUser  = async (req, res) => { //is user ke is problem ke sare submission nikalo - successful or failed
    try {
        const userId = req.user.id;
        const problemId= req.params.problemId;
        const submissions = await prisma.submission.findMany({
          where: {
            userId: userId,
            problemId:problemId
          },
        });
         return res.status(200).json({
            success: true,
            message: "all submissions for a problem by user fetched successfully!",
            submissions,
          });

        
    } catch (error) {
         return res.status(400).json({
           success: false,
           message: "Error while getting all submissions for problem for our user",
         });
        
    }
};

export const getTheSubmissionsCountForProblem = async (req, res) => { // get submissionCount for a problem  
    try {
        const problemId =req.params.problemId;
        const submissionsCount= await prisma.submission.count({
            where:{
                problemId
            }
        })
          res.status(200).json({
            success: true,
            message: "submission Count for a problem by user fetched successfully!",
            count : submissionsCount,
          });
        
        
    } catch (error) {
         return res.status(400).json({
           success: false,
           message: "Error while getting submissions Count of a user for a particular problem ",
         });
        
    }
};
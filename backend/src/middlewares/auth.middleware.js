import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.ts";
import { ApiError } from "../utils/apiError.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        if(!token) {
            throw new ApiError("Unauthorized access, token missing", 401);
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) 
        
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
            select: {
                id: true,
                image: true,
                username: true,
                role: true,
                email: true,
                createdAt: true
            }
        });

    
        if(!user) {
            throw new ApiError(401, "Unauthorized access, user not found");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized access, invalid token");
    }
})

const checkAdmin = asyncHandler(async (req, _, next) => {
    try {
        const userId = req.user?.id
        
        if(!userId) {
            throw new ApiError(401, "Invalid request")
        }
    
        const user = await prisma.user.findUnique({
            where: { 
                id: userId 
            },
            select: {
                role: true
            }
        })
    
        if(!user || user.role !== "ADMIN") {
            console.log("User is not admin");
            
            throw new ApiError(403, "Can't add the problem")
        }
    
        next()
    } catch (error) {
        console.log("Invalid role!!");
        throw new ApiError(403, "Error checking user role!")
    }
})

export { 
    verifyJWT, 
    checkAdmin 
}
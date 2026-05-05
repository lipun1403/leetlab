import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.ts"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import asyncHandler from "../utils/asyncHandler.js"
import ms from "ms" // to convert human readable time stamps to machine understandable ms 
import { DEFAULT_IMAGE } from "../constants.js"

const cookieOptions = {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV !== "development"
            }

const generateRefreshToken = async function(id) {
    return jwt.sign(
        {
            id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: ms(process.env.REFRESH_TOKEN_EXPIRY)
        }
    )
}

const generateAccessToken = async function (id) {
    return jwt.sign(
        {
            id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: ms(process.env.ACCESS_TOKEN_EXPIRY)
        }
    )
}

const isPasswordCorrect = async function(password, DBpassword) {
    return await bcrypt.compare(password, DBpassword)
}

const register = asyncHandler( async(req, res) => {

    const { username, email, password, role } = req.body
    
    console.log("username: ", username);
    

    if(!username || !email || !password) {
        throw new ApiError(
            400,
            "every field is mandatory!"
        )
    }
    
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    
    if(existingUser) {
        throw new ApiError(
            400,
            "User already exists"
        )
    }
    
    const avatarUrl = req.file
    ? (await uploadOnCloudinary(req.file.path))?.secure_url
    : DEFAULT_IMAGE;

    if(!avatarUrl) throw new ApiError(400, "error uploading the avatar")

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            image: avatarUrl,
            role: role || "USER"
        }
    })

    if(!user) {
        throw new ApiError(400, "User not created")
    }

    const createdUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            username: true,
            email: true,
            image: true,
            role: true,
            createdAt: true
        }
    })


    if(!createdUser) {
        throw new ApiError(400, "Error registering the user! Please try again later")
    }

    const token = await generateRefreshToken(user.id)

    res.cookie(
        "refreshToken",
        token,
        {
            ...cookieOptions,
            maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY)
        }
    )

    user.refreshToken = token

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: token }
    });


    return res.status(201).json(
        new ApiResponse (
            201,
            createdUser,
            "User registered successfully!",
        )
    )

})

const login = asyncHandler( async(req, res) => {
    const { email, password } = req.body

    if(!email || !password ) {
        throw new ApiError(
            400,
            "All fields are mandatory!"
        )
    }

    const user = await prisma.user.findUnique({
        where: {email: email}
    })

    if(!user) {
        throw new ApiError(
            400,
            "Invalid credentials"
        )
    }

    const compare = await isPasswordCorrect(password, user.password)

    if(!compare) {
        throw new ApiError(
            400,
            "Unauthorized access!!"
        )
    }

    const refreshToken = await generateRefreshToken(user.id)
    const accessToken = await generateAccessToken(user.id)

    user.refreshToken = refreshToken
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: refreshToken }
    })

    return res
        .status(200)
        .cookie(
            "refreshToken", 
            refreshToken, 
            { ...cookieOptions, maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY) }
        )
        .cookie(
            "accessToken", 
            accessToken,
            { ...cookieOptions, maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY) }
        )
        .json(
            new ApiResponse(
                200,
                "User logged in successfully😊"
            )
        )
    
})

const logout = asyncHandler( async(req, res) => {
    const userId = req.user?.id

    if(!userId) {
        throw new ApiError(
            400,
            "Can't proceed further"
        )
    }

    const user = await prisma.user.findUnique({
        where: { id: userId }  
    })

    if(!user) {
        throw new ApiError(
            400,
            "Can't proceed further"
        )
    }

    user.refreshToken = undefined
    await prisma.user.update({
        where: {id: userId},
        data: {refreshToken: undefined}
    })

    return res
        .status(200)
        .clearCookie(
            "refreshToken",
            cookieOptions
        )
        .clearCookie(
            "accessToken",
            cookieOptions
        )
        .json(
            new ApiResponse(
                200,
                "User logged out successfully!"
            )
        )


})

const me = asyncHandler( async(req, res) => {
    const userId = req.user?.id

    if(!userId) {
        throw new ApiError(
            400,
            "Unable to proceed further!"
        )
    }

    const user = await prisma.user.findUnique({
        where: { id:userId},
        select: {
            id: true,
            username: true,
            email: true,
            image: true,
            role: true,
            createdAt: true
        }
    })

    if(!user) {
        throw new ApiError(
            400,
            "Unable to proceed further!"
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User fetched successfully!"
            )
        )
})

// const updateImage = asyncHandler( async(req, res) => {
    
// })

export { 
    register, 
    login, 
    logout, 
    me,
    // updateImage
}
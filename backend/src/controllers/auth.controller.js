
import bcrypt from "bcryptjs";
import { prisma } from "../libs/prisma.ts";
import jwt from "jsonwebtoken";
import { UserRole } from "../generated/prisma/enums.ts";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const register =  asyncHandler(async (req, res) => {
  const { email, password, name, role="USER" } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role === "ADMIN" ? UserRole.ADMIN : UserRole.USER,
      },
    });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newUser,
          "User registered successfully"
        )
      );
  
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    };
    res.status(201).json(
      new ApiResponse(
        201,
        "User logged in successfully",
        sanitizedUser,
      )
    );
  
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
  
});

export const check = asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
      throw new ApiError(401, "No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        "Token is valid. User authenticated",
        user,
      )
    );
});

export const forgetPassword = asyncHandler(async (req, res) => {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }
    if (newPassword !== confirmPassword) {
      throw new ApiError(402, "Password and Confirm password are not match.");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Password updated successfully"
        )
      );
});

export const changeRole = asyncHandler(async (req, res) => {
    const { email} = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const newRole = user.role === "ADMIN" ? UserRole.USER : UserRole.ADMIN;

   const updatedUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        role: newRole,
      },
    });
    return res.status(200).json(
      new ApiResponse(
        200,
        updatedUser,
        "Role changed successfully",
      )
    );
  });
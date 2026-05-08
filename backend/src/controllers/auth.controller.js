// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"
// import { prisma } from "../lib/prisma.ts"
// import { ApiError } from "../utils/apiError.js"
// import { ApiResponse } from "../utils/apiResponse.js"
// import { uploadOnCloudinary } from "../utils/cloudinary.js"
// import asyncHandler from "../utils/asyncHandler.js"
// import ms from "ms" // to convert human readable time stamps to machine understandable ms 
// import { DEFAULT_IMAGE } from "../constants.js"

// const cookieOptions = {
//                 httpOnly: true,
//                 sameSite: "strict",
//                 secure: process.env.NODE_ENV !== "development"
//             }

// const generateRefreshToken = async function(id) {
//     return jwt.sign(
//         {
//             id
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: ms(process.env.REFRESH_TOKEN_EXPIRY)
//         }
//     )
// }

// const generateAccessToken = async function (id) {
//     return jwt.sign(
//         {
//             id
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: ms(process.env.ACCESS_TOKEN_EXPIRY)
//         }
//     )
// }

// const isPasswordCorrect = async function(password, prismapassword) {
//     return await bcrypt.compare(password, prismapassword)
// }

// const register = asyncHandler( async(req, res) => {

//     const { username, email, password, role } = req.body
    
//     console.log("username: ", username);
    

//     if(!username || !email || !password) {
//         throw new ApiError(
//             400,
//             "every field is mandatory!"
//         )
//     }
    
//     const existingUser = await prisma.user.findUnique({
//         where: {
//             email: email
//         }
//     });
    
//     if(existingUser) {
//         throw new ApiError(
//             400,
//             "User already exists"
//         )
//     }
    
//     const avatarUrl = req.file
//     ? (await uploadOnCloudinary(req.file.path))?.secure_url
//     : DEFAULT_IMAGE;

//     if(!avatarUrl) throw new ApiError(400, "error uploading the avatar")

//     const hashedPassword = await bcrypt.hash(password, 10)

//     const user = await prisma.user.create({
//         data: {
//             username,
//             email,
//             password: hashedPassword,
//             image: avatarUrl,
//             role: role || "USER"
//         }
//     })

//     if(!user) {
//         throw new ApiError(400, "User not created")
//     }

//     const createdUser = await prisma.user.findUnique({
//         where: { id: user.id },
//         select: {
//             id: true,
//             username: true,
//             email: true,
//             image: true,
//             role: true,
//             createdAt: true
//         }
//     })


//     if(!createdUser) {
//         throw new ApiError(400, "Error registering the user! Please try again later")
//     }

//     const token = await generateRefreshToken(user.id)

//     res.cookie(
//         "refreshToken",
//         token,
//         {
//             ...cookieOptions,
//             maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY)
//         }
//     )

//     user.refreshToken = token

//     await prisma.user.update({
//         where: { id: user.id },
//         data: { refreshToken: token }
//     });


//     return res.status(201).json(
//         new ApiResponse (
//             201,
//             createdUser,
//             "User registered successfully!",
//         )
//     )

// })

// const login = asyncHandler( async(req, res) => {
//     const { email, password } = req.body

//     if(!email || !password ) {
//         throw new ApiError(
//             400,
//             "All fields are mandatory!"
//         )
//     }

//     const user = await prisma.user.findUnique({
//         where: {email: email}
//     })

//     if(!user) {
//         throw new ApiError(
//             400,
//             "Invalid credentials"
//         )
//     }

//     const compare = await isPasswordCorrect(password, user.password)

//     if(!compare) {
//         throw new ApiError(
//             400,
//             "Unauthorized access!!"
//         )
//     }

//     const refreshToken = await generateRefreshToken(user.id)
//     const accessToken = await generateAccessToken(user.id)

//     user.refreshToken = refreshToken
//     await prisma.user.update({
//         where: { id: user.id },
//         data: { refreshToken: refreshToken }
//     })

//     return res
//         .status(200)
//         .cookie(
//             "refreshToken", 
//             refreshToken, 
//             { ...cookieOptions, maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY) }
//         )
//         .cookie(
//             "accessToken", 
//             accessToken,
//             { ...cookieOptions, maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY) }
//         )
//         .json(
//             new ApiResponse(
//                 200,
//                 "User logged in successfully😊"
//             )
//         )
    
// })

// const logout = asyncHandler( async(req, res) => {
//     const userId = req.user?.id

//     if(!userId) {
//         throw new ApiError(
//             400,
//             "Can't proceed further"
//         )
//     }

//     const user = await prisma.user.findUnique({
//         where: { id: userId }  
//     })

//     if(!user) {
//         throw new ApiError(
//             400,
//             "Can't proceed further"
//         )
//     }

//     user.refreshToken = undefined
//     await prisma.user.update({
//         where: {id: userId},
//         data: {refreshToken: undefined}
//     })

//     return res
//         .status(200)
//         .clearCookie(
//             "refreshToken",
//             cookieOptions
//         )
//         .clearCookie(
//             "accessToken",
//             cookieOptions
//         )
//         .json(
//             new ApiResponse(
//                 200,
//                 "User logged out successfully!"
//             )
//         )


// })

// const me = asyncHandler( async(req, res) => {
//     const userId = req.user?.id

//     if(!userId) {
//         throw new ApiError(
//             400,
//             "Unable to proceed further!"
//         )
//     }

//     const user = await prisma.user.findUnique({
//         where: { id:userId},
//         select: {
//             id: true,
//             username: true,
//             email: true,
//             image: true,
//             role: true,
//             createdAt: true
//         }
//     })

//     if(!user) {
//         throw new ApiError(
//             400,
//             "Unable to proceed further!"
//         )
//     }

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 user,
//                 "User fetched successfully!"
//             )
//         )
// })

// // const updateImage = asyncHandler( async(req, res) => {
    
// // })

// export { 
//     register, 
//     login, 
//     logout, 
//     me,
//     // updateImage
// }



import bcrypt from "bcryptjs";
import { prisma } from "../libs/prisma.ts";
import jwt from "jsonwebtoken";
import { UserRole } from "../generated/prisma/enums.ts";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const register =  asyncHandler(async (req, res) => {
  const { email, password, name, role="USER" } = req.body;
  try {
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
  } catch (error) {
    res.status(500).json({ message: "error connecting user", error });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
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
    res.status(201).json({
      success: true,
      message: "User login successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "login unsuccesful", error });
  }
});

export const logout = asyncHandler(async (req, res) => {
  try {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "logout unsuccesful", error });
  }
});

export const check = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token found" });
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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      user,
    });
  } catch (error) {
    console.error("Check route error:", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token", error });
  }
});

export const forgetPassword = asyncHandler(async (req, res) => {
  try {
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
      .json({
        message: "Password updated successfully.  Login with new password",
      });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error updating password");
  }
});

export const changeRole = asyncHandler(async (req, res) => {
  try {
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
    return res.status(200).json({
      message: "Role switched successfully",
      user: updatedUser,
      role: updatedUser.role,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error switching role");
  }
});
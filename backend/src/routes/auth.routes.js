import express from "express"
import {
    register,
    login,
    logout,
    me
} from "../controllers/auth.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const authroute = express.Router()

authroute.post("/register", upload.single("image"), register)
authroute.post("/login", login)
authroute.post("/logout", verifyJWT, logout)
authroute.get("/me", verifyJWT, me)

export default authroute
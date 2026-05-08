import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { chatWithAI } from "../controllers/chat.controller.js";

const chatRoutes = express.Router();

chatRoutes.post("/chat",authMiddleware, chatWithAI);

export default chatRoutes;
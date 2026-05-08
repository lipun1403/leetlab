import express from "express";
import { getDailyChallenge } from "../controllers/dailyChallenge.controller.js";

const router = express.Router();

router.get("/daily-challenge", getDailyChallenge);

export default router;
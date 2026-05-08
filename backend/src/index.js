import dotenv from "dotenv"

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`
})

import express from "express";
import cookieparser from "cookie-parser";
import problemRoutes from "./routes/problem.routes.js";
import authRoutes from "./routes/auth.routes.js";
import executionRoutes from "./routes/executeCode.route.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import cors from "cors";
import axios from "axios";
import { connectRedis } from "./libs/redis.js";
import healthcheckRoutes from "./routes/healthcheck.route.js";
import chatRoutes from "./routes/chat.route.js";
import dailyChallengeRoutes from "./routes/dailyChallenge.route.js";
const app = express();

app.use(express.json());
app.use(cookieparser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Set-Cookie", "*"],
  }),
);
app.get("/", (req, res) => {
  res.send("welcome to leetlab");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/health-check", healthcheckRoutes);
app.use("/api/v1", chatRoutes);
app.use("/api/v1", dailyChallengeRoutes);
app.listen(process.env.PORT, () =>
  console.log("server started at port for leetlab", process.env.PORT),
);
connectRedis();

const keepAlive = () => {
  setInterval(
    async () => {
      try {
        const res = await axios.get(
          `${process.env.BACKEND_URL}/api/v1/health-check`,
          { timeout: 4000 },
        );

        console.log("✅ Ping successful:", res.status);
      } catch (error) {
        console.warn("⚠️ Ping failed:", error.message);
      }
    },
    1000 * 60 * 10,
  );
};

keepAlive();
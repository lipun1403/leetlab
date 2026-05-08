// import express from "express"
// import { run, submit } from "../controllers/executeCode.controller.js"
// import { verifyJWT } from "../middlewares/auth.middleware.js"

// const executionRoute = express.Router()

// executionRoute.use(verifyJWT)

// executionRoute.post("/run", run)
// executionRoute.post("/submit", submit)

// export default executionRoute



import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { executeCode,submitCode } from "../controllers/executeCode.controller.js";
const executionRoutes = express.Router();

executionRoutes.post("/", authMiddleware, executeCode);
executionRoutes.post("/submit-code", authMiddleware, submitCode);

export default executionRoutes;
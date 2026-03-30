import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getAllSubmissions, getSubmissionsForProblem, getSubmissionCount} from "../controllers/submissions.controller.js"

const submissionRoutes = express.Router()

submissionRoutes.use(verifyJWT)

submissionRoutes.get("/getAllSubmissions", getAllSubmissions)
submissionRoutes.get("/getSubmissionsForProblem/:problemId", getSubmissionsForProblem)
submissionRoutes.get("/getSubmissionCount", getSubmissionCount)

export default submissionRoutes
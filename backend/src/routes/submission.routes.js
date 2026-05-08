// import express from "express"
// import { verifyJWT } from "../middlewares/auth.middleware.js"
// import { getAllSubmissions, getSubmissionsForProblem, getSubmissionCountForProblem} from "../controllers/submissions.controller.js"

// const submissionRoutes = express.Router()

// submissionRoutes.use(verifyJWT)

// submissionRoutes.get("/getAllSubmissions", getAllSubmissions)
// submissionRoutes.get("/getSubmissionsForProblem/:problemId", getSubmissionsForProblem)
// submissionRoutes.get("/getSubmissionCount/:problemId", getSubmissionCountForProblem)

// export default submissionRoutes



import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmissionsforaUser,getallSubmissionForProblembyUser,getTheSubmissionsCountForProblem} from "../controllers/submission.controller.js";
import express from "express";

const submissionRoutes= express.Router();

submissionRoutes.get("/get-all-submissions",authMiddleware,getAllSubmissionsforaUser); // replaced getAllSubmissions
submissionRoutes.get("/get-submissions/:problemId",authMiddleware,getallSubmissionForProblembyUser) //replaced getSubmissionsForProblem 
submissionRoutes.get("/get-submissions-count/:problemId",authMiddleware, getTheSubmissionsCountForProblem) //replaced with getAllTheSubmissionsForProblem 

export default submissionRoutes;


import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmissionsforaUser,getallSubmissionForProblembyUser,getTheSubmissionsCountForProblem} from "../controllers/submission.controller.js";
import express from "express";

const submissionRoutes= express.Router();

submissionRoutes.use(authMiddleware);

submissionRoutes.get("/get-all-submissions",getAllSubmissionsforaUser); 
submissionRoutes.get("/get-submissions/:problemId",getallSubmissionForProblembyUser);
submissionRoutes.get("/get-submissions-count/:problemId", getTheSubmissionsCountForProblem);

export default submissionRoutes;
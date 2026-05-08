
import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import{ createProblem,getAllProblems,getProblemById,updateProblem,deleteProblem,addtoCompanyTags,getSolvedProblemsSolveprismayUser } from "../controllers/problem.controller.js" 
const problemRoutes = express.Router();

problemRoutes.use(authMiddleware);

problemRoutes.post("/create-problem",checkAdmin,createProblem);
problemRoutes.get("/get-all-problems",getAllProblems);
problemRoutes.get("/get-problem/:id",getProblemById);
problemRoutes.put("/update-problem/:id",checkAdmin,updateProblem);    
problemRoutes.delete("/delete-problem/:id",checkAdmin,deleteProblem);
problemRoutes.get("/get-solved-problems",getSolvedProblemsSolveprismayUser);
problemRoutes.post("/add-to-company-tags",checkAdmin,addtoCompanyTags);

export default problemRoutes;
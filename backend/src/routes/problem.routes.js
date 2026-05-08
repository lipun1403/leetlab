// import express from "express"; 

// import { 
//     verifyJWT, 
//     checkAdmin 
// } from "../middlewares/auth.middleware.js";

// import { 
//     createProblem, 
//     updateProblem, 
//     getAllProblem, 
//     getProblemById,
//     deleteProblem,
//     getAllSolvedProblem
// } from "../controllers/problem.controller.js"

// const problemRoute = express.Router()

// problemRoute.use(verifyJWT)

// problemRoute.post("/createProblem", checkAdmin, createProblem)
// problemRoute.put("/updateProblem/:problemId", checkAdmin, updateProblem)
// problemRoute.get("/getAllProblems", getAllProblem)
// problemRoute.get("/getProblemById/:problemId", getProblemById)
// problemRoute.delete("/deleteProblem/:problemId", checkAdmin, deleteProblem)
// problemRoute.get("/getAllSolvedProblem", getAllSolvedProblem)


// export default problemRoute


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
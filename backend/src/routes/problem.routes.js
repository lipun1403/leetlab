import express from "express"; 

import { 
    verifyJWT, 
    checkAdmin 
} from "../middlewares/auth.middleware.js";

import { 
    createProblem, 
    updateProblem, 
    getAllProblem, 
    getProblemById,
    deleteProblem,
    getAllSolvedProblem
} from "../controllers/problem.controller.js"

const problemRoute = express.Router()

problemRoute.use(verifyJWT)

problemRoute.post("/createProblem", checkAdmin, createProblem)
problemRoute.put("/updateProblem/:problemId", checkAdmin, updateProblem)
problemRoute.get("/getAllProblems", getAllProblem)
problemRoute.get("/getProblemById/:problemId", getProblemById)
problemRoute.delete("/deleteProblem/:problemId", checkAdmin, deleteProblem)
problemRoute.get("/getAllSolvedProblem", getAllSolvedProblem)


export default problemRoute
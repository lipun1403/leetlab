import express from "express"
import { run, submit } from "../controllers/execute.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const executionRoute = express.Router()

executionRoute.use(verifyJWT)

executionRoute.post("/run", run)
executionRoute.post("/submit", submit)

export default executionRoute
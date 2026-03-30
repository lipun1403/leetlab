import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieparser from "cookie-parser"
import authroute from "./routes/auth.routes.js"
import problemRoute from "./routes/problem.routes.js"
import executionRoute from "./routes/execute.route.js"
import playlistRoute from "./routes/playlist.routes.js"

dotenv.config()

const port = process.env.PORT

const app = express()

app.use(cors())
app.use(cookieparser())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Welcome to leetlab🔥")
})

app.use("/api/v1/auth", authroute)
app.use("/api/v1/problems", problemRoute)
app.use("/api/v1/execution", executionRoute)
app.use("/api/v1/playlist", playlistRoute)

app.listen(port, (req, res) => {
    console.log(`Server is running on port: ${port}`);
})
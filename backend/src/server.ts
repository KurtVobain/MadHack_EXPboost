import "reflect-metadata"
import express from "express"
import cors from "cors"
import AppDataSource from "./data-source"
import battlepassRouter from "./routes/battlepass"
import profileRouter from "./routes/profile"
import authRouter from "./routes/auth"
import path from "path"

const app = express()

app.use(express.json())
app.use(cors())
app.use("/api", battlepassRouter)
app.use("/api", profileRouter)
app.use("/api", authRouter)
app.use(express.static(path.join(__dirname, "public")))
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/health", (req, res) => {
    res.status(200).send("OK")
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")

        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

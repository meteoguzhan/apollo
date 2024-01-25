import dotenv from "dotenv"
dotenv.config()
import express, { Express } from "express"
import { json, urlencoded } from "body-parser"
import errorHandler from "./utils/errorHandler"
import authRoutes from "./routes/authRoutes"
import indexRoutes from "./routes/indexRoutes"
import consumptionRoutes from "./routes/consumptionRoutes"

import "./utils/dbConfig"

const app: Express = express()

app.use(json())
app.use(urlencoded({ extended: true }))

app.use("/auth", authRoutes)
app.use("/index", indexRoutes)
app.use("/consumption", consumptionRoutes)

app.use(errorHandler)
const PORT: string | 3000 = process.env.PORT ?? 3000
app.listen(PORT, () => {
    console.log("Server running at http://127.0.0.1:" + PORT + "/")
})

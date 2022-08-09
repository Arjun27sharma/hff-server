import express from "express"
const app = express()
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import cookieParser from "cookie-parser"
// import bodyParser from "body-parser"

//Routes
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"


//Middlewares
// const urlEncodedParser = bodyParser.urlencoded({extended : false})
// app.use(bodyParser.json(), urlEncodedParser)
app.use(cors({credentials : true, origin : "http://localhost:3000"}))
app.use(express.json())
app.use(cookieParser())

app.use("/api", authRoutes)
app.use("/api", userRoutes)



//DB Connection
const DB_URL = process.env.DB_URL
mongoose.connect(DB_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true
})
.then(() => console.log("DB Connected"))
.catch(() => console.log("DB Not Connected"))






//Listening to port
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))



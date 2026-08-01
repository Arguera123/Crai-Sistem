import dotenv from "dotenv"
dotenv.config();
import express from 'express'
import morgan from 'morgan'
import passport from "passport"
import router from './router/index.router'
import { errorHandler } from './middleware/error.middleware';
import "./config/microsoft.config"
import { UserData } from './models/user.entity'
import cors from "cors"
import path from 'path'

const app = express();

declare global {
  namespace Express {
    interface Request {
      user_data?: UserData;
      token?: string;
    }
  }
}

app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(passport.initialize())
app.use(morgan('dev'))
app.use(express.json())
app.use("/api/v1", router)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

app.use(errorHandler);

export default app
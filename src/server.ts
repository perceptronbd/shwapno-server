import { errorMiddleware } from "./middlewares/error.middleware";
import { connectDB } from "./config/db.config";
import express, { Application } from "express";
import router from "./modules/routes/index";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

export const app: Application = express();
const port = process.env.PORT ?? 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// cross origin resource sharing
const corsOptions = {
  // allow all in the development mode
  origin: process.env.NODE_ENV === "development" ? "*" : process.env.CLIENT_URL,
  credentials: true,
};

app.use(cors(corsOptions));

// Routes
app.use("/api/v1", router);

app.use(errorMiddleware);

// start the server

const start = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is running on localhost:${port}/api/v1`);
    });
  } catch (error: unknown) {
    console.error(error);
  }
};

start();

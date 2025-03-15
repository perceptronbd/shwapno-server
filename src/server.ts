import { errorMiddleware } from "./middlewares/error.middleware";
import { connectDB } from "./config/db.config";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import router from "./root.route";
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
const allowedOrigins = [
  process.env.CLIENT_ADMIN_URL,
  process.env.CLIENT_ECOM_URL,
];

const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? true
      : (
          origin: string | undefined,
          callback: (err: Error | null, allow?: boolean) => void,
        ) => {
          if (origin && allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// Routes
app.use("/api/v1", router);

app.use(errorMiddleware);

// say hello
app.get("/", (_req, res) => {
  res.send("<h1>Welcome to shwapno API</h1>");
});

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

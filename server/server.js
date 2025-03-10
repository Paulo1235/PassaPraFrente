import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import StatusCodes from "http-status-codes";
import cookieParser from "cookie-parser";
import compression from "compression";
import pkg from "colors";

import { PORT, NODE_ENV } from "./config.js"

const { bold, green, underline } = pkg;

const app = express();

const corsOptions = {
  origin: `http://localhost:${PORT}`,
  method: ["POST", "GET", "PUT", "DELETE", "PATCH"],
};

const limiter = rateLimit({
  max: 50,
  windowMs: 10 * 60 * 1000,
  message: "Too many requests from this IP. Try again later.",
});

// Middlewares
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cors(corsOptions));
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(compression({ threshold: 1024 }));

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Hello World",
  });
});

app.all("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `${req.method} ${req.originalUrl} not found!`
  })
})

app.listen(PORT, () => {
  console.log(
    `\nServer is running.`. bold.green +
    "\nActive in: " + 
    `http://localhost:${PORT}`. underline.blue
  );
});

export default app;

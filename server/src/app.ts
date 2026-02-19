import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/errorMiddleware";

import path from "path";

import { apiReference } from "@scalar/express-api-reference";
import swaggerSpec from "./config/swagger";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Documentation
app.use(
  "/reference",
  apiReference({
    content: swaggerSpec,
  }),
);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as any;
  error.statusCode = 404;
  next(error);
});

// Global Error Handler
app.use(errorHandler);

export default app;

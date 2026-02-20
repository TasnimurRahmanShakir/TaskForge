import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  statusCode?: number;
  errors?: any;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Multer Errors
  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File too large (Max 10MB)";
    }
  }

  // Log only 500 errors or major issues if needed
  if (statusCode === 500) {
    console.error(`[ERROR] ${statusCode}: ${message}\nSTACK: ${err.stack}`);
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    errors: err.errors || null,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

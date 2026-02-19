import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

const validate =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation Error",
          errors: error.issues.map((issue) => ({
            path: issue.path[issue.path.length - 1],
            message: issue.message,
          })),
        });
      }
      next(error);
    }
  };

export default validate;

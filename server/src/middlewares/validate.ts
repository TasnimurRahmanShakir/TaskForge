import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

const validate =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed.body;
      if (parsed.query) Object.assign(req.query, parsed.query);
      if (parsed.params) Object.assign(req.params, parsed.params);

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

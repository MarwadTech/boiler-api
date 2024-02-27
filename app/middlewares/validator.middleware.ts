import { ApiError } from "@libs/responses";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const parsedErrors = errors.array().map((error: any) => {
      return { field: error.path, message: error.msg };
    });
    next(new ApiError(400, "Validation Error", parsedErrors));
  } else {
    return next();
  }
};

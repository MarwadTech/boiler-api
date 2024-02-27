import { NextFunction, Request, Response, RequestHandler } from "express";

/**
 * Wraps an asynchronous route handler to catch any asynchronous errors and pass them to the next middleware.
 *
 * @param {Function} fn - The asynchronous route handler function.
 * @returns {Function} - A new function that catches errors and passes them to the next middleware.
 */

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;

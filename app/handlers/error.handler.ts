import { ApiError, IResp } from "@libs/responses";
import { Request, Response, NextFunction } from "express";

const handleJwtError = () => {
  return new ApiError(401, "Unauthorized", [
    {
      field: "token",
      message: "Invalid token! Please log in again",
    },
  ]);
};

const handleJwtExpireError = () => {
  return new ApiError(401, "Unauthorized", [
    {
      field: "token",
      message: "Your token has expired! Please log in again",
    },
  ]);
};

const handleDuplicateDBError = (err: IResp) => {
  const errorMsgs = err.errors?.map((error) => {
    return { field: error.path, message: error.message };
  });
  return new ApiError(403, "Duplicate Entry", errorMsgs);
};

const handleValidationErrors = (err: IResp) => {
  const errorMsgs = err.errors?.map((error) => {
    return { field: error.path, message: error.message };
  });
  return new ApiError(403, "Validation Error", errorMsgs);
};

const sendErrorDev = (err: IResp, res: Response) => {
  console.error(err);
  const resp: IResp = {
    code: err.code,
    message: err.message,
    data: err.data || null,
    errors: err.errors || [],
    stack: err.stack,
  };
  res.status(resp.code || 500).json(resp);
};

const sendErrorProd = (err: IResp, res: Response) => {
  if (err.isOperational) {
    const resp: IResp = {
      code: err.code || 500,
      message: err.message,
      data: err.data || null,
      errors: err.errors,
    };
    res.status(resp.code || 500).json(resp);
  } else {
    console.error("ERROR 💥", err.name);
    const resp: IResp = {
      code: err.code || 500,
      message: "Internal server error",
      data: null,
      errors: [
        {
          field: "",
          message: "Something went very worng",
        },
      ],
    };
    res.status(500).json(resp);
  }
};

export const globalErrorHandler = (err: IResp, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "JsonWebTokenError") error = handleJwtError();
    if (err.name === "TokenExpiredError") error = handleJwtExpireError();
    if (err.name === "SequelizeUniqueConstraintError") error = handleDuplicateDBError(error);
    if (err.name === "SequelizeValidationError") error = handleValidationErrors(error);
    sendErrorProd(error, res);
  }
};

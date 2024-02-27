import { statusCodes, IResp, IErrors } from "./types";

export class ApiError extends Error implements IResp {
  public readonly code: statusCodes;
  public readonly message: string;
  public readonly errors: any[];
  public readonly data: any;
  public readonly isOperational: true;

  constructor(code: statusCodes, message = "Something went wrong", errors?: IErrors[]) {
    super();
    this.code = code;
    this.message = message;
    this.errors = errors || [];
    this.data = null;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

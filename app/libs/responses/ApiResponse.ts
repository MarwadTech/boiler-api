import { statusCodes, IResp, IErrors } from "./types";

export class ApiResponse implements IResp {
  public readonly code: statusCodes;
  public readonly message: string;
  public readonly data?: any;
  public readonly errors: any[];

  constructor(code: statusCodes, message = "Success", data?: any) {
    this.code = code;
    this.message = message;
    this.data = data || null;
    this.errors = [];
  }
}

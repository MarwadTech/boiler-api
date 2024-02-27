export type statusCodes = 200 | 201 | 400 | 401 | 404 | 404 | 402 | 409 | 403 | 500;

export interface IResp {
  readonly name?: string;
  readonly code: statusCodes;
  readonly message: string;
  readonly data?: any;
  readonly errors?: any[];
  readonly isOperational?: boolean;
  readonly stack?: any;
}

export interface IErrors {
  readonly field?: string;
  readonly message: string;
}

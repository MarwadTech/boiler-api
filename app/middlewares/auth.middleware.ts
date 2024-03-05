import { ApiError } from "@libs/responses";
import { UserService } from "@services";
import { NextFunction, Request, Response } from "express";
import { catchAsync, decodeToken } from "@utils";
import _ from "lodash";
import User from "app/models/user.model";

class AuthMiddleware extends UserService {
  protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (!_.isEmpty(req.headers.authorization) && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (_.isEmpty(token)) {
      return next(
        new ApiError(401, "Unauthorized", [
          {
            field: "token",
            message: "You are not logged in! Please login to get acesss.",
          },
        ])
      );
    }

    const decode = decodeToken(token);

    const user = await this.getById(decode.id);

    if (_.isEmpty(user)) {
      return next(
        new ApiError(401, "Unauthorized", [
          {
            field: "token",
            message: "The user belonging to this token does no longer exist!",
          },
        ])
      );
    }

    if (user?.status === "blocked") {
      return next(
        new ApiError(401, "Unauthorized", [
          {
            field: "phone_number",
            message: "User has been blocked by admin",
          },
        ])
      );
    }

    req.user = user as User;
    next();
  });

  restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user?.role as string)) {
        next(
          new ApiError(403, "Restricted", [
            {
              field: "token",
              message: "You do not have permission to perform this action!",
            },
          ])
        );
      }
      next();
    };
  };
}

export default new AuthMiddleware();

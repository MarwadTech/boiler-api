import { User } from "@models";
import { CommonService, Options } from "./common.service";
import QueryProcessor from "@libs/QueryProcessor";
import { ApiError } from "@libs/responses";
import { Op } from "sequelize";
import validator from "validator";

export class UserService extends CommonService<User> {
  constructor() {
    super(User);
  }

  protected getByEmailOrPhone = async (value: string, options?: Options): Promise<User | null> => {
    const user = await this.model.findOne({
      where: {
        [Op.or]: [
          {
            phone_number: value,
          },
          {
            email: value,
          },
        ],
      },
    });
    const isFor = validator.isEmail(value) ? "email" : "phone number";
    if (!user && !options?.throwError) throw new ApiError(404, "Failed to fetch user", [{ field: isFor.split(" ").join("_"), message: `User not found by ${isFor} ${value}` }]);
    return user;
  };

  protected getByEmail = async (email: string, options?: Options): Promise<User | null> => {
    const user = await this.get({ email }, { ...options, throwError: false });
    if (!user && options?.throwError) throw new ApiError(404, "Failed to fetch user", [{ field: "email", message: `User not found by email address ${email}` }]);
    return user;
  };

  protected getByPhoneNumber = async (phNum: string, options?: Options): Promise<User | null> => {
    const user = await this.get({ phone_number: phNum }, { ...options, throwError: false });
    if (!user && options?.throwError) throw new ApiError(404, "Failed to fetch user", [{ field: "phone_number", message: `User not found by phone number ${phNum}` }]);
    return user;
  };

  protected getAll = async (queryOptions: any): Promise<{ meta: any; list: any[] }> => {
    let users = new QueryProcessor(User, queryOptions).filter().sort().limitFields().paginate();
    return users.execute();
  };
}

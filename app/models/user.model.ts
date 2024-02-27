import { Model, DataTypes } from "sequelize";
import bcrypt from "bcrypt";

import sequelize from "../db/conn";
import { ValidUserRoles, ValidUserStatus } from "../contants";
import { helpers } from "@utils";

export interface IUser {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  status: string;
  role: string;
  password?: string | undefined;
}

export default class User extends Model<IUser> implements IUser {
  declare id: string;
  declare name: string;
  declare phone_number: string;
  declare email: string;
  declare status: string;
  declare role: string;
  declare password?: string | undefined;

  public async correctPassword(candidatePass: string): Promise<boolean> {
    return await bcrypt.compare(candidatePass, this.password as string);
  }
}

User.init(
  {
    id: helpers.uuid(DataTypes),
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name is required",
        },
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      unique: {
        name: "ph_num",
        msg: "Phone number already in use",
      },
      allowNull: false,
      validate: {
        is: {
          args: [/^\d{10}$/],
          msg: "Phone number must be a 10-digit number",
        },
        notNull: {
          msg: "Phone number is required",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "email",
        msg: "Email already in use",
      },
      validate: {
        notNull: {
          msg: "Email is required",
        },
        isEmail: {
          msg: "Invalid email address",
        },
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
      validate: {
        isCorrectStatus: (value: string) => {
          if (!ValidUserStatus.includes(value)) {
            throw new Error("Status must be either `active`, `inactive` or `blocked`");
          }
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
      validate: {
        isCorrectRole: (value: string) => {
          if (!ValidUserRoles.includes(value)) {
            throw new Error("Role must be either `user` or `admin`");
          }
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password is required",
        },
      },
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ["password"],
      },
    },
    scopes: {
      full: {},
    },
    sequelize,
    tableName: "users",
  }
);

User.beforeSave(async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user?.password as string, 8);
  }
});

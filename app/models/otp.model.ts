import { Model, DataTypes } from "sequelize";

import sequelize from "../db/conn";
import { optExpireMinutes } from "../contants";
import { helpers } from "@utils";
import moment from "moment";

export interface IOtp {
  id?: string;
  code?: string;
  phone_number?: string;
  email?: string;
  expire_on?: Date;
  is_verified?: boolean;
}

export default class Otp extends Model<IOtp> implements IOtp {
  declare id: string;
  declare code: string;
  declare phone_number: string;
  declare email: string;
  declare expire_on: Date;
  declare is_verified: boolean;
}

Otp.init(
  {
    id: helpers.uuid(DataTypes),
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: () => {
        return Math.floor(100000 + Math.random() * 900000);
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: [/^\d{10}$/],
          msg: "Phone number must be a 10-digit number",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Incorrect email address",
        },
      },
    },
    expire_on: {
      type: DataTypes.DATE,
      defaultValue: () => {
        return moment().local().add(optExpireMinutes, "minutes");
      },
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "otps",
  }
);

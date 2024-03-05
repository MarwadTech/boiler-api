import { Model, DataTypes } from "sequelize";

import sequelize from "../db/conn";
import { helpers } from "@utils";

export interface ICommmonData {
  id?: string;
  key: string;
  data: string;
}

export default class CommonData extends Model<ICommmonData> implements ICommmonData {
  declare id?: string;
  declare key: string;
  declare data: string;
}

CommonData.init(
  {
    id: helpers.uuid(DataTypes),
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "key",
        msg: "Key already exist",
      },
      validate: {
        notNull: {
          msg: "Key is required",
        },
      },
    },
    data: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Data is required",
        },
      },
    },
  },
  {
    sequelize,
    tableName: "common_data",
  }
);

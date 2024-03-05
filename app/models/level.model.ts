import { Model, DataTypes } from "sequelize";

import sequelize from "../db/conn";
import { helpers } from "@utils";

export interface ILevel {
  id?: string;
  level: number;
  title: string;
  percentage: number;
}

export default class Level extends Model<ILevel> implements ILevel {
  declare id?: string;
  declare level: number;
  declare title: string;
  declare percentage: number;
}

Level.init(
  {
    id: helpers.uuid(DataTypes),
    level: {
      type: DataTypes.INTEGER,
      unique: {
        name: "level",
        msg: "Level already exist",
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: "Level is required",
        },
      },
    },
    title: DataTypes.STRING,
    percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Percentage is required",
        },
      },
    },
  },
  {
    sequelize,
    tableName: "levels",
  }
);

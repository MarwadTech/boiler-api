import { Model, DataTypes } from "sequelize";

import sequelize from "../db/conn";
import { ValidQueryCategories } from "../contants";
import { helpers } from "@utils";
import User from "./user.model";

export interface IQuery {
  id?: string;
  user_id: string;
  category: string;
  query: string;
}

export default class Query extends Model<IQuery> implements IQuery {
  declare id: string;
  declare user_id: string;
  declare category: string;
  declare query: string;
}

Query.init(
  {
    id: helpers.uuid(DataTypes),
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User id is required",
        },
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isCorrectCategory: (value: string) => {
          if (!ValidQueryCategories.includes(value)) {
            throw new Error("Categ must be either `login` or `other`");
          }
        },
        notNull: {
          msg: "Category is required",
        },
      },
    },
    query: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Query is required",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Query",
    tableName: "queries",
  }
);

Query.belongsTo(User, { as: "user", foreignKey: "user_id" });

Query.beforeFind((user) => {
  user.include = ["user"];
});

import { Model, DataTypes } from "sequelize";

import sequelize from "../db/conn";
import { helpers } from "@utils";

export interface IReview {
  id?: string;
  given_by: string;
  taken_by: string;
  comment: string;
  value: number;
}

export default class Review extends Model<IReview> implements IReview {
  declare id: string;
  declare given_by: string;
  declare taken_by: string;
  declare comment: string;
  declare value: number;
}

Review.init(
  {
    id: helpers.uuid(DataTypes),
    given_by: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Given by is required",
        },
      },
    },
    taken_by: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Taken by is required",
        },
      },
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Comment is required",
        },
      },
    },
    value: {
      type: DataTypes.DECIMAL(10, 1),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Value is required",
        },
        max: {
          args: [5.0],
          msg: "Rating value must be less than or equal to 5",
        },
        min: {
          args: [0.5],
          msg: "Rating value must be greater than or equal to 0.5",
        },
      },
    },
  },
  {
    sequelize,
    tableName: "reviews",
  }
);

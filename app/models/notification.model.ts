import { Model, DataTypes } from "sequelize";

import sequelize from "../db/conn";
import { helpers } from "@utils";

export interface INotification {
  id?: string;
  user_id: string;
  heading: string;
  content: string;
  model_id: string;
  activity: string;
  image_id: string;
  read_at: string;
}

export default class Notification extends Model<INotification> implements INotification {
  declare id?: string;
  declare user_id: string;
  declare heading: string;
  declare content: string;
  declare model_id: string;
  declare activity: string;
  declare image_id: string;
  declare read_at: string;
}

Notification.init(
  {
    id: helpers.uuid(DataTypes),
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "user_id must be provided",
        },
      },
    },
    heading: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "heading must be provided",
        },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "content must be provided",
        },
      },
    },
    model_id: DataTypes.UUID,
    activity: DataTypes.STRING,
    image_id: DataTypes.UUID,
    read_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "notifications",
  }
);

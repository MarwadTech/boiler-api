import { Model, DataTypes } from "sequelize";

import sequelize from "../db/conn";
import { helpers } from "@utils";

export interface IMedia {
  id?: string;
  model_id?: string;
  model_type?: string;
  collection?: string;
  name?: string;
  type?: string;
  mime?: string;
  size?: string;
  path?: string;
  pic_thumbnail?: string;
  pic_medium?: string;
  pic_large?: string;
  sort_order?: string;
  disk?: string;
}

export default class Media extends Model<IMedia> implements IMedia {
  declare id?: string;
  declare model_id?: string;
  declare model_type?: string;
  declare collection?: string;
  declare name?: string;
  declare type?: string;
  declare mime?: string;
  declare size?: string;
  declare path?: string;
  declare pic_thumbnail?: string;
  declare pic_medium?: string;
  declare pic_large?: string;
  declare sort_order?: string;
  declare disk?: string;
}

Media.init(
  {
    id: helpers.uuid(DataTypes),
    model_id: DataTypes.UUID,
    model_type: DataTypes.STRING,
    collection: DataTypes.STRING,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    mime: DataTypes.STRING,
    size: DataTypes.INTEGER,
    path: DataTypes.STRING,
    pic_thumbnail: DataTypes.STRING,
    pic_medium: DataTypes.STRING,
    pic_large: DataTypes.STRING,
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    disk: { type: DataTypes.STRING, defaultValue: "local" },
  },
  {
    sequelize,
    tableName: "media",
  }
);

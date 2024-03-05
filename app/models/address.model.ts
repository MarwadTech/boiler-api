import { Model, DataTypes } from "sequelize";

import { ValidAddresTypes } from "../contants";
import sequelize from "../db/conn";
import { Op } from "sequelize";
import { helpers } from "@utils";

export interface IAddress {
  id?: string;
  user_name?: string;
  phone_number?: string;
  type: string;
  user_id: string;
  is_default?: boolean;
  line_1?: string;
  line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  pin_code?: string;
  geo_location?: string;
}

export default class Address extends Model<IAddress> implements IAddress {
  declare id: string;
  declare user_name: string;
  declare phone_number: string;
  declare type: string;
  declare user_id: string;
  declare is_default: boolean;
  declare line_1: string;
  declare line_2: string;
  declare city: string;
  declare state: string;
  declare country: string;
  declare pin_code: string;
  declare geo_location: string;

  public async makeDefault(userId: string): Promise<Address> {
    const [defaultAddress] = await Promise.all([this.update({ is_default: true }), Address.update({ is_default: false }, { where: { user_id: userId, id: { [Op.ne]: this.id } } })]);
    return defaultAddress;
  }
}

Address.init(
  {
    id: helpers.uuid(DataTypes),
    user_name: DataTypes.STRING,
    phone_number: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: [/^\d{10}$/],
          msg: "Phone number must be a 10-digit number",
        },
      },
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "home",
      validate: {
        isValidType: (value: string) => {
          if (ValidAddresTypes.includes(value)) {
            return new Error(`Type must be either 'work' or 'home'`);
          }
        },
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User id is required",
        },
      },
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    line_1: DataTypes.STRING,
    line_2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    pin_code: DataTypes.INTEGER,
    geo_location: DataTypes.GEOMETRY("POINT", 4326),
  },
  {
    sequelize,
    tableName: "addresses",
  }
);

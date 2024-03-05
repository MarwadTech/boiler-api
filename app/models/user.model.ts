import { Model, DataTypes, NonAttribute, QueryTypes } from "sequelize";
import bcrypt from "bcrypt";

import sequelize from "../db/conn";
import { ValidUserRoles, ValidUserStatus } from "../contants";
import { Association, HasOneGetAssociationMixin } from "sequelize";
import { helpers } from "@utils";

import Address from "./address.model";
import Media from "./media.model";

export interface IUser {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  status: string;
  avg_rating: number;
  role: string;
  password?: string | undefined;
}

export default class User extends Model<IUser> implements IUser {
  declare id: string;
  declare name: string;
  declare phone_number: string;
  declare email: string;
  declare status: string;
  declare avg_rating: number;
  declare role: string;
  declare password?: string | undefined;

  declare avatar: NonAttribute<User>;

  public async correctPassword(candidatePass: string): Promise<boolean> {
    return await bcrypt.compare(candidatePass, this.password as string);
  }

  public async reCalAvgRating(): Promise<User> {
    const { avgRating } = (await sequelize.query(`SELECT CAST(AVG(value) AS DECIMAL(8,1)) AS avgRating, COUNT(*) as count FROM reviews WHERE taken_by = :userId;`, {
      replacements: {
        userId: this.id,
      },
      type: QueryTypes.SELECT,
      plain: true,
    })) as { avgRating: number };
    return this.update({ avg_rating: avgRating });
  }

  declare static associations: {
    avatar: Association<User, Media>;
  };
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
      unique: {
        name: "email",
        msg: "Email already in use",
      },
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Invalid email address",
        },
        notNull: {
          msg: "Email is required",
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
    avg_rating: {
      type: DataTypes.DECIMAL(10, 1),
      defaultValue: 0,
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

User.hasMany(Address, { as: "addresses", foreignKey: "user_id" });

User.hasOne(Media, { as: "avatar", foreignKey: "model_id" });

User.beforeFind((user) => {
  user.include = [{ all: true, required: false }];
});

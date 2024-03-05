import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), "/.env") });

const { DB_HOST, DB_NAME, DB_USER, DB_USER_PASS } = process.env;

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_USER_PASS,
});

const sequelize = new Sequelize(DB_NAME || "", DB_USER || "", DB_USER_PASS, {
  dialect: "mysql",
  host: DB_HOST,
  logging: false,
  define: {
    timestamps: true,
    freezeTableName: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
});

/**
 * Connects to a database using Sequelize
 */

export const connectDB = async () => {
  try {
    (await connection).query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    (await connection).connect();
    await sequelize.authenticate();
    // this reflect models changes directlt into the database tables, basically no need to run migration
    await sequelize.sync({ alter: true });
    return sequelize;
  } catch (error) {
    throw error;
  }
};

export default sequelize;

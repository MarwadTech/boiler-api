import { config } from "dotenv";
import path from "path";
import winston, { format } from "winston";

config({ path: path.join(process.cwd(), ".env") });

const prodFormat = format.combine(
  format.timestamp(),
  format.printf((info) => `${info.timestamp} [${info.level}] ${info.message}`)
);

const devFormat = format.combine(format.colorize(), format.simple());

const transports: winston.transport[] = [];

if (process.env.NODE_ENV === "production") {
  transports.push(new winston.transports.File({ filename: "logs/logs.log" }));
} else {
  transports.push(new winston.transports.Console());
}

const logger = winston.createLogger({
  level: "info",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  defaultMeta: { service: "user-events" },
  transports,
});

export default logger;

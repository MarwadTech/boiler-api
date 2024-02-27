import "module-alias/register";
import app from "./app";
import { connectDB } from "./db/conn";

const PORT = process.env.PORT || "3000";

const startServer = () => {
  app.listen(PORT, () => {
    console.log("⚙️  Server is running on port: " + process.env.PORT);
  });
};

connectDB().then((sequelize) => {
  console.log(`\n☘️  MySql Connected! Db host: ${sequelize.config.host}\n`);
  startServer();
});

import EventEmitter from "events";

export const em = new EventEmitter();

em.on("REGISTER", (data) => {
  console.info("New user: ", data.first_name);
});

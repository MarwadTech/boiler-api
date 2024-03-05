## consist migration files

eg. users.js

```
const { ValidUserRoles } = require("../../../dist/app/contants");
const { uuid } = require("../../../dist/app/utils/helpers");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: uuid(Sequelize),
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
        index: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};

```

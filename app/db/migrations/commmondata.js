const { uuid } = require("../../../dist/app/utils/helpers");
const { timestamps } = require("../../../dist/app/contants");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("common_data", {
      id: uuid(Sequelize),
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      data: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ...timestamps(Sequelize),
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("common_data");
  },
};

const { uuid } = require("../../../dist/app/utils/helpers");
const { timestamps } = require("../../../dist/app/contants");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("levels", {
      id: uuid(Sequelize),
      level: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
      },
      title: Sequelize.STRING,
      percentage: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ...timestamps(Sequelize),
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("levels");
  },
};

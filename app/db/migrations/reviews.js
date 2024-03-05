const { uuid } = require("../../../dist/app/utils/helpers");
const { timestamps } = require("../../../dist/app/contants");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reviews", {
      id: uuid(Sequelize),
      given_by: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      taken_by: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      value: {
        type: Sequelize.DECIMAL(10, 1),
        allowNull: false,
      },
      ...timestamps(Sequelize),
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reviews");
  },
};

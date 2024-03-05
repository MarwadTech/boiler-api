const { uuid } = require("../../../dist/app/utils/helpers");
const { timestamps } = require("../../../dist/app/contants");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("addresses", {
      id: uuid(Sequelize),
      user_name: Sequelize.STRING,
      phone_number: Sequelize.STRING,
      type: {
        type: Sequelize.STRING,
        defaultValue: "home",
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      line_1: Sequelize.STRING,
      line_2: Sequelize.STRING,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      country: Sequelize.STRING,
      pin_code: Sequelize.INTEGER,
      geo_location: Sequelize.GEOMETRY("POINT", 4326),
      ...timestamps(Sequelize),
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("addresses");
  },
};

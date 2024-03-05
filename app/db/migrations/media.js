const { uuid } = require("../../../dist/app/utils/helpers");
const { timestamps } = require("../../../dist/app/contants");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("media", {
      id: uuid(Sequelize),
      model_id: Sequelize.UUID,
      model_type: Sequelize.STRING,
      collection: Sequelize.STRING,
      name: Sequelize.STRING,
      type: Sequelize.STRING,
      mime: Sequelize.STRING,
      size: Sequelize.INTEGER,
      path: Sequelize.STRING,
      pic_thumbnail: Sequelize.STRING,
      pic_medium: Sequelize.STRING,
      pic_large: Sequelize.STRING,
      sort_order: { type: Sequelize.INTEGER, defaultValue: 0 },
      disk: { type: Sequelize.STRING, defaultValue: "local" },
      ...timestamps(Sequelize),
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("media");
  },
};

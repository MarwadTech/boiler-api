const { uuid } = require("../../../dist/app/utils/helpers");
const { timestamps } = require("../../../dist/app/contants");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notifications", {
      id: uuid(Sequelize),
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      heading: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      model_id: DataTypes.UUID,
      activity: DataTypes.STRING,
      image_id: DataTypes.UUID,
      read_at: DataTypes.DATE,
      ...timestamps(Sequelize),
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("notifications");
  },
};

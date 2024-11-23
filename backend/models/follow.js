const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Follow = sequelize.define(
  "follow",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Follow;

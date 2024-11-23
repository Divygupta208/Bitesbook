const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Favorite = sequelize.define(
  "Favorite",
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

module.exports = Favorite;

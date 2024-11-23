const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const CollectionRecipe = sequelize.define(
  "CollectionRecipe",
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

module.exports = CollectionRecipe;

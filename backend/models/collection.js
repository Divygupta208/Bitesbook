const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Collection = sequelize.define(
  "Collection",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Collection;

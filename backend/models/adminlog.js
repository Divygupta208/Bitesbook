const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const AdminLog = sequelize.define(
  "AdminLog",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    action: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = AdminLog;

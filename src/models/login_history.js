const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LoginHistory = sequelize.define(
  "LoginHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        id: "id",
      },
      onDelete: "CASCADE",
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIP: true,
      },
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    client_info: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "login_history",
    timestamps: false,
  }
);

module.exports = LoginHistory;

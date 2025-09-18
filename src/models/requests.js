const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Request = sequelize.define(
  "Request",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
        len: [5, 100],
      },
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 10],
      },
    },
    study_level: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        notEmpty: true,
      },
    },
    specialzation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.INET,
      allowNull: true,
      references: {
        isIP: true,
      },
    },
    user_agent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 200],
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "requests",
    timestamps: false,
  }
);

module.exports = Request;

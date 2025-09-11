const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Module = sequelize.define(
  "Module",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    semester_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "semesters",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    coefficient: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
  },
  {
    tableName: "modules",
    timestamps: false,
  }
);

module.exports = Module;
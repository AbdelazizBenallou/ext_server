const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StudyLevel = sequelize.define(
  "StudyLevel",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    level_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    tableName: "study_levels",
    timestamps: false,
  }
);

module.exports = StudyLevel;
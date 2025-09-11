const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Semester = sequelize.define(
  "Semester",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    semester_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_current: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    study_level_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "study_levels",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "semesters",
    timestamps: false,
  }
);

module.exports = Semester;

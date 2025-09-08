const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Specialization = sequelize.define(
  "Specialization",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    specialization_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
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

    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "specializations",
    timestamps: false,
  }
);

module.exports = Specialization;

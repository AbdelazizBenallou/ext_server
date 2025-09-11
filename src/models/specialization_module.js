const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SP_Module = sequelize.define(
  "Specialization_Module",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    specialization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "specializations",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "modules",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "specialization_modules",
    timestamps: false,
  }
);

module.exports = SP_Module ;

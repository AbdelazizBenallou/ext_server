const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ModuleFiles = sequelize.define(
  "ModuleFiles",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    file_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "file_types",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    upload_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    study_year_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "study_years",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "module_files",
    timestamps: false,
  }
);

module.exports = ModuleFiles;

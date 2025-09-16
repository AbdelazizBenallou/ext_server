const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ModuleFileType = sequelize.define(
  "ModuleFileType",
  {
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "modules",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    file_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "file_types",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "module_allowed_file_types",
    timestamps: false,
  }
);

module.exports = ModuleFileType;

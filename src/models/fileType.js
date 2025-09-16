const Datatypes = require("sequelize").DataTypes;
const sequelize = require("../config/database");

const FileType = sequelize.define(
  "FileType",
  {
    id: {
      type: Datatypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Datatypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 10],
      },
    },
    description: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 255],
        notNull: {
          msg: "Description is required",
        },
      },
    },
  },
  {
    tableName: "file_types",
    timestamps: false,
  }
);

module.exports = FileType;

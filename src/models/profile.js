const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Profile = sequelize.define(
  "Profile",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: true,
    },

    matricule: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: true,
    },

    wilaya: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    commune: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    specialization_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "specializations",
        key: "id",
      },
      onDelete: "CASCADE",
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
    tableName: "profiles",
    timestamps: false,
  }
);

module.exports = Profile;

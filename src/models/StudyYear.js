const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const StudyYear = sequelize.define('StudyYear', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  year_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
}, {
  tableName: 'study_year',
  timestamps: false,
});

module.exports = StudyYear;

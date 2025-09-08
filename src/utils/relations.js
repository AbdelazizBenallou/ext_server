const User = require("../models/user");
const Profile = require("../models/profile");
const StudyLevel = require("../models/StudyLevel");
const Specialization = require("../models/specializations");

User.hasOne(Profile, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
Profile.belongsTo(User, {
  foreignKey: "user_id",
});

StudyLevel.hasMany(Specialization, {
  foreignKey: "study_level_id",
  onDelete: "CASCADE",
});
Specialization.belongsTo(StudyLevel, {
  foreignKey: "study_level_id",
});

Specialization.hasMany(Profile, {
  foreignKey: "specialization_id",
  onDelete: "CASCADE",
});
Profile.belongsTo(Specialization, {
  foreignKey: "specialization_id",
});

StudyLevel.hasMany(Profile, {
  foreignKey: "study_level_id",
  onDelete: "CASCADE",
});
Profile.belongsTo(StudyLevel, {
  foreignKey: "study_level_id",
});

module.exports = {
  User,
  Profile,
  StudyLevel,
  Specialization,
};

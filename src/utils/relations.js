const User = require("../models/user");
const Profile = require("../models/profile");
const StudyLevel = require("../models/StudyLevel");
const Specialization = require("../models/specializations");
const Module = require("../models/module");
const Semester = require("../models/semester");
const SP_Module = require("../models/specialization_module");
const ModuleFiles = require("../models/moduleFiles");
const FileType = require("../models/fileType");
const ModuleFileType = require("../models/module_typefiles");
const LoginHistory = require("../models/login_history");

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

Semester.belongsTo(StudyLevel, {
  foreignKey: "study_level_id",
});
StudyLevel.hasMany(Semester, {
  foreignKey: "study_level_id",
  onDelete: "CASCADE",
});

Semester.hasMany(Module, {
  foreignKey: "semester_id",
  onDelete: "CASCADE",
});
Module.belongsTo(Semester, {
  foreignKey: "semester_id",
});

SP_Module.belongsTo(Specialization, {
  foreignKey: "specialization_id",
});
Specialization.hasMany(SP_Module, {
  foreignKey: "specialization_id",
  onDelete: "CASCADE",
});

SP_Module.belongsTo(Module, {
  foreignKey: "module_id",
});
Module.hasMany(SP_Module, {
  foreignKey: "module_id",
  onDelete: "CASCADE",
});

ModuleFiles.belongsTo(Module, {
  foreignKey: "module_id",
});
Module.hasMany(ModuleFiles, {
  foreignKey: "module_id",
  onDelete: "CASCADE",
});

ModuleFiles.belongsTo(User, {
  foreignKey: "uploaded_by",
});
User.hasMany(ModuleFiles, {
  foreignKey: "uploaded_by",
  onDelete: "SET NULL",
});

ModuleFiles.belongsTo(StudyLevel, {
  foreignKey: "study_year_id",
});
StudyLevel.hasMany(ModuleFiles, {
  foreignKey: "study_year_id",
  onDelete: "CASCADE",
});

FileType.belongsToMany(Module, {
  through: ModuleFileType,
  foreignKey: "file_type_id",
  otherKey: "module_id",
});
Module.belongsToMany(FileType, {
  through: ModuleFileType,
  foreignKey: "module_id",
  otherKey: "file_type_id",
});

User.hasMany(LoginHistory, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
LoginHistory.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = {
  User,
  Profile,
  StudyLevel,
  Specialization,
  Semester,
  Module,
  SP_Module,
  ModuleFiles,
  FileType,
  ModuleFileType,
  LoginHistory,
};
